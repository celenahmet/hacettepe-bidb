package tr.edu.hacettepe.bidb.web;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.model.HizliErisim;
import tr.edu.hacettepe.bidb.model.Slider;
import tr.edu.hacettepe.bidb.model.SosyalHesap;
import tr.edu.hacettepe.bidb.repo.HizliErisimRepo;
import tr.edu.hacettepe.bidb.repo.SliderRepo;
import tr.edu.hacettepe.bidb.repo.SosyalHesapRepo;

import java.util.List;

/**
 * Ana sayfa bileşenlerinin yönetimi: slider, kısayollar ve sosyal medya.
 * Kimlik doğrulaması gerektirir (bkz. GuvenlikAyari).
 */
@RestController
@RequestMapping("/api/yonetim")
public class YonetimBilesenController {

    private final SliderRepo sliderlar;
    private final HizliErisimRepo kisayollar;
    private final SosyalHesapRepo sosyal;

    public YonetimBilesenController(SliderRepo sliderlar, HizliErisimRepo kisayollar, SosyalHesapRepo sosyal) {
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

        HizliErisim aktar(HizliErisim h) {
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
    public HizliErisim kisayolEkle(@RequestBody KisayolIstek istek) {
        return kisayollar.save(istek.aktar(new HizliErisim()));
    }

    @PutMapping("/kisayollar/{id}")
    @Transactional
    public ResponseEntity<HizliErisim> kisayolGuncelle(@PathVariable Long id, @RequestBody KisayolIstek istek) {
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
        SosyalHesap aktar(SosyalHesap s) {
            s.setAg(ag);
            s.setAdres(adres);
            s.setSira(sira);
            s.setYayinda(yayinda);
            return s;
        }
    }

    @PostMapping("/sosyal")
    @Transactional
    public SosyalHesap sosyalEkle(@RequestBody SosyalIstek istek) {
        return sosyal.save(istek.aktar(new SosyalHesap()));
    }

    @PutMapping("/sosyal/{id}")
    @Transactional
    public ResponseEntity<SosyalHesap> sosyalGuncelle(@PathVariable Long id, @RequestBody SosyalIstek istek) {
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
    public List<HizliErisim> kisayolListesiSirali() {
        return kisayollar.findAll();
    }
}
