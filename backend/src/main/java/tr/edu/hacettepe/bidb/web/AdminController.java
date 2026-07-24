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
@RequestMapping("/api/admin")
public class AdminController {

    private final PageRepo pages;
    private final NewsRepo news;
    private final SliderRepo sliderlar;
    private final ShortcutRepo shortcuts;
    private final SocialAccountRepo sosyal;

    public AdminController(PageRepo pages, NewsRepo news, SliderRepo sliderlar,
                             ShortcutRepo shortcuts, SocialAccountRepo sosyal) {
        this.pages = pages;
        this.news = news;
        this.sliderlar = sliderlar;
        this.shortcuts = shortcuts;
        this.sosyal = sosyal;
    }

    /* ---------- pages ---------- */

    @GetMapping("/pages")
    public List<AdminPageDto> sayfaListesi() {
        return pages.findAll().stream().map(AdminPageDto::of).toList();
    }

    /** Sayfanın SEO alanları ve yayın durumu güncellenir; içerik metnine dokunulmaz. */
    @PutMapping("/pages/{id}/seo")
    @Transactional
    public ResponseEntity<AdminPageDto> seoGuncelle(@PathVariable Long id, @RequestBody SeoUpdateDto istek) {
        return pages.findById(id)
                .map(s -> {
                    s.setSeoTitle(istek.seoTitle());
                    s.setSeoDescription(istek.seoDescription());
                    s.setSeoKeywords(istek.seoKeywords());
                    s.setSeoImage(istek.seoImage());
                    s.setSeoRobots(istek.seoRobots() == null || istek.seoRobots().isBlank()
                            ? "index, follow" : istek.seoRobots());
                    s.setSeoSchemaType(istek.seoSchemaType() == null || istek.seoSchemaType().isBlank()
                            ? "WebPage" : istek.seoSchemaType());
                    s.setPublished(istek.published());
                    return ResponseEntity.ok(AdminPageDto.of(pages.save(s)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /* ---------- news ---------- */

    @GetMapping("/news")
    public List<NewsDto> duyuruListesi() {
        return news.findAll().stream().map(NewsDto::of).toList();
    }

    public record NewsOptions(
            List<NewsCatalog.Option> categories,
            List<NewsCatalog.Option> audiences,
            List<NewsCatalog.Option> templates
    ) {}

    @GetMapping("/news/options")
    public NewsOptions duyuruSecenekleri() {
        return new NewsOptions(NewsCatalog.CATEGORIES, NewsCatalog.AUDIENCES, NewsCatalog.TEMPLATES);
    }

    @PostMapping("/news")
    @Transactional
    public ResponseEntity<?> duyuruEkle(@RequestBody NewsDto istek) {
        String hata = istek.dogrulamaHatasi();
        if (hata != null) return ResponseEntity.badRequest().body(hata);
        return ResponseEntity.ok(NewsDto.of(news.save(istek.varligaAktar(new News()))));
    }

    @PutMapping("/news/{id}")
    @Transactional
    public ResponseEntity<?> duyuruGuncelle(@PathVariable Long id, @RequestBody NewsDto istek) {
        String hata = istek.dogrulamaHatasi();
        if (hata != null) return ResponseEntity.badRequest().body(hata);
        return news.findById(id)
                .map(d -> ResponseEntity.ok(NewsDto.of(news.save(istek.varligaAktar(d)))))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/news/{id}")
    @Transactional
    public ResponseEntity<Void> duyuruSil(@PathVariable Long id) {
        if (!news.existsById(id)) return ResponseEntity.notFound().build();
        news.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /* ---------- slider ---------- */

    @GetMapping("/slides")
    public List<Slider> sliderListesi() {
        return sliderlar.findAll();
    }

    /* ---------- kısayollar ---------- */

    @GetMapping("/shortcuts")
    public List<Shortcut> kisayolListesi() {
        return shortcuts.findAll();
    }

    /* ---------- sosyal medya ---------- */

    @GetMapping("/social-accounts")
    public List<SocialAccount> sosyalListesi() {
        return sosyal.findAll();
    }
}
