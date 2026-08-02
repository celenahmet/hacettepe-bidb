package tr.edu.hacettepe.bidb.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tr.edu.hacettepe.bidb.model.MailLog;
import tr.edu.hacettepe.bidb.model.MailSetting;
import tr.edu.hacettepe.bidb.repo.MailLogRepo;
import tr.edu.hacettepe.bidb.repo.MailSettingRepo;

import java.util.Properties;

/**
 * E-posta gönderimi.
 *
 * Sunucu bilgileri veritabanından, PAROLA ortam değişkeninden okunur.
 * Parolanın veritabanında tutulmaması bilinçlidir: yedekler, göç dökümleri
 * ve panel yanıtları onu taşımamalı.
 *
 * Gönderim yapılandırılmamışsa ya da kapalıysa HATA FIRLATILMAZ; günlüğe
 * SKIPPED yazılıp sessizce dönülür. Sebebi: bu servisi çağıran akışların
 * (parola sıfırlama gibi) e-posta yokken de doğru davranması gerekiyor.
 * Sıfırlama isteği, e-posta gitmese bile kullanıcıya aynı yanıtı vermeli -
 * aksi hâlde yanıt farkı, adresin kayıtlı olup olmadığını ele verir.
 */
@Service
public class EpostaServisi {

    private static final Logger log = LoggerFactory.getLogger(EpostaServisi.class);

    /** Bağlantı ve okuma zaman aşımı: yanıt vermeyen sunucu isteği kilitlemesin. */
    private static final String ZAMAN_ASIMI_MS = "10000";

    private final MailSettingRepo ayarlar;
    private final MailLogRepo gunluk;
    private final String parola;

    public EpostaServisi(MailSettingRepo ayarlar, MailLogRepo gunluk,
                         @Value("${bidb.mail.parola:}") String parola) {
        this.ayarlar = ayarlar;
        this.gunluk = gunluk;
        this.parola = parola;
    }

    /** Panelde "parola tanımlı mı?" göstergesi için; değerin kendisi dönmez. */
    public boolean parolaTanimliMi() {
        return parola != null && !parola.isBlank();
    }

    public MailSetting ayar() {
        return ayarlar.findFirstByOrderByIdAsc().orElseGet(MailSetting::new);
    }

    /**
     * Gönderimin şu an mümkün olup olmadığı. Panelde durum satırı bunu
     * gösterir; yönetici neyin eksik olduğunu tahmin etmek zorunda kalmasın.
     */
    public String eksik(MailSetting a) {
        if (a == null || !a.isEnabled()) return "Gönderim kapalı.";
        if (a.getHost() == null || a.getHost().isBlank()) return "Sunucu adresi girilmemiş.";
        if (a.getPort() == null) return "Kapı numarası girilmemiş.";
        if (a.getFromAddress() == null || a.getFromAddress().isBlank()) return "Gönderen adresi girilmemiş.";
        if (a.getUsername() != null && !a.getUsername().isBlank() && !parolaTanimliMi()) {
            return "Kullanıcı adı girilmiş ama BIDB_MAIL_PAROLA tanımlı değil.";
        }
        return null;
    }

    /**
     * E-posta gönderir ve sonucu günlüğe yazar.
     *
     * @return gönderildiyse true. Çağıran taraf bu değere göre kullanıcıya
     *         FARKLI bir şey söylememelidir; yalnızca kendi iç akışı için.
     */
    @Transactional
    public boolean gonder(String alici, String konu, String govde, MailLog.Purpose amac) {
        MailSetting a = ayar();
        String engel = eksik(a);

        if (engel != null) {
            kaydet(alici, konu, amac, MailLog.Status.SKIPPED, engel);
            log.info("E-posta gönderilmedi ({}): {}", amac, engel);
            return false;
        }

        try {
            JavaMailSenderImpl gonderici = gondericiKur(a);
            SimpleMailMessage ileti = new SimpleMailMessage();
            ileti.setFrom(gonderenBasligi(a));
            ileti.setTo(alici);
            ileti.setSubject(konu);
            ileti.setText(govde);
            gonderici.send(ileti);

            kaydet(alici, konu, amac, MailLog.Status.SENT, null);
            return true;
        } catch (Exception e) {
            // Hata metni günlüğe girer; teşhis için gerekli. Gövde ASLA girmez.
            String hata = e.getMessage() == null ? e.getClass().getSimpleName() : e.getMessage();
            kaydet(alici, konu, amac, MailLog.Status.FAILED, kirp(hata, 500));
            log.warn("E-posta gönderilemedi ({}): {}", amac, hata);
            return false;
        }
    }

    private JavaMailSenderImpl gondericiKur(MailSetting a) {
        JavaMailSenderImpl g = new JavaMailSenderImpl();
        g.setHost(a.getHost());
        g.setPort(a.getPort());
        if (a.getUsername() != null && !a.getUsername().isBlank()) {
            g.setUsername(a.getUsername());
            g.setPassword(parola);
        }

        Properties p = g.getJavaMailProperties();
        p.put("mail.transport.protocol", "smtp");
        p.put("mail.smtp.auth", String.valueOf(a.getUsername() != null && !a.getUsername().isBlank()));
        p.put("mail.smtp.connectiontimeout", ZAMAN_ASIMI_MS);
        p.put("mail.smtp.timeout", ZAMAN_ASIMI_MS);
        p.put("mail.smtp.writetimeout", ZAMAN_ASIMI_MS);

        switch (a.getSecurityMode()) {
            case STARTTLS -> {
                p.put("mail.smtp.starttls.enable", "true");
                // required: sunucu STARTTLS'i desteklemiyorsa bağlantı DÜŞER.
                // Aksi hâlde sessizce şifresiz devam eder ve kimlik bilgileri
                // düz metin gider; bu kabul edilemez.
                p.put("mail.smtp.starttls.required", "true");
            }
            case SSL -> {
                p.put("mail.smtp.ssl.enable", "true");
                p.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
            }
            case NONE -> {
                // Şifresiz. Yalnızca kurum içi, güvenilir ağdaki bir aktarıcı
                // için makul; panelde bu seçim uyarıyla sunulur.
                p.put("mail.smtp.starttls.enable", "false");
            }
        }
        return g;
    }

    private String gonderenBasligi(MailSetting a) {
        String ad = a.getFromName();
        if (ad == null || ad.isBlank()) return a.getFromAddress();
        // Ad içindeki tırnak ve satır sonu başlık enjeksiyonuna açık kapı
        // bırakmasın diye temizlenir.
        String temiz = ad.replaceAll("[\"\\r\\n]", " ").trim();
        return "\"" + temiz + "\" <" + a.getFromAddress() + ">";
    }

    private void kaydet(String alici, String konu, MailLog.Purpose amac,
                        MailLog.Status durum, String hata) {
        MailLog k = new MailLog();
        k.setToAddress(kirp(alici, 254));
        k.setSubject(kirp(konu, 300));
        k.setPurpose(amac);
        k.setStatus(durum);
        k.setErrorMessage(hata);
        gunluk.save(k);
    }

    private static String kirp(String s, int uzunluk) {
        if (s == null) return null;
        return s.length() <= uzunluk ? s : s.substring(0, uzunluk);
    }
}
