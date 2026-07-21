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
@RequestMapping("/api/yonetim")
public class AdminComponentController {

    private final SliderRepo sliderlar;
    private final ShortcutRepo kisayollar;
    private final SocialAccountRepo sosyal;

    public AdminComponentController(SliderRepo sliderlar, ShortcutRepo kisayollar, SocialAccountRepo sosyal) {
        this.sliderlar = sliderlar;
        this.kisayollar = kisayollar;
        this.sosyal = sosyal;
    }

    /* ---------- slider ---------- */

    public record SlaytIstek(String dil, String baslik, String altBaslik, String gorselUrl,
                             String gorselAlt, String baglanti, int sira, boolean yayinda) {

        Slider aktar(Slider s) {
            s.setDil(dil);
            s.setBaslik(baslik);
            s.setAltBaslik(altBaslik);
            s.setGorselUrl(gorselUrl);
            s.setGorselAlt(gorselAlt);
            s.setBaglanti(baglanti);
            s.setSira(sira);
            s.setYayinda(yayinda);
            return s;
        }
    }

    @PostMapping("/slider")
    @Transactional
    public Slider slaytEkle(@RequestBody SlaytIstek istek) {
        return sliderlar.save(istek.aktar(new Slider()));
    }

    @PutMapping("/slider/{id}")
    @Transactional
    public ResponseEntity<Slider> slaytGuncelle(@PathVariable Long id, @RequestBody SlaytIstek istek) {
        return sliderlar.findById(id)
                .map(s -> ResponseEntity.ok(sliderlar.save(istek.aktar(s))))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/slider/{id}")
    @Transactional
    public ResponseEntity<Void> slaytSil(@PathVariable Long id) {
        if (!sliderlar.existsById(id)) return ResponseEntity.notFound().build();
        sliderlar.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /* ---------- kısayollar ---------- */

    public record KisayolIstek(String dil, String ad, String ikonUrl, String adres,
                               boolean yeniSekme, int sira, boolean yayinda) {

        Shortcut aktar(Shortcut h) {
            h.setDil(dil);
            h.setAd(ad);
            h.setIkonUrl(ikonUrl);
            h.setAdres(adres);
            h.setYeniSekme(yeniSekme);
            h.setSira(sira);
            h.setYayinda(yayinda);
            return h;
        }
    }

    @PostMapping("/kisayollar")
    @Transactional
    public Shortcut kisayolEkle(@RequestBody KisayolIstek istek) {
        return kisayollar.save(istek.aktar(new Shortcut()));
    }

    @PutMapping("/kisayollar/{id}")
    @Transactional
    public ResponseEntity<Shortcut> kisayolGuncelle(@PathVariable Long id, @RequestBody KisayolIstek istek) {
        return kisayollar.findById(id)
                .map(h -> ResponseEntity.ok(kisayollar.save(istek.aktar(h))))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/kisayollar/{id}")
    @Transactional
    public ResponseEntity<Void> kisayolSil(@PathVariable Long id) {
        if (!kisayollar.existsById(id)) return ResponseEntity.notFound().build();
        kisayollar.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /* ---------- sosyal medya ---------- */

    public record SosyalIstek(String ag, String adres, int sira, boolean yayinda) {
        SocialAccount aktar(SocialAccount s) {
            s.setAg(ag);
            s.setAdres(adres);
            s.setSira(sira);
            s.setYayinda(yayinda);
            return s;
        }
    }

    @PostMapping("/sosyal")
    @Transactional
    public SocialAccount sosyalEkle(@RequestBody SosyalIstek istek) {
        return sosyal.save(istek.aktar(new SocialAccount()));
    }

    @PutMapping("/sosyal/{id}")
    @Transactional
    public ResponseEntity<SocialAccount> sosyalGuncelle(@PathVariable Long id, @RequestBody SosyalIstek istek) {
        return sosyal.findById(id)
                .map(s -> ResponseEntity.ok(sosyal.save(istek.aktar(s))))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/sosyal/{id}")
    @Transactional
    public ResponseEntity<Void> sosyalSil(@PathVariable Long id) {
        if (!sosyal.existsById(id)) return ResponseEntity.notFound().build();
        sosyal.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /* ---------- listeler (sıralı) ---------- */

    @GetMapping("/slider/liste")
    public List<Slider> slaytListesi() {
        return sliderlar.findAll();
    }

    @GetMapping("/kisayollar/liste")
    public List<Shortcut> kisayolListesiSirali() {
        return kisayollar.findAll();
    }
}
