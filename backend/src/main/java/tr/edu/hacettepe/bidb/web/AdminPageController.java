package tr.edu.hacettepe.bidb.web;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.model.Document;
import tr.edu.hacettepe.bidb.model.Page;
import tr.edu.hacettepe.bidb.model.PageRevision;
import tr.edu.hacettepe.bidb.model.Redirect;
import tr.edu.hacettepe.bidb.repo.DocumentRepo;
import tr.edu.hacettepe.bidb.repo.PageRepo;
import tr.edu.hacettepe.bidb.repo.PageRevisionRepo;
import tr.edu.hacettepe.bidb.repo.RedirectRepo;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;

/**
 * Sayfa yönetimi: metin düzenleme, sürüm geçmişi, sayfa ekleme/silme,
 * adres değiştirme ve sayfaya bağlı belgeler.
 *
 * Metin her kaydedilmeden önce eski hâli sürüm olarak saklanır; yanlış bir
 * düzenleme geri alınabilir.
 */
@RestController
@RequestMapping("/api/yonetim/sayfa")
public class AdminPageController {

    private final PageRepo sayfalar;
    private final PageRevisionRepo surumler;
    private final DocumentRepo belgeler;
    private final RedirectRepo yonlendirmeler;

    public AdminPageController(PageRepo sayfalar, PageRevisionRepo surumler,
                                  DocumentRepo belgeler, RedirectRepo yonlendirmeler) {
        this.sayfalar = sayfalar;
        this.surumler = surumler;
        this.belgeler = belgeler;
        this.yonlendirmeler = yonlendirmeler;
    }

    private static String kullanici(Authentication kimlik) {
        return kimlik == null ? "bilinmiyor" : kimlik.getName();
    }

    /** Kaydetmeden önceki hâli sürüm olarak saklar. */
    private void surumAl(Page s, String aciklama, Authentication kimlik) {
        PageRevision sur = new PageRevision();
        sur.setSayfaId(s.getId());
        sur.setBaslik(s.getBaslik());
        sur.setIcerikHtml(s.getIcerikHtml() == null ? "" : s.getIcerikHtml());
        sur.setAciklama(aciklama);
        sur.setKaydeden(kullanici(kimlik));
        surumler.save(sur);
    }

    /* ---------- sayfa metni ---------- */

    public record IcerikIstek(String baslik, String icerikHtml, String aciklama) {}

