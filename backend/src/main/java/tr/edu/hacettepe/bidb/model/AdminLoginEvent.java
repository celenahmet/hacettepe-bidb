package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

/** Yönetim paneline yapılan bir giriş denemesinin kaydı (güvenlik denetimi). */
@Entity
@Table(name = "admin_login_event")
public class AdminLoginEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "occurred_at", nullable = false)
    private OffsetDateTime occurredAt = OffsetDateTime.now();

    @Column(nullable = false)
    private boolean successful;

    @Column(name = "attempted_username", length = 120)
    private String attemptedUsername;

    @Column(name = "ip_address", nullable = false, length = 64)
    private String ipAddress;

    /** Doğrudan bağlantının geldiği adres (genelde kurum içi/private ağ); ipAddress ile
     *  aynıysa (ör. ters vekil sunucu yoksa) yine de ayrı saklanır — karşılaştırma kolaylaşır. */
    @Column(name = "local_ip_address", length = 64)
    private String localIpAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "device_class", length = 20)
    private String deviceClass;

    @Column(length = 40)
    private String browser;

    @Column(name = "operating_system", length = 40)
    private String operatingSystem;

    @Column(length = 120)
    private String city;

    @Column(length = 120)
    private String country;

    public Long getId() { return id; }
    public OffsetDateTime getOccurredAt() { return occurredAt; }
    public boolean isSuccessful() { return successful; }
    public void setSuccessful(boolean successful) { this.successful = successful; }
    public String getAttemptedUsername() { return attemptedUsername; }
    public void setAttemptedUsername(String attemptedUsername) { this.attemptedUsername = attemptedUsername; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getLocalIpAddress() { return localIpAddress; }
    public void setLocalIpAddress(String localIpAddress) { this.localIpAddress = localIpAddress; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    public String getDeviceClass() { return deviceClass; }
    public void setDeviceClass(String deviceClass) { this.deviceClass = deviceClass; }
    public String getBrowser() { return browser; }
    public void setBrowser(String browser) { this.browser = browser; }
    public String getOperatingSystem() { return operatingSystem; }
    public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
}
