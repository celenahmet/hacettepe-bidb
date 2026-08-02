package tr.edu.hacettepe.bidb.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tr.edu.hacettepe.bidb.model.AdminAccount;
import tr.edu.hacettepe.bidb.model.AdminPasswordReset;
import tr.edu.hacettepe.bidb.model.MailLog;
import tr.edu.hacettepe.bidb.repo.AdminPasswordResetRepo;
import tr.edu.hacettepe.bidb.security.YoneticiHesabiServisi;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

/**
 * Parola sıfırlama akışı.
 *
 * Tasarım kararları ve gerekçeleri:
 *
 *  - JETON SAKLANMAZ, karması saklanır. Veritabanını okuyabilen biri
 *    (yedek, sızıntı) saklanan değerle sıfırlama yapamamalı.
 *
 *  - TEK KULLANIMLIK ve SÜRELİ. Bir jeton kullanıldığında hesabın bekleyen
 *    diğer jetonları da geçersizleşir; arka arkaya istenmiş bağlantıların
 *    hepsi açık kalmasın.
 *
 *  - ADRES SAYMAĞI (enumeration) ENGELLENİR. İstek ucu, adres kayıtlı olsa
 *    da olmasa da AYNI yanıtı verir. Yanıt farkı, bir adresin sistemde
 *    kayıtlı olup olmadığını ele verirdi.
 *
 *  - PAROLA DEĞİŞİNCE bekleyen bütün jetonlar geçersizleşir.
 */
@Service
public class ParolaSifirlamaServisi {

    private static final Logger log = LoggerFactory.getLogger(ParolaSifirlamaServisi.class);

    /** Jeton ömrü. Kısa tutulur: e-posta kutusuna sonradan erişen biri eski
        bir bağlantıyı kullanamasın. */
    private static final int GECERLILIK_DAKIKA = 30;

    /** 256 bit rastgelelik. Tahmin edilebilirlik payı bırakmaz. */
    private static final int JETON_BAYT = 32;

    /** Aynı hesap için saatte en fazla bu kadar jeton üretilir. */
    private static final int SAATTE_AZAMI_JETON = 5;

    /** Asgari parola uzunluğu. */
    public static final int ASGARI_PAROLA = 12;

    private static final SecureRandom RASTGELE = new SecureRandom();

    private final AdminPasswordResetRepo depo;
    private final YoneticiHesabiServisi hesaplar;
    private final EpostaServisi eposta;
    private final String siteAdresi;

    public ParolaSifirlamaServisi(AdminPasswordResetRepo depo, YoneticiHesabiServisi hesaplar,
                                  EpostaServisi eposta,
                                  @Value("${bidb.site.adresi:http://localhost:4000}") String siteAdresi) {
        this.depo = depo;
        this.hesaplar = hesaplar;
        this.eposta = eposta;
        this.siteAdresi = siteAdresi;
    }

    /**
     * Sıfırlama ister. Çağıran taraf sonucu kullanıcıya YANSITMAMALIDIR;
     * dönüş değeri yalnızca günlükleme içindir.
     *
     * @return jeton üretilip e-posta denendiyse true
     */
    @Transactional
    public boolean iste(String verilenAdres, String istekAdresi) {
        AdminAccount h = hesaplar.hesap();
        if (h == null || h.getEmail() == null || h.getEmail().isBlank()) {
            log.info("Parola sıfırlama istendi ama hesabın e-posta adresi tanımlı değil.");
            return false;
        }
        // Karşılaştırma büyük/küçük harf duyarsız; e-posta adresleri öyle.
        if (verilenAdres == null || !h.getEmail().equalsIgnoreCase(verilenAdres.trim())) {
            log.info("Parola sıfırlama isteğinde adres eşleşmedi.");
            return false;
        }

        OffsetDateTime birSaatOnce = OffsetDateTime.now().minusHours(1);
        if (depo.sayacSonra(h.getId(), birSaatOnce) >= SAATTE_AZAMI_JETON) {
            /* Hesap başına sınır. IP başına sınır ayrıca controller'da var;
               ikisi birlikte gerekli: IP değiştiren bir saldırgan hesap
               sınırına, tek IP'den gelen sel ise IP sınırına takılır. */
            log.warn("Parola sıfırlama hesap başına saatlik sınıra takıldı.");
            return false;
        }

        String jeton = jetonUret();
        AdminPasswordReset kayit = new AdminPasswordReset();
        kayit.setAccount(h);
        kayit.setTokenHash(karma(jeton));
        kayit.setExpiresAt(OffsetDateTime.now().plusMinutes(GECERLILIK_DAKIKA));
        kayit.setRequestedIp(istekAdresi);
        depo.save(kayit);

        eposta.gonder(h.getEmail(), "Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı — parola yenileme",
                iletiMetni(jeton), MailLog.Purpose.PAROLA_SIFIRLAMA);
        return true;
    }