    @PutMapping("/{id}/icerik")
    @Transactional
    public ResponseEntity<?> icerikKaydet(@PathVariable Long id,
                                          @RequestBody IcerikIstek istek,
                                          Authentication kimlik) {
        return sayfalar.findById(id).map(s -> {
            surumAl(s, istek.aciklama(), kimlik);
            if (istek.baslik() != null && !istek.baslik().isBlank()) s.setBaslik(istek.baslik().trim());
            s.setIcerikHtml(istek.icerikHtml() == null ? "" : istek.icerikHtml());
            s.setGuncelleme(OffsetDateTime.now());
            sayfalar.save(s);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    /* ---------- sürüm geçmişi ---------- */

    public record SurumGorunum(Long id, String baslik, String aciklama, String kaydeden,
                               String zaman, int uzunluk) {}

    @GetMapping("/{id}/surumler")
    public List<SurumGorunum> surumListesi(@PathVariable Long id) {
        return surumler.findBySayfaIdOrderByKayitZamaniDesc(id).stream()
                .map(v -> new SurumGorunum(v.getId(), v.getBaslik(), v.getAciklama(), v.getKaydeden(),
                        v.getKayitZamani() == null ? "" : v.getKayitZamani().toString(),
                        v.getIcerikHtml().length()))
                .toList();
    }

    /** Bir sürümün içeriğini önizleme için döndürür. */
    @GetMapping("/surum/{surumId}")
    public ResponseEntity<PageRevision> surum(@PathVariable Long surumId) {
        return surumler.findById(surumId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    /** Sayfayı seçilen sürüme döndürür. Geri almadan önce mevcut hâl de saklanır. */
    @PostMapping("/{id}/geri-al/{surumId}")
    @Transactional
    public ResponseEntity<?> geriAl(@PathVariable Long id, @PathVariable Long surumId,
                                    Authentication kimlik) {
        var sayfa = sayfalar.findById(id);
        var surum = surumler.findById(surumId);
        if (sayfa.isEmpty() || surum.isEmpty()) return ResponseEntity.notFound().build();
        if (!surum.get().getSayfaId().equals(id)) {
            return ResponseEntity.badRequest().body("Sürüm bu sayfaya ait değil.");
        }

        Page s = sayfa.get();
        surumAl(s, "Geri alma öncesi", kimlik);
        s.setBaslik(surum.get().getBaslik());
        s.setIcerikHtml(surum.get().getIcerikHtml());
        s.setGuncelleme(OffsetDateTime.now());
        sayfalar.save(s);
        return ResponseEntity.ok().build();
    }

    /* ---------- sayfa ekleme, silme, adres ---------- */

    public record YeniSayfaIstek(String dil, String slug, String baslik, String icerikHtml) {}

    @PostMapping
    @Transactional
    public ResponseEntity<?> sayfaEkle(@RequestBody YeniSayfaIstek istek) {
        String dil = istek.dil() == null ? "tr" : istek.dil().trim().toLowerCase(Locale.ROOT);
        String slug = temizSlug(istek.slug());
        if (slug.isBlank()) return ResponseEntity.badRequest().body("Adres boş olamaz.");
        if (sayfalar.findBySlugAndLanguage(slug, dil).isPresent()) {
            return ResponseEntity.badRequest().body("Bu adres zaten kullanılıyor: /" + dil + "/" + slug);
        }

        Page s = new Page();
        s.setDil(dil);
        s.setSlug(slug);
        s.setBaslik(istek.baslik() == null ? slug : istek.baslik().trim());
        s.setIcerikHtml(istek.icerikHtml() == null ? "" : istek.icerikHtml());
        s.setYayinda(true);
        s.setSira(9000);
        s.setGuncelleme(OffsetDateTime.now());
        return ResponseEntity.ok(sayfalar.save(s));
    }

    public record AdresIstek(String slug, String baslik) {}

    /**
     * Sayfanın adresini değiştirir ve eski adresi yeni adrese yönlendirir.
     * Yönlendirme olmadan, dışarıdan verilmiş her bağlantı kırılırdı.
     */
    @PutMapping("/{id}/adres")
    @Transactional
    public ResponseEntity<?> adresDegistir(@PathVariable Long id, @RequestBody AdresIstek istek) {
        return sayfalar.findById(id).map(s -> {
            String yeni = temizSlug(istek.slug());
            if (yeni.isBlank()) return ResponseEntity.badRequest().body("Adres boş olamaz.");

            if (!yeni.equals(s.getSlug())) {
                if (sayfalar.findBySlugAndLanguage(yeni, s.getDil()).isPresent()) {
                    return ResponseEntity.badRequest().body("Bu adres zaten kullanılıyor: /" + s.getDil() + "/" + yeni);
                }
                String eskiYol = "/" + s.getDil() + "/" + s.getSlug();
                String yeniYol = "/" + s.getDil() + "/" + yeni;

                // Eski adres yenisine taşınır. Daha önce bu sayfaya yönlendirilen
                // adresler de zincir oluşmaması için doğrudan yeni adrese bağlanır.
                yonlendirmeler.findAll().stream()
                        .filter(y -> y.getYeniYol().equals(eskiYol))
                        .forEach(y -> { y.setYeniYol(yeniYol); yonlendirmeler.save(y); });

                Redirect y = yonlendirmeler.findByEskiYol(eskiYol).orElseGet(Redirect::new);
                y.setEskiYol(eskiYol);
                y.setYeniYol(yeniYol);
                yonlendirmeler.save(y);

                s.setSlug(yeni);
            }
            if (istek.baslik() != null && !istek.baslik().isBlank()) s.setBaslik(istek.baslik().trim());
            s.setGuncelleme(OffsetDateTime.now());
            sayfalar.save(s);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> sayfaSil(@PathVariable Long id) {
        if (!sayfalar.existsById(id)) return ResponseEntity.notFound().build();
        sayfalar.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /** Adres olarak kullanılabilir sade bir metin üretir. */
    private static String temizSlug(String ham) {
        if (ham == null) return "";
        String s = ham.trim().toLowerCase(Locale.forLanguageTag("tr"));
        s = s.replace("ı", "i").replace("ğ", "g").replace("ü", "u")
             .replace("ş", "s").replace("ö", "o").replace("ç", "c");
        s = s.replaceAll("[^a-z0-9-]+", "-").replaceAll("-{2,}", "-").replaceAll("^-|-$", "");
        return s;
    }

    /* ---------- sayfaya bağlı belgeler ---------- */

    public record BelgeIstek(String ad, String adres, int sira) {}

    @GetMapping("/{id}/belgeler")
    public List<Document> belgeListesi(@PathVariable Long id) {
        return belgeler.findBySayfa_IdOrderBySiraAsc(id);
    }

    @PostMapping("/{id}/belgeler")
    @Transactional
    public ResponseEntity<?> belgeEkle(@PathVariable Long id, @RequestBody BelgeIstek istek) {
        return sayfalar.findById(id).map(s -> {
            Document b = new Document();
            b.setSayfa(s);
            aktar(istek, b);
            return ResponseEntity.ok(belgeler.save(b));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/belge/{belgeId}")
    @Transactional
    public ResponseEntity<?> belgeGuncelle(@PathVariable Long belgeId, @RequestBody BelgeIstek istek) {
        return belgeler.findById(belgeId).map(b -> {
            aktar(istek, b);
            return ResponseEntity.ok(belgeler.save(b));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/belge/{belgeId}")
    @Transactional
    public ResponseEntity<Void> belgeSil(@PathVariable Long belgeId) {
        if (!belgeler.existsById(belgeId)) return ResponseEntity.notFound().build();
        belgeler.deleteById(belgeId);
        return ResponseEntity.noContent().build();
    }

    private void aktar(BelgeIstek istek, Document b) {
        b.setAd(istek.ad());
        b.setAdres(istek.adres());
        b.setSira(istek.sira());
        // Tür, dosya uzantısından belirlenir (listede rozet olarak gösterilir)
        String adres = istek.adres() == null ? "" : istek.adres();
        int nokta = adres.lastIndexOf('.');
        b.setTur(nokta > 0 && nokta < adres.length() - 1
                ? adres.substring(nokta + 1).replaceAll("[?#].*$", "").toUpperCase(Locale.ROOT)
                : null);
    }
}
