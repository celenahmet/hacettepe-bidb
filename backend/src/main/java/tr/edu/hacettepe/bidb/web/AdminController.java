package tr.edu.hacettepe.bidb.web;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.dto.admin.*;
import tr.edu.hacettepe.bidb.model.*;
import tr.edu.hacettepe.bidb.repo.*;

import java.util.List;

/**
 * Yönetim uçları. Kimlik doğrulaması gerektirir (bkz. SecurityConfig).
 * Sayfa metinleri kurumdan geldiği gibi korunur; buradan yalnızca
 * SEO alanları, yayın durumu ve ana sayfa bileşenleri düzenlenir.
 */
@RestController
@RequestMapping("/api/yonetim")
public class AdminController {

    private final PageRepo sayfalar;
    private final NewsRepo duyurular;
    private final SliderRepo sliderlar;
    private final ShortcutRepo kisayollar;
    private final SocialAccountRepo sosyal;

    public AdminController(PageRepo sayfalar, NewsRepo duyurular, SliderRepo sliderlar,
                             ShortcutRepo kisayollar, SocialAccountRepo sosyal) {
        this.sayfalar = sayfalar;
        this.duyurular = duyurular;
        this.sliderlar = sliderlar;
        this.kisayollar = kisayollar;
        this.sosyal = sosyal;
    }

    /* ---------- sayfalar ---------- */

    @GetMapping("/sayfalar")
    public List<AdminPageDto> sayfaListesi() {
        return sayfalar.findAll().stream().map(AdminPageDto::of).toList();
    }

    /** Sayfanın SEO alanları ve yayın durumu güncellenir; içerik metnine dokunulmaz. */
    @PutMapping("/sayfalar/{id}/seo")
    @Transactional
    public ResponseEntity<AdminPageDto> seoGuncelle(@PathVariable Long id, @RequestBody SeoUpdateDto istek) {
        return sayfalar.findById(id)
                .map(s -> {
                    s.setSeoTitle(istek.seoTitle());
                    s.setSeoDescription(istek.seoDescription());
                    s.setSeoKeywords(istek.seoKeywords());
                    s.setYayinda(istek.yayinda());
                    return ResponseEntity.ok(AdminPageDto.of(sayfalar.save(s)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /* ---------- duyurular ---------- */

    @GetMapping("/duyurular")
    public List<News> duyuruListesi() {
        return duyurular.findAll();
    }

    @PostMapping("/duyurular")
    @Transactional
    public NewsDto duyuruEkle(@RequestBody NewsDto istek) {
        return NewsDto.of(duyurular.save(istek.varligaAktar(new News())));
    }

    @PutMapping("/duyurular/{id}")
    @Transactional
    public ResponseEntity<NewsDto> duyuruGuncelle(@PathVariable Long id, @RequestBody NewsDto istek) {
        return duyurular.findById(id)
                .map(d -> ResponseEntity.ok(NewsDto.of(duyurular.save(istek.varligaAktar(d)))))
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
    public List<Shortcut> kisayolListesi() {
        return kisayollar.findAll();
    }

    /* ---------- sosyal medya ---------- */

    @GetMapping("/sosyal")
    public List<SocialAccount> sosyalListesi() {
        return sosyal.findAll();
    }
}
