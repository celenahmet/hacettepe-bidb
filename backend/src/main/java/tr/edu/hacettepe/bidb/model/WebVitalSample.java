package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

/** Kimlik veya oturum bilgisi içermeyen tek bir Web Vitals ölçümü. */
@Entity
@Table(name = "web_vital_sample")
public class WebVitalSample {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String path;

    @Column(nullable = false, length = 8)
    private String metric;

    @Column(nullable = false)
    private double value;

    @Column(nullable = false, length = 20)
    private String rating;

    @Column(name = "recorded_at", nullable = false)
    private OffsetDateTime recordedAt = OffsetDateTime.now();

    public Long getId() { return id; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public String getMetric() { return metric; }
    public void setMetric(String metric) { this.metric = metric; }
    public double getValue() { return value; }
    public void setValue(double value) { this.value = value; }
    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }
    public OffsetDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(OffsetDateTime recordedAt) { this.recordedAt = recordedAt; }
}

