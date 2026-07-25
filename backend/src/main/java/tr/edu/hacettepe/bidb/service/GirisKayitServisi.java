package tr.edu.hacettepe.bidb.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import tr.edu.hacettepe.bidb.model.AdminLoginEvent;
import tr.edu.hacettepe.bidb.repo.AdminLoginEventRepo;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Yönetim paneline yapılan her giriş denemesini kaydeder (kurumsal güvenlik
 * denetimi için — bkz. admin_login_event).
 *
 * Site genelindeki anonim analitik (bkz. AnalyticsController, WebVitalController)
 * kasıtlı olarak hiçbir IP saklamaz; burası bilinçli bir istisnadır — yalnızca
 * yönetim girişi denemeleri için, ziyaretçi trafiği için değil.
 *
 * Tahmini şehir/ülke bilgisi ücretsiz bir dış servisten (ipapi.co) alınır;
 * bu, IP adresinin üçüncü bir tarafa gönderildiği anlamına gelir. Yalnızca
 * bu denetim amaçlı, düşük hacimli uç için kabul edilebilir görüldü. Servis
 * yanıt vermezse veya IP zaten özel/yerel bir adresse konum alanı boş kalır
 * — asıl giriş akışını hiçbir şekilde etkilemez (@Async, ayrı iş parçacığı).
 */
@Service
public class GirisKayitServisi {
    private static final Logger log = LoggerFactory.getLogger(GirisKayitServisi.class);
    private static final Duration ZAMAN_ASIMI = Duration.ofSeconds(3);

    private final AdminLoginEventRepo depo;
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(ZAMAN_ASIMI).build();
    private final ObjectMapper json = new ObjectMapper();

    public GirisKayitServisi(AdminLoginEventRepo depo) {
        this.depo = depo;
    }

    @Async
    public void kaydet(String ipAdresiHam, String yerelAdresHam, String userAgent, String kullaniciAdi, boolean basarili) {
        try {
            String ipAdresi = ipv4Normallestir(ipAdresiHam);
            AdminLoginEvent olay = new AdminLoginEvent();
            olay.setIpAddress(ipAdresi);
            olay.setLocalIpAddress(ipv4Normallestir(yerelAdresHam));
            olay.setUserAgent(kisalt(userAgent, 500));
            olay.setAttemptedUsername(kisalt(kullaniciAdi, 120));
            olay.setSuccessful(basarili);

            TarayiciBilgisi tb = tarayiciCoz(userAgent);
            olay.setBrowser(tb.tarayici);
            olay.setOperatingSystem(tb.isletimSistemi);
            olay.setDeviceClass(tb.cihazSinifi);

            if (herkeseAcikMi(ipAdresi)) {
                konumCoz(ipAdresi, olay);
            } else {
                // Özel/yerel adresler için dış servise sorulmaz (bkz. herkeseAcikMi) —
                // ama alan boş bırakılırsa arayüzde "veri gelmedi" gibi görünüyordu.
                // Kurum içi/yerel bir bağlantı olduğu açıkça belirtilir.
                olay.setCity("Yerel ağ");
            }

            depo.save(olay);
        } catch (Exception e) {
            // Kayıt işlemi hiçbir koşulda giriş akışını etkilememeli;
            // burada bir hata olursa yalnızca günlüğe yazılır.
            log.warn("Giriş kaydı oluşturulamadı: {}", e.getMessage());
        }
    }

    private record TarayiciBilgisi(String tarayici, String isletimSistemi, String cihazSinifi) {}

