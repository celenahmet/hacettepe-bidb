package tr.edu.hacettepe.bidb.web;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.model.Shortcut;
import tr.edu.hacettepe.bidb.model.Slider;
import tr.edu.hacettepe.bidb.model.SocialAccount;
import tr.edu.hacettepe.bidb.repo.ShortcutRepo;
import tr.edu.hacettepe.bidb.repo.SliderRepo;
import tr.edu.hacettepe.bidb.repo.SocialAccountRepo;

import java.util.List;

/**
 * Ana sayfa bileşenlerinin yönetimi: slider, kısayollar ve sosyal medya.
 * Kimlik doğrulaması gerektirir (bkz. SecurityConfig).
 */
@RestController
@RequestMapping("/api/admin")
public class AdminComponentController {

    private final SliderRepo sliderlar;
    private final ShortcutRepo shortcuts;
    private final SocialAccountRepo sosyal;

    public AdminComponentController(SliderRepo sliderlar, ShortcutRepo shortcuts, SocialAccountRepo sosyal) {
        this.sliderlar = sliderlar;
        this.shortcuts = shortcuts;
        this.sosyal = sosyal;
    }

    /* ---------- slider ---------- */

    public record SlaytIstek(String language, String title, String subtitle, String imageUrl,
                             String imageAlt, String linkUrl, int sortOrder, boolean published) {

        Slider aktar(Slider s) {
            s.setLanguage(language);
            s.setTitle(title);
            s.setSubtitle(subtitle);
            s.setImageUrl(imageUrl);
            s.setImageAlt(imageAlt);
            s.setLinkUrl(linkUrl);
            s.setSortOrder(sortOrder);
            s.setPublished(published);
            return s;
        }
    }

    @PostMapping("/slides")
    @Transactional
    public Slider slaytEkle(@RequestBody SlaytIstek istek) {
        return sliderlar.save(istek.aktar(new Slider()));
    }

    @PutMapping("/slides/{id}")
    @Transactional
    public ResponseEntity<Slider> slaytGuncelle(@PathVariable Long id, @RequestBody SlaytIstek istek) {
        return sliderlar.findById(id)
                .map(s -> ResponseEntity.ok(sliderlar.save(istek.aktar(s))))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/slides/{id}")
    @Transactional
    public ResponseEntity<Void> slaytSil(@PathVariable Long id) {
        if (!sliderlar.existsById(id)) return ResponseEntity.notFound().build();
        sliderlar.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /* ---------- kısayollar ---------- */

    public record KisayolIstek(String language, String name, String iconUrl, String url,
                               boolean newTab, int sortOrder, boolean published) {

        Shortcut aktar(Shortcut h) {
            h.setLanguage(language);
            h.setName(name);
            h.setIconUrl(iconUrl);
            h.setUrl(url);
            h.setNewTab(newTab);
            h.setSortOrder(sortOrder);
            h.setPublished(published);
            return h;
        }
    }

    @PostMapping("/shortcuts")
    @Transactional
    public Shortcut kisayolEkle(@RequestBody KisayolIstek istek) {
        return shortcuts.save(istek.aktar(new Shortcut()));
    }

    @PutMapping("/shortcuts/{id}")
    @Transactional
    public ResponseEntity<Shortcut> kisayolGuncelle(@PathVariable Long id, @RequestBody KisayolIstek istek) {
        return shortcuts.findById(id)
                .map(h -> ResponseEntity.ok(shortcuts.save(istek.aktar(h))))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/shortcuts/{id}")
    @Transactional
    public ResponseEntity<Void> kisayolSil(@PathVariable Long id) {
        if (!shortcuts.existsById(id)) return ResponseEntity.notFound().build();
        shortcuts.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /* ---------- sosyal medya ---------- */

    public record SosyalIstek(String network, String url, int sortOrder, boolean published) {
        SocialAccount aktar(SocialAccount s) {
            s.setNetwork(network);
            s.setUrl(url);
            s.setSortOrder(sortOrder);
            s.setPublished(published);
            return s;
        }
    }

    @PostMapping("/social-accounts")
    @Transactional
    public SocialAccount sosyalEkle(@RequestBody SosyalIstek istek) {
        return sosyal.save(istek.aktar(new SocialAccount()));
    }

    @PutMapping("/social-accounts/{id}")
    @Transactional
    public ResponseEntity<SocialAccount> sosyalGuncelle(@PathVariable Long id, @RequestBody SosyalIstek istek) {
        return sosyal.findById(id)
                .map(s -> ResponseEntity.ok(sosyal.save(istek.aktar(s))))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/social-accounts/{id}")
    @Transactional
    public ResponseEntity<Void> sosyalSil(@PathVariable Long id) {
        if (!sosyal.existsById(id)) return ResponseEntity.notFound().build();
        sosyal.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /* ---------- listeler (sıralı) ---------- */

    @GetMapping("/slides/list")
    public List<Slider> slaytListesi() {
        return sliderlar.findAll();
    }

    @GetMapping("/shortcuts/list")
    public List<Shortcut> kisayolListesiSirali() {
        return shortcuts.findAll();
    }
}
