package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

/**
 * Parola sıfırlama jetonu.
 *
 * Jetonun kendisi SAKLANMAZ; yalnızca SHA-256 karması tutulur. Veritabanını
 * okuyabilen biri saklanan değerle sıfırlama yapamamalıdır.
 */
@Entity
@Table(name = "admin_password_reset")
public class AdminPasswordReset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    private AdminAccount account;

    @Column(name = "token_hash", nullable = false, length = 64, unique = true)
    private String tokenHash;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(name = "used_at")
    private OffsetDateTime usedAt;

    @Column(name = "requested_ip", length = 64)
    private String requestedIp;

    @Column(name = "used_ip", length = 64)
    private String usedIp;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public AdminAccount getAccount() { return account; }
    public void setAccount(AdminAccount a) { this.account = a; }

    public String getTokenHash() { return tokenHash; }
    public void setTokenHash(String v) { this.tokenHash = v; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime v) { this.createdAt = v; }

    public OffsetDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(OffsetDateTime v) { this.expiresAt = v; }

    public OffsetDateTime getUsedAt() { return usedAt; }
    public void setUsedAt(OffsetDateTime v) { this.usedAt = v; }

    public String getRequestedIp() { return requestedIp; }
    public void setRequestedIp(String v) { this.requestedIp = v; }

    public String getUsedIp() { return usedIp; }
    public void setUsedIp(String v) { this.usedIp = v; }
}
