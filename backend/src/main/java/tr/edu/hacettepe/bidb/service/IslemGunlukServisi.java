package tr.edu.hacettepe.bidb.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import tr.edu.hacettepe.bidb.model.AdminAuditEvent;
import tr.edu.hacettepe.bidb.repo.AdminAuditEventRepo;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Yönetim panelinde yapılan değişiklik işlemlerinin (oluşturma/güncelleme/silme)
 * denetim kaydı — bkz. YoneticiIslemGunlukFiltresi.
 */
@Service
public class IslemGunlukServisi {
    private static final Logger log = LoggerFactory.getLogger(IslemGunlukServisi.class);
    private static final Pattern SAYISAL_ID = Pattern.compile("/(\\d+)(?:/|$)");

    private static final Map<String, String> KAYNAK_ADLARI = Map.ofEntries(
            Map.entry("pages", "Sayfa"),
            Map.entry("news", "Duyuru"),
            Map.entry("slides", "Slider"),
            Map.entry("shortcuts", "Kısayol"),
            Map.entry("social-accounts", "Sosyal medya hesabı"),
            Map.entry("staff", "Personel"),
            Map.entry("menus", "Menü"),
            Map.entry("contact-channels", "İletişim kanalı"),
            Map.entry("contact-tickets", "Talep"),
            Map.entry("settings", "Ayar"),
            Map.entry("files", "Dosya"));

    private final AdminAuditEventRepo depo;

    public IslemGunlukServisi(AdminAuditEventRepo depo) {
        this.depo = depo;
    }

    @Async
    public void kaydet(String sessionId, String ipAdresi, String yerelAdres, String kullaniciAdi,
                        String httpMethod, String yol, int httpStatus) {
        try {
            AdminAuditEvent olay = new AdminAuditEvent();
            olay.setSessionId(kisalt(sessionId, 64));
            olay.setIpAddress(kisalt(GirisKayitServisi.ipv4Normallestir(ipAdresi), 64));
            olay.setLocalIpAddress(kisalt(GirisKayitServisi.ipv4Normallestir(yerelAdres), 64));
            olay.setAttemptedUsername(kisalt(kullaniciAdi, 120));
            olay.setHttpMethod(httpMethod);
            olay.setResourcePath(kisalt(yol, 200));
            boolean basarili = httpStatus < 400;
            olay.setActionLabel(eylemEtiketi(httpMethod, yol, basarili));
            olay.setHttpStatus(httpStatus);
            olay.setSuccessful(basarili);
            depo.save(olay);
        } catch (Exception e) {
            log.warn("İşlem günlüğü kaydı oluşturulamadı: {}", e.getMessage());
        }
    }

    /**
     * "/api/admin/news/16" + PUT → "Duyuru güncellendi (#16)" gibi okunabilir bir etiket üretir.
     * Başarısız istekler olumsuz çekimle yazılır ("güncellenemedi"): etiket denetim tablosunda
     * tek başına okunan sütun, olmamış bir işlemi olmuş gibi anlatmamalı.
     */
    private static String eylemEtiketi(String httpMethod, String yol, boolean basarili) {
        String[] parcalar = yol.replaceFirst("^/api/admin/", "").split("/");
        String kaynak = parcalar.length > 0 ? KAYNAK_ADLARI.getOrDefault(parcalar[0], parcalar[0]) : "Kayıt";

        String eylem = switch (httpMethod) {
            case "POST" -> basarili ? "oluşturuldu" : "oluşturulamadı";
            case "PUT", "PATCH" -> basarili ? "güncellendi" : "güncellenemedi";
            case "DELETE" -> basarili ? "silindi" : "silinemedi";
            default -> basarili ? "değiştirildi" : "değiştirilemedi";
        };

        Matcher eslesme = SAYISAL_ID.matcher(yol);
        String kimlik = eslesme.find() ? " (#" + eslesme.group(1) + ")" : "";
        return kaynak + " " + eylem + kimlik;
    }

    private static String kisalt(String deger, int azami) {
        if (deger == null) return null;
        return deger.length() > azami ? deger.substring(0, azami) : deger;
    }
}
