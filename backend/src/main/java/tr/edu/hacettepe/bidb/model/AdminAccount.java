package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

/**
 * Yönetim paneli hesabı.
 *
 * Parola yalnızca BCrypt karması olarak saklanır; düz hâli hiçbir yerde
 * tutulmaz ve hiçbir uçtan dönmez.
 */
@Entity
@Table(name = "admin_account")
public class AdminAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120, unique = true)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 200)
    private String passwordHash;

    /** Sıfırlama iletisinin gideceği adres; tanımlı değilse akış çalışmaz. */
    @Column(length = 254)
    private String email;

    @Column(name = "password_updated_at")
    private OffsetDateTime passwordUpdatedAt;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public OffsetDateTime getPasswordUpdatedAt() { return passwordUpdatedAt; }
    public void setPasswordUpdatedAt(OffsetDateTime v) { this.passwordUpdatedAt = v; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime v) { this.createdAt = v; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime v) { this.updatedAt = v; }
}
