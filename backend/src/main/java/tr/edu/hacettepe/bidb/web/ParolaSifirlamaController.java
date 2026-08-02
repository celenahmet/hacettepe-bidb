package tr.edu.hacettepe.bidb.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.security.HizSinirlayici;
import tr.edu.hacettepe.bidb.security.YoneticiHesabiServisi;
import tr.edu.hacettepe.bidb.service.ParolaSifirlamaServisi;

import java.util.Map;

/**
 * Yönetim paneli parola yenileme akışı. Kimlik doğrulaması İSTEMEZ.
 *
 * Yol bilinçli olarak /api/admin/** altında: mevcut denetim günlüğü filtresi
 * ve giriş sınırlayıcısı bu ön eki izliyor, böylece akış kendiliğinden
 * güvenlik kaydına giriyor ve kaba kuvvete karşı korunuyor. İki uç
 * SecurityConfig'te tek tek permitAll olarak yazılmıştır; blanket bir
 * gevşetme yapılmamıştır.
 *
 * ADRES SAYMAĞI ENGELLENİR: istek ucu, adres kayıtlı olsa da olmasa da aynı
 * yanıtı ve aynı durum kodunu döndürür.
 */
@RestController
@RequestMapping("/api/admin/password-reset")
public class ParolaSifirlamaController {

    /** IP başına: 15 dakikada en fazla 5 istek. */
    private static final int IP_AZAMI = 5;
    private static final long IP_PENCERE_SANIYE = 900;

    /* Tek ve değişmez yanıt. Adresin kayıtlı olup olmadığını ele vermez. */
    private static final String NOTR_YANIT =
            "Talebiniz alınmıştır. Girilen adres sistemde kayıtlıysa parola yenileme "
          + "yönergesi bu adrese gönderilecektir. İleti birkaç dakika içinde ulaşmazsa "
          + "istenmeyen posta klasörünüzü denetleyiniz.";

    private final ParolaSifirlamaServisi servis;
    private final YoneticiHesabiServisi hesaplar;
    private final HizSinirlayici hizSinirlayici;

    public ParolaSifirlamaController(ParolaSifirlamaServisi servis, YoneticiHesabiServisi hesaplar,
                                     HizSinirlayici hizSinirlayici) {
        this.servis = servis;
        this.hesaplar = hesaplar;
        this.hizSinirlayici = hizSinirlayici;
    }

    public record IstekGovdesi(@NotBlank @Size(max = 254) String email) {}

    public record TamamlaGovdesi(
            @NotBlank @Size(max = 500) String token,
            @NotBlank @Size(max = 200) String password) {}

    @PostMapping("/request")
    public ResponseEntity<?> iste(@Valid @RequestBody IstekGovdesi govde, HttpServletRequest istek) {
        String adres = hizSinirlayici.istekAdresi(istek);

        /* Sınır aşıldığında da AYNI nötr yanıt döner, 429 değil. Farklı bir
           kod döndürmek, "bu adres için çok deneme yapıldı" bilgisini
           sızdırırdı. Sınır yine de uygulanır: jeton üretilmez. */
        if (hizSinirlayici.asildiMi("parola-sifirlama:" + adres, IP_AZAMI, IP_PENCERE_SANIYE)) {
            return ResponseEntity.ok(Map.of("message", NOTR_YANIT));
        }

        servis.iste(govde.email(), adres);
        return ResponseEntity.ok(Map.of("message", NOTR_YANIT));
    }

    /**
     * Jetonun geçerliliğini bildirir; form açılmadan önce çağrılır.
     * Kullanıcıya süresi dolmuş bir bağlantıda boş yere parola yazdırmamak
     * için var.
     */
    @GetMapping("/validate")
    public Map<String, Boolean> dogrula(@RequestParam String token) {
        return Map.of("valid", servis.gecerliMi(token));
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> tamamla(@Valid @RequestBody TamamlaGovdesi govde, HttpServletRequest istek) {
        String adres = hizSinirlayici.istekAdresi(istek);
        if (hizSinirlayici.asildiMi("parola-yenileme:" + adres, IP_AZAMI, IP_PENCERE_SANIYE)) {
            return ResponseEntity.status(429).body(Map.of(
                    "message", "Çok fazla deneme yapıldı. Lütfen bir süre sonra yeniden deneyiniz."));
        }

        var hesap = hesaplar.hesap();
        String sorun = servis.parolaSorunu(govde.password(), hesap == null ? null : hesap.getUsername());
        if (sorun != null) {
            return ResponseEntity.badRequest().body(Map.of("message", sorun));
        }

        boolean oldu = servis.tamamla(govde.token(), govde.password(), adres);
        if (!oldu) {
            return ResponseEntity.badRequest().body(Map.of("message",
                    "Bağlantı geçersiz ya da süresi dolmuş. Lütfen yeniden parola yenileme talebinde bulununuz."));
        }
        return ResponseEntity.ok(Map.of("message",
                "Parolanız güncellenmiştir. Yeni parolanızla giriş yapabilirsiniz."));
    }
}
