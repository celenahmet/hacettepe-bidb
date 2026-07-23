package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

/** Kişi veya oturum bilgisi içermeyen tek bir sayfa görüntüleme olayı. */
@Entity
@Table(name = "analytics_page_view")
public class AnalyticsPageView {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String path;

    @Column(nullable = false, length = 2)
    private String language;

    @Column(name = "device_class", nullable = false, length = 12)
    private String deviceClass;

    @Column(name = "referrer_type", nullable = false, length = 12)
    private String referrerType;

    @Column(name = "recorded_at", nullable = false)
    private OffsetDateTime recordedAt = OffsetDateTime.now();

    public Long getId() { return id; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getDeviceClass() { return deviceClass; }
    public void setDeviceClass(String deviceClass) { this.deviceClass = deviceClass; }
    public String getReferrerType() { return referrerType; }
    public void setReferrerType(String referrerType) { this.referrerType = referrerType; }
    public OffsetDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(OffsetDateTime recordedAt) { this.recordedAt = recordedAt; }
}
