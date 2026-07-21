package tr.edu.hacettepe.bidb.web;

import jakarta.transaction.Transactional;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.model.Setting;
import tr.edu.hacettepe.bidb.repo.SettingRepo;

import java.util.List;
import java.util.Map;

/**
 * Site ayarları: alt bilgide görünen adres, telefon, e-posta ve faks.
 * Bu bilgiler koda gömülü değil, veritabanında tutulur.
 */
@RestController
@RequestMapping("/api/yonetim/ayarlar")
public class AdminSettingController {

    private final SettingRepo ayarlar;

    public AdminSettingController(SettingRepo ayarlar) {
        this.ayarlar = ayarlar;
    }

    @GetMapping
    public List<Setting> liste() {
        return ayarlar.findAll();
    }

    /** Verilen anahtarları topluca kaydeder; olmayan anahtar oluşturulur. */
    @PutMapping
    @Transactional
    public List<Setting> kaydet(@RequestBody Map<String, String> degerler,
                             @RequestParam(defaultValue = "tr") String dil) {
        degerler.forEach((anahtar, deger) -> {
            Setting a = ayarlar.findByAnahtarAndDil(anahtar, dil).orElseGet(() -> {
                Setting yeni = new Setting();
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
