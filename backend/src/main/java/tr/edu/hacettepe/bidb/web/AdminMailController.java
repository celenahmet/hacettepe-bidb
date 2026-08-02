package tr.edu.hacettepe.bidb.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Limit;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.model.MailLog;
import tr.edu.hacettepe.bidb.model.MailSetting;
import tr.edu.hacettepe.bidb.repo.MailLogRepo;
import tr.edu.hacettepe.bidb.repo.MailSettingRepo;
import tr.edu.hacettepe.bidb.security.YoneticiHesabiServisi;
import tr.edu.hacettepe.bidb.service.EpostaServisi;

import java.security.Principal;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * Kurumsal e-posta yapılandırması ve gönderim günlüğü.
 *
 * PAROLA HİÇBİR UÇTAN DÖNMEZ ve hiçbir uçtan KABUL EDİLMEZ. Yalnızca
 * BIDB_MAIL_PAROLA ortam değişkeninden okunur; panele gönderilen tek bilgi
 * "tanımlı mı?" ikilisidir. Bu, parolanın tarayıcı geçmişine, ara belleklere
 * ve panel yanıtlarına düşmesini baştan imkânsız kılar.
 */
@RestController
@RequestMapping("/api/admin/mail")
public class AdminMailController {

    private final MailSettingRepo ayarDepo;
    private final MailLogRepo gunlukDepo;
    private final EpostaServisi eposta;
    private final YoneticiHesabiServisi hesaplar;

    public AdminMailController(MailSettingRepo ayarDepo, MailLogRepo gunlukDepo,
                               EpostaServisi eposta, YoneticiHesabiServisi hesaplar) {
        this.ayarDepo = ayarDepo;
        this.gunlukDepo = gunlukDepo;
        this.eposta = eposta;
        this.hesaplar = hesaplar;
    }

    /** Panelin okuduğu görünüm. Parola alanı BİLEREK yoktur. */
    public record MailSettingView(
            String host, Integer port, String username, String fromAddress, String fromName,
            String securityMode, boolean enabled, OffsetDateTime updatedAt, String updatedBy,
            boolean passwordDefined, String blockingIssue) {
    }

    /** Panelin yazdığı gövde. Parola alanı BİLEREK yoktur. */
    public record MailSettingForm(
            @Size(max = 200) String host,
            @Min(1) @Max(65535) Integer port,
            @Size(max = 200) String username,
            @Email @Size(max = 254) String fromAddress,
            @Size(max = 120) String fromName,
            @Size(max = 20) String securityMode,
            boolean enabled) {
    }

    public record MailLogView(Long id, OffsetDateTime createdAt, String toAddress,
                              String subject, String purpose, String status, String errorMessage) {
        static MailLogView of(MailLog k) {
            return new MailLogView(k.getId(), k.getCreatedAt(), k.getToAddress(), k.getSubject(),
                    k.getPurpose().name(), k.getStatus().name(), k.getErrorMessage());
        }
    }

    @GetMapping("/settings")
    public MailSettingView ayarlar() {
        return gorunum(eposta.ayar());
    }