    /** Jetonun şu an kullanılabilir olup olmadığı; form açılmadan denetlenir. */
    @Transactional(readOnly = true)
    public boolean gecerliMi(String jeton) {
        return bul(jeton).isPresent();
    }

    /**
     * Jetonu kullanır ve parolayı değiştirir.
     *
     * @return değiştirildiyse true; jeton geçersiz/süresi dolmuş/kullanılmışsa false
     */
    @Transactional
    public boolean tamamla(String jeton, String yeniParola, String kullanimAdresi) {
        Optional<AdminPasswordReset> belki = bul(jeton);
        if (belki.isEmpty()) return false;

        AdminPasswordReset kayit = belki.get();
        AdminAccount h = kayit.getAccount();

        hesaplar.parolaBelirle(h, yeniParola);

        kayit.setUsedIp(kullanimAdresi);
        OffsetDateTime an = OffsetDateTime.now();
        kayit.setUsedAt(an);
        depo.save(kayit);
        // Bekleyen diğer jetonlar da kapatılır.
        depo.hepsiniGecersizKil(h.getId(), an);

        log.warn("Yönetici parolası sıfırlama bağlantısıyla değiştirildi. İstek adresi: {}, kullanım adresi: {}",
                kayit.getRequestedIp(), kullanimAdresi);
        return true;
    }

    /** Parola kuralları. Dönüş null ise parola kabul edilebilir. */
    public String parolaSorunu(String parola, String kullaniciAdi) {
        if (parola == null || parola.length() < ASGARI_PAROLA) {
            return "Parola en az " + ASGARI_PAROLA + " karakter olmalıdır.";
        }
        if (parola.length() > 200) {
            return "Parola en fazla 200 karakter olabilir.";
        }
        if (kullaniciAdi != null && parola.equalsIgnoreCase(kullaniciAdi)) {
            return "Parola kullanıcı adıyla aynı olamaz.";
        }
        if (parola.chars().distinct().count() < 4) {
            return "Parola en az dört farklı karakter içermelidir.";
        }
        return null;
    }

    private Optional<AdminPasswordReset> bul(String jeton) {
        if (jeton == null || jeton.isBlank()) return Optional.empty();
        return depo.findByTokenHash(karma(jeton))
                .filter(k -> k.getUsedAt() == null)
                .filter(k -> k.getExpiresAt().isAfter(OffsetDateTime.now()));
    }

    private static String jetonUret() {
        byte[] b = new byte[JETON_BAYT];
        RASTGELE.nextBytes(b);
        // Adres satırında sorun çıkarmayan gövde: URL güvenli, dolgusuz.
        return Base64.getUrlEncoder().withoutPadding().encodeToString(b);
    }

    private static String karma(String jeton) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(md.digest(jeton.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            // SHA-256 her Java çalışma ortamında zorunludur; buraya düşülmez.
            throw new IllegalStateException("SHA-256 yok", e);
        }
    }

    private String iletiMetni(String jeton) {
        String baglanti = siteAdresi + "/yonetim/parola-yenileme?jeton=" + jeton;
        return """
               Sayın Yetkili,

               Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı yönetim paneli
               için parola yenileme talebinde bulunulmuştur.

               Yenileme işlemini tamamlamak üzere aşağıdaki bağlantıyı
               kullanabilirsiniz:

               %s

               Bağlantı %d dakika süreyle ve yalnızca bir kez geçerlidir.

               Bu talebi siz oluşturmadıysanız herhangi bir işlem yapmanıza gerek
               yoktur; parolanız değişmeyecektir. Durumu Bilgi İşlem Daire
               Başkanlığına bildirmenizi rica ederiz.

               Saygılarımızla,
               Hacettepe Üniversitesi
               Bilgi İşlem Daire Başkanlığı
               """.formatted(baglanti, GECERLILIK_DAKIKA);
    }
}
