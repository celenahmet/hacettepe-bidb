package tr.edu.hacettepe.bidb.web;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/admin/settings")
public class AdminSettingController {

    private final SettingRepo ayarlar;

    public AdminSettingController(SettingRepo ayarlar) {
        this.ayarlar = ayarlar;
    }

    @GetMapping
    public List<Setting> liste() {
        return ayarlar.findAll();
    }

    /** Verilen anahtarları topluca kaydeder; olmayan name oluşturulur. */
    @PutMapping
    @Transactional
    public ResponseEntity<?> kaydet(@RequestBody Map<String, String> degerler,
                             @RequestParam(defaultValue = "tr") String language) {
        for (Map.Entry<String, String> girdi : degerler.entrySet()) {
            if (girdi.getKey() == null || girdi.getKey().isBlank() || girdi.getKey().length() > 80) {
                return ResponseEntity.badRequest().body("Geçersiz ayar adı: " + girdi.getKey());
            }
        }
        degerler.forEach((name, value) -> {
            Setting a = ayarlar.findByNameAndLanguage(name, language).orElseGet(() -> {
                Setting yeni = new Setting();
                yeni.setName(name);
                yeni.setLanguage(language);
                return yeni;
            });
            a.setValue(value == null ? "" : value);
            ayarlar.save(a);
        });
        return ResponseEntity.ok(ayarlar.findAll());
    }
}