    @PutMapping("/settings")
    public ResponseEntity<?> kaydet(@Valid @RequestBody MailSettingForm form, Principal kim) {
        MailSetting.SecurityMode kip;
        try {
            kip = MailSetting.SecurityMode.valueOf(
                    form.securityMode() == null ? "STARTTLS" : form.securityMode().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Geçersiz güvenlik kipi.");
        }

        MailSetting a = ayarDepo.findFirstByOrderByIdAsc().orElseGet(MailSetting::new);
        a.setHost(bosaCevir(form.host()));
        a.setPort(form.port());
        a.setUsername(bosaCevir(form.username()));
        a.setFromAddress(bosaCevir(form.fromAddress()));
        a.setFromName(bosaCevir(form.fromName()));
        a.setSecurityMode(kip);

        /* Eksik yapılandırmayla "açık" duruma geçilemez. Aksi hâlde gönderim
           açık görünür ama her deneme sessizce atlanır; yönetici e-postaların
           gittiğini sanır. Hangi alanın eksik olduğu mesajda söylenir. */
        if (form.enabled()) {
            MailSetting deneme = kopyala(a, true);
            String engel = eposta.eksik(deneme);
            if (engel != null) {
                return ResponseEntity.badRequest().body("Gönderim açılamadı: " + engel);
            }
        }
        a.setEnabled(form.enabled());
        a.setUpdatedAt(OffsetDateTime.now());
        a.setUpdatedBy(kim == null ? null : kim.getName());
        ayarDepo.save(a);
        return ResponseEntity.ok(gorunum(a));
    }

    /* ---------- yönetici hesabının bildirim adresi ----------

       Parola yenileme iletisi bu adrese gider. Adres tanımlı değilse akış
       hiç çalışmaz; panelde bu durum açıkça gösterilir.

       Parola BURADAN DEĞİŞTİRİLEMEZ. Bilinçli: oturumu ele geçiren biri
       tek istekle parolayı değiştirip hesabı kalıcı olarak devralabilirdi.
       Parola yalnızca e-posta ile doğrulanan yenileme akışından değişir. */

    public record AccountView(String username, String email, OffsetDateTime passwordUpdatedAt) {}

    public record AccountForm(@Email @Size(max = 254) String email) {}

    @GetMapping("/account")
    public ResponseEntity<?> hesap() {
        var h = hesaplar.hesap();
        if (h == null) return ResponseEntity.status(500).body("Yönetici hesabı bulunamadı.");
        return ResponseEntity.ok(new AccountView(h.getUsername(), h.getEmail(), h.getPasswordUpdatedAt()));
    }

    @PutMapping("/account")
    public ResponseEntity<?> hesapKaydet(@Valid @RequestBody AccountForm form) {
        var h = hesaplar.hesap();
        if (h == null) return ResponseEntity.status(500).body("Yönetici hesabı bulunamadı.");
        hesaplar.epostaBelirle(h, bosaCevir(form.email()));
        return ResponseEntity.ok(new AccountView(h.getUsername(), h.getEmail(), h.getPasswordUpdatedAt()));
    }

    @GetMapping("/log")
    public List<MailLogView> gunluk() {
        return gunlukDepo.findAllByOrderByCreatedAtDesc(Limit.of(200)).stream().map(MailLogView::of).toList();
    }

    /**
     * Sınama iletisi. Yapılandırmanın gerçekten çalıştığını, parola
     * sıfırlama gibi kritik bir akışı beklemeden görmeyi sağlar.
     *
     * Alıcı serbest bırakılmaz; yalnızca yapılandırılmış GÖNDEREN adresine
     * yollanır. Aksi hâlde panel, kuruma ait sunucudan istenen adrese ileti
     * yollayan açık bir araca dönerdi.
     */
    @PostMapping("/test")
    public ResponseEntity<?> sinama() {
        MailSetting a = eposta.ayar();
        String engel = eposta.eksik(a);
        if (engel != null) {
            return ResponseEntity.badRequest().body(engel);
        }
        boolean gitti = eposta.gonder(
                a.getFromAddress(),
                "Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı — sınama iletisi",
                """
                Bu ileti, kurumsal e-posta gönderim ayarlarının sınanması amacıyla
                yönetim paneli üzerinden gönderilmiştir.

                Bu iletiyi aldıysanız yapılandırma çalışmaktadır. Herhangi bir
                işlem yapmanız gerekmemektedir.

                Hacettepe Üniversitesi
                Bilgi İşlem Daire Başkanlığı
                """,
                MailLog.Purpose.SINAMA);
        return gitti
                ? ResponseEntity.ok("Sınama iletisi gönderildi: " + a.getFromAddress())
                : ResponseEntity.status(502).body("Sınama iletisi gönderilemedi. Ayrıntı gönderim günlüğünde.");
    }

    private MailSettingView gorunum(MailSetting a) {
        return new MailSettingView(
                a.getHost(), a.getPort(), a.getUsername(), a.getFromAddress(), a.getFromName(),
                a.getSecurityMode() == null ? "STARTTLS" : a.getSecurityMode().name(),
                a.isEnabled(), a.getUpdatedAt(), a.getUpdatedBy(),
                eposta.parolaTanimliMi(), eposta.eksik(a));
    }

    private MailSetting kopyala(MailSetting k, boolean acik) {
        MailSetting y = new MailSetting();
        y.setHost(k.getHost());
        y.setPort(k.getPort());
        y.setUsername(k.getUsername());
        y.setFromAddress(k.getFromAddress());
        y.setFromName(k.getFromName());
        y.setSecurityMode(k.getSecurityMode());
        y.setEnabled(acik);
        return y;
    }

    private static String bosaCevir(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
