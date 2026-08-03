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
@RequestMapping("/api/admin/pages")
public class AdminPageController {

    private final PageRepo pages;
    private final PageRevisionRepo revisions;
    private final DocumentRepo documents;
    private final RedirectRepo yonlendirmeler;

    public AdminPageController(PageRepo pages, PageRevisionRepo revisions,
                                  DocumentRepo documents, RedirectRepo yonlendirmeler) {
        this.pages = pages;
        this.revisions = revisions;
        this.documents = documents;
        this.yonlendirmeler = yonlendirmeler;
    }

    private static String kullanici(Authentication kimlik) {
        return kimlik == null ? "bilinmiyor" : kimlik.getName();
    }

    /** Kaydetmeden önceki hâli sürüm olarak saklar. */
    private void saveRevision(Page s, String note, Authentication kimlik) {
        PageRevision sur = new PageRevision();
        sur.setPageId(s.getId());
        sur.setTitle(s.getTitle());
        sur.setContentHtml(s.getContentHtml() == null ? "" : s.getContentHtml());
        sur.setNote(note);
        sur.setSavedBy(kullanici(kimlik));
        revisions.save(sur);
    }

    /* ---------- sayfa metni ---------- */

    public record IcerikIstek(String title, String contentHtml, String note) {}

    @PutMapping("/{id}/content")
    @Transactional
    public ResponseEntity<?> icerikKaydet(@PathVariable Long id,
                                          @RequestBody IcerikIstek istek,
                                          Authentication kimlik) {
        return pages.findById(id).map(s -> {
            saveRevision(s, istek.note(), kimlik);
            if (istek.title() != null && !istek.title().isBlank()) s.setTitle(istek.title().trim());
            s.setContentHtml(istek.contentHtml() == null ? "" : istek.contentHtml());
            s.setUpdatedAt(OffsetDateTime.now());
            pages.save(s);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    /* ---------- sürüm geçmişi ---------- */

    public record SurumGorunum(Long id, String title, String note, String savedBy,
                               String savedAt, int length) {}

    @GetMapping("/{id}/revisions")
    public List<SurumGorunum> revisionList(@PathVariable Long id) {
        return revisions.findByPageIdOrderBySavedAtDesc(id).stream()
                .map(v -> new SurumGorunum(v.getId(), v.getTitle(), v.getNote(), v.getSavedBy(),
                        v.getSavedAt() == null ? "" : v.getSavedAt().toString(),
                        v.getContentHtml().length()))
                .toList();
    }

    /** Bir sürümün içeriğini önizleme için döndürür. */
    @GetMapping("/revisions/{revisionId}")
    public ResponseEntity<PageRevision> revision(@PathVariable Long revisionId) {
        return revisions.findById(revisionId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    /** Sayfayı seçilen sürüme döndürür. Geri almadan önce mevcut hâl de saklanır. */
    @PostMapping("/{id}/restore/{revisionId}")
    @Transactional
    public ResponseEntity<?> geriAl(@PathVariable Long id, @PathVariable Long revisionId,
                                    Authentication kimlik) {
        var sayfa = pages.findById(id);
        var revision = revisions.findById(revisionId);
        if (sayfa.isEmpty() || revision.isEmpty()) return ResponseEntity.notFound().build();
        if (!revision.get().getPageId().equals(id)) {
            return ResponseEntity.badRequest().body("Sürüm bu sayfaya ait değil.");
        }

        Page s = sayfa.get();
        saveRevision(s, "Geri alma öncesi", kimlik);
        s.setTitle(revision.get().getTitle());
        s.setContentHtml(revision.get().getContentHtml());
        s.setUpdatedAt(OffsetDateTime.now());
        pages.save(s);
        return ResponseEntity.ok().build();
    }

    /* ---------- sayfa ekleme, silme, url ---------- */

    public record YeniSayfaIstek(String language, String slug, String title, String contentHtml) {}

    @PostMapping
    @Transactional
    public ResponseEntity<?> sayfaEkle(@RequestBody YeniSayfaIstek istek) {
        String language = istek.language() == null ? "tr" : istek.language().trim().toLowerCase(Locale.ROOT);
        String slug = temizSlug(istek.slug());
        if (slug.isBlank()) return ResponseEntity.badRequest().body("Adres boş olamaz.");
        if (pages.existsBySlugAndLanguage(slug, language)) {
            return ResponseEntity.badRequest().body("Bu adres zaten kullanılıyor: /" + language + "/" + slug);
        }

        Page s = new Page();
        s.setLanguage(language);
        s.setSlug(slug);
        s.setTitle(istek.title() == null ? slug : istek.title().trim());
        s.setContentHtml(istek.contentHtml() == null ? "" : istek.contentHtml());
        s.setPublished(true);
        s.setSortOrder(9000);
        s.setUpdatedAt(OffsetDateTime.now());
        return ResponseEntity.ok(pages.save(s));
    }

    public record AdresIstek(String slug, String title) {}

    /**
     * Sayfanın adresini değiştirir ve eski adresi yeni adrese yönlendirir.
     * Yönlendirme olmadan, dışarıdan verilmiş her bağlantı kırılırdı.
     */
    @PutMapping("/{id}/address")
    @Transactional
    public ResponseEntity<?> adresDegistir(@PathVariable Long id, @RequestBody AdresIstek istek) {
        return pages.findById(id).map(s -> {
            String yeni = temizSlug(istek.slug());
            if (yeni.isBlank()) return ResponseEntity.badRequest().body("Adres boş olamaz.");

            if (!yeni.equals(s.getSlug())) {
                if (pages.existsBySlugAndLanguage(yeni, s.getLanguage())) {
                    return ResponseEntity.badRequest().body("Bu adres zaten kullanılıyor: /" + s.getLanguage() + "/" + yeni);
                }
                String oldPath = "/" + s.getLanguage() + "/" + s.getSlug();
                String newPath = "/" + s.getLanguage() + "/" + yeni;

                // Eski adres yenisine taşınır. Daha önce bu sayfaya yönlendirilen
                // adresler de zincir oluşmaması için doğrudan yeni adrese bağlanır.
                yonlendirmeler.findAll().stream()
                        .filter(y -> y.getNewPath().equals(oldPath))
                        .forEach(y -> { y.setNewPath(newPath); yonlendirmeler.save(y); });

                Redirect y = yonlendirmeler.findByOldPath(oldPath).orElseGet(Redirect::new);
                y.setOldPath(oldPath);
                y.setNewPath(newPath);
                yonlendirmeler.save(y);

                s.setSlug(yeni);
            }
            if (istek.title() != null && !istek.title().isBlank()) s.setTitle(istek.title().trim());
            s.setUpdatedAt(OffsetDateTime.now());
            pages.save(s);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> sayfaSil(@PathVariable Long id) {
        if (!pages.existsById(id)) return ResponseEntity.notFound().build();
        pages.deleteById(id);
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

    /* ---------- sayfaya bağlı documents ---------- */

    public record BelgeIstek(String name, String url, int sortOrder) {}

    @GetMapping("/{id}/documents")
    public List<Document> belgeListesi(@PathVariable Long id) {
        return documents.findByPage_IdOrderBySortOrderAsc(id);
    }

    private static String belgeHatasi(BelgeIstek istek) {
        if (Girdi.bos(istek.name())) return "Belge adı boş olamaz.";
        if (!Girdi.gecerliBaglanti(istek.url())) return "Belge adresi geçersiz.";
        return null;
    }

    @PostMapping("/{id}/documents")
    @Transactional
    public ResponseEntity<?> belgeEkle(@PathVariable Long id, @RequestBody BelgeIstek istek) {
        String hata = belgeHatasi(istek);
        if (hata != null) return ResponseEntity.badRequest().body(hata);
        return pages.findById(id).map(s -> {
            Document b = new Document();
            b.setPage(s);
            aktar(istek, b);
            return ResponseEntity.ok(documents.save(b));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/documents/{documentId}")
    @Transactional
    public ResponseEntity<?> belgeGuncelle(@PathVariable Long documentId, @RequestBody BelgeIstek istek) {
        String hata = belgeHatasi(istek);
        if (hata != null) return ResponseEntity.badRequest().body(hata);
        return documents.findById(documentId).map(b -> {
            aktar(istek, b);
            return ResponseEntity.ok(documents.save(b));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/documents/{documentId}")
    @Transactional
    public ResponseEntity<Void> belgeSil(@PathVariable Long documentId) {
        if (!documents.existsById(documentId)) return ResponseEntity.notFound().build();
        documents.deleteById(documentId);
        return ResponseEntity.noContent().build();
    }

    private void aktar(BelgeIstek istek, Document b) {
        b.setName(istek.name());
        b.setUrl(istek.url());
        b.setSortOrder(istek.sortOrder());
        // Tür, dosya uzantısından belirlenir (listede rozet olarak gösterilir)
        String url = istek.url() == null ? "" : istek.url();
        int nokta = url.lastIndexOf('.');
        b.setFileType(nokta > 0 && nokta < url.length() - 1
                ? url.substring(nokta + 1).replaceAll("[?#].*$", "").toUpperCase(Locale.ROOT)
                : null);
    }
}
