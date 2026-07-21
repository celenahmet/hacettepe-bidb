package tr.edu.hacettepe.bidb.web;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.dto.yonetim.*;
import tr.edu.hacettepe.bidb.model.*;
import tr.edu.hacettepe.bidb.repo.*;

import java.util.List;

/**
 * Yönetim uçları. Kimlik doğrulaması gerektirir (bkz. GuvenlikAyari).
 * Sayfa metinleri kurumdan geldiği gibi korunur; buradan yalnızca
 * SEO alanları, yayın durumu ve ana sayfa bileşenleri düzenlenir.
 */
@RestController
@RequestMapping("/api/yonetim")
public class YonetimController {

    private final SayfaRepo sayfalar;
    private final DuyuruRepo duyurular;
    private final SliderRepo sliderlar;
    private final HizliErisimRepo kisayollar;
    private final SosyalHesapRepo sosyal;

    public YonetimController(SayfaRepo sayfalar, DuyuruRepo duyurular, SliderRepo sliderlar,
                             HizliErisimRepo kisayollar, SosyalHesapRepo sosyal) {
        this.sayfalar = sayfalar;
        this.duyurular = duyurular;
        this.sliderlar = sliderlar;
        this.kisayollar = kisayollar;
        this.sosyal = sosyal;
    }

    /* ---------- sayfalar ---------- */

    @GetMapping("/sayfalar")
    public List<SayfaYonetimDto> sayfaListesi() {
        return sayfalar.findAll().stream().map(SayfaYonetimDto::of).toList();
    }

    /** Sayfanın SEO alanları ve yayın durumu güncellenir; içerik metnine dokunulmaz. */
    @PutMapping("/sayfalar/{id}/seo")
    @Transactional
    public ResponseEntity<SayfaYonetimDto> seoGuncelle(@PathVariable Long id, @RequestBody SeoGuncelleDto istek) {
        return sayfalar.findById(id)
                .map(s -> {
                    s.setSeoTitle(istek.seoTitle());
                    s.setSeoDescription(istek.seoDescription());
                    s.setSeoKeywords(istek.seoKeywords());
                    s.setYayinda(istek.yayinda());
                    return ResponseEntity.ok(SayfaYonetimDto.of(sayfalar.save(s)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /* ---------- duyurular ---------- */

    @GetMapping("/duyurular")
    public List<Duyuru> duyuruListesi() {
        return duyurular.findAll();
    }

    @PostMapping("/duyurular")
    @Transactional
    public DuyuruDto duyuruEkle(@RequestBody DuyuruDto istek) {
        return DuyuruDto.of(duyurular.save(istek.varligaAktar(new Duyuru())));
    }

    @PutMapping("/duyurular/{id}")
    @Transactional
    public ResponseEntity<DuyuruDto> duyuruGuncelle(@PathVariable Long id, @RequestBody DuyuruDto istek) {
        return duyurular.findById(id)
                .map(d -> ResponseEntity.ok(DuyuruDto.of(duyurular.save(istek.varligaAktar(d)))))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/duyurular/{id}")
    @Transactional
    public ResponseEntity<Void> duyuruSil(@PathVariable Long id) {
        if (!duyurular.existsById(id)) return ResponseEntity.notFound().build();
        duyurular.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /* ---------- slider ---------- */

    @GetMapping("/slider")
    public List<Slider> sliderListesi() {
        return sliderlar.findAll();
    }

    /* ---------- kısayollar ---------- */

    @GetMapping("/kisayollar")
    public List<HizliErisim> kisayolListesi() {
        return kisayollar.findAll();
    }

    /* ---------- sosyal medya ---------- */

    @GetMapping("/sosyal")
    public List<SosyalHesap> sosyalListesi() {
        return sosyal.findAll();
    }
}
