package tr.edu.hacettepe.bidb.web;

import jakarta.transaction.Transactional;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.model.Ayar;
import tr.edu.hacettepe.bidb.repo.AyarRepo;

import java.util.List;
import java.util.Map;

/**
 * Site ayarları: alt bilgide görünen adres, telefon, e-posta ve faks.
 * Bu bilgiler koda gömülü değil, veritabanında tutulur.
 */
@RestController
@RequestMapping("/api/yonetim/ayarlar")
public class YonetimAyarController {

    private final AyarRepo ayarlar;

    public YonetimAyarController(AyarRepo ayarlar) {
        this.ayarlar = ayarlar;
    }

    @GetMapping
    public List<Ayar> liste() {
        return ayarlar.findAll();
    }

    /** Verilen anahtarları topluca kaydeder; olmayan anahtar oluşturulur. */
    @PutMapping
    @Transactional
    public List<Ayar> kaydet(@RequestBody Map<String, String> degerler,
                             @RequestParam(defaultValue = "tr") String dil) {
        degerler.forEach((anahtar, deger) -> {
            Ayar a = ayarlar.findByAnahtarAndDil(anahtar, dil).orElseGet(() -> {
                Ayar yeni = new Ayar();
                yeni.setAnahtar(anahtar);
                yeni.setDil(dil);
                return yeni;
            });
            a.setDeger(deger);
            ayarlar.save(a);
        });
        return ayarlar.findAll();
    }
}
