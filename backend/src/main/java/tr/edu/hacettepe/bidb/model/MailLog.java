package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

/**
 * Gönderilen ya da gönderilemeyen bir e-postanın kaydı.
 *
 * İLETİ GÖVDESİ SAKLANMAZ ve bu bilinçlidir: parola sıfırlama e-postasının
 * gövdesi sıfırlama bağlantısını taşır. Gövdeyi günlüğe yazmak, panele
 * erişebilen herkese o bağlantıyı vermek demektir; günlüğün kendisi bir
 * saldırı yüzeyine dönüşür. Alıcı ve konu, ne olduğunu anlamaya yeter.
 */
@Entity
@Table(name = "mail_log")
public class MailLog {

    /** Gönderim sebebi; günlüğü okurken hangi akıştan geldiğini söyler. */
    public enum Purpose { PAROLA_SIFIRLAMA, TALEP_BILDIRIM, SINAMA }

    /** SENT: sunucu kabul etti. FAILED: hata. SKIPPED: gönderim kapalı. */
    public enum Status { SENT, FAILED, SKIPPED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "to_address", nullable = false, length = 254)
    private String toAddress;

    @Column(nullable = false, length = 300)
    private String subject;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private Purpose purpose;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;

    @Column(name = "error_message", length = 500)
    private String errorMessage;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToAddress() { return toAddress; }
    public void setToAddress(String toAddress) { this.toAddress = toAddress; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Purpose getPurpose() { return purpose; }
    public void setPurpose(Purpose purpose) { this.purpose = purpose; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
