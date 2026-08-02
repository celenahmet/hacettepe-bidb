package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

/**
 * Kurumsal e-posta gönderim yapılandırması. Tablo tek satır tutar.
 *
 * PAROLA BU SINIFTA YOKTUR ve bilinçlidir: veritabanı yedekleri, göç
 * dökümleri ve panel yanıtları parolayı taşımamalı. Parola yalnızca
 * BIDB_MAIL_PAROLA ortam değişkeninden okunur.
 */
@Entity
@Table(name = "mail_setting")
public class MailSetting {

    /** Güvenlik kipi: şifresiz, STARTTLS ya da baştan SSL. */
    public enum SecurityMode { NONE, STARTTLS, SSL }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Tabloda ikinci satır oluşmasını engelleyen tekil kısıtın sütunu. */
    @Column(name = "tek_satir", nullable = false)
    private boolean tekSatir = true;

    @Column(length = 200)
    private String host;

    private Integer port;

    @Column(length = 200)
    private String username;

    @Column(name = "from_address", length = 254)
    private String fromAddress;

    @Column(name = "from_name", length = 120)
    private String fromName;

    @Enumerated(EnumType.STRING)
    @Column(name = "security_mode", nullable = false, length = 20)
    private SecurityMode securityMode = SecurityMode.STARTTLS;

    /** Kapalıyken hiçbir e-posta gönderilmez; denemeler günlüğe SKIPPED düşer. */
    @Column(nullable = false)
    private boolean enabled = false;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @Column(name = "updated_by", length = 120)
    private String updatedBy;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public boolean isTekSatir() { return tekSatir; }
    public void setTekSatir(boolean tekSatir) { this.tekSatir = tekSatir; }

    public String getHost() { return host; }
    public void setHost(String host) { this.host = host; }

    public Integer getPort() { return port; }
    public void setPort(Integer port) { this.port = port; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFromAddress() { return fromAddress; }
    public void setFromAddress(String fromAddress) { this.fromAddress = fromAddress; }

    public String getFromName() { return fromName; }
    public void setFromName(String fromName) { this.fromName = fromName; }

    public SecurityMode getSecurityMode() { return securityMode; }
    public void setSecurityMode(SecurityMode securityMode) { this.securityMode = securityMode; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}