    /** Basit, bağımlılıksız User-Agent ayrıştırma — kesin değil, denetim için yeterli. */
    private static TarayiciBilgisi tarayiciCoz(String ua) {
        String u = ua == null ? "" : ua;

        String tarayici;
        if (u.contains("Edg/")) tarayici = "Edge";
        else if (u.contains("OPR/") || u.contains("Opera")) tarayici = "Opera";
        else if (u.contains("Chrome/")) tarayici = "Chrome";
        else if (u.contains("Firefox/")) tarayici = "Firefox";
        else if (u.contains("Safari/") && u.contains("Version/")) tarayici = "Safari";
        else tarayici = "Diğer";

        // iOS UA'ları biçim gereği "like Mac OS X" içerir (örn. "CPU iPhone OS 17_0
        // like Mac OS X"); bu yüzden iPhone/iPad denetimi "Mac OS X" denetiminden
        // ÖNCE yapılmalı, aksi hâlde her iPhone masaüstü macOS sayılır.
        String isletimSistemi;
        if (u.contains("Windows")) isletimSistemi = "Windows";
        else if (u.contains("iPhone") || u.contains("iPad") || u.contains("iOS")) isletimSistemi = "iOS";
        else if (u.contains("Mac OS X")) isletimSistemi = "macOS";
        else if (u.contains("Android")) isletimSistemi = "Android";
        else if (u.contains("Linux")) isletimSistemi = "Linux";
        else isletimSistemi = "Diğer";

        String cihazSinifi;
        if (u.contains("iPad") || (u.contains("Android") && !u.contains("Mobile"))) cihazSinifi = "tablet";
        else if (u.contains("Mobile") || u.contains("iPhone")) cihazSinifi = "mobile";
        else cihazSinifi = "desktop";

        return new TarayiciBilgisi(tarayici, isletimSistemi, cihazSinifi);
    }

    /**
     * IPv4 adresini, IPv6 gösterimine sarılmış olsa bile düz noktalı-ondalık
     * biçime indirger (ör. "::ffff:192.168.1.10" → "192.168.1.10",
     * IPv6 döngü adresi "::1"/"0:0:0:0:0:0:0:1" → "127.0.0.1"). Sunucu
     * soketi IPv4 bağlantıları bazen bu sarmalanmış biçimde raporlar; kayıtta
     * her zaman IPv4 biçiminin tutulması istendi. Gerçek/yalnızca-IPv6 bir
     * adres gelirse (nadir, bu ortamda beklenmez) olduğu gibi bırakılır.
     */
    static String ipv4Normallestir(String ip) {
        if (ip == null) return null;
        String temiz = ip.trim();
        if (temiz.equals("::1") || temiz.equals("0:0:0:0:0:0:0:1")) return "127.0.0.1";

        int isaretIndex = temiz.toLowerCase(java.util.Locale.ROOT).indexOf("::ffff:");
        if (isaretIndex >= 0) {
            String olasi = temiz.substring(isaretIndex + 7);
            if (olasi.matches("^\\d{1,3}(\\.\\d{1,3}){3}$")) return olasi;
        }
        return temiz;
    }

    /** Özel/yerel ağ adreslerinde dış servise sorulmaz — hem gereksiz hem sonuçsuz. */
    private static boolean herkeseAcikMi(String ip) {
        if (ip == null || ip.isBlank()) return false;
        return !(ip.equals("127.0.0.1") || ip.equals("::1") || ip.startsWith("0:0:0:0:0:0:0:1")
                || ip.startsWith("10.") || ip.startsWith("192.168.")
                || ip.startsWith("172.16.") || ip.startsWith("172.17.") || ip.startsWith("172.18.")
                || ip.startsWith("172.19.") || ip.startsWith("172.2") || ip.startsWith("172.30.")
                || ip.startsWith("172.31."));
    }

    private void konumCoz(String ip, AdminLoginEvent olay) {
        try {
            HttpRequest istek = HttpRequest.newBuilder()
                    .uri(URI.create("https://ipapi.co/" + ip + "/json/"))
                    .timeout(ZAMAN_ASIMI)
                    .header("Accept", "application/json")
                    .GET()
                    .build();
            HttpResponse<String> yanit = http.send(istek, HttpResponse.BodyHandlers.ofString());
            if (yanit.statusCode() != 200) return;

            JsonNode kok = json.readTree(yanit.body());
            if (kok.has("error")) return;
            if (kok.hasNonNull("city")) olay.setCity(kisalt(kok.get("city").asText(), 120));
            if (kok.hasNonNull("country_name")) olay.setCountry(kisalt(kok.get("country_name").asText(), 120));
        } catch (Exception e) {
            log.debug("Konum çözümlenemedi ({}): {}", ip, e.getMessage());
        }
    }

    private static String kisalt(String deger, int azami) {
        if (deger == null) return null;
        return deger.length() > azami ? deger.substring(0, azami) : deger;
    }
}
