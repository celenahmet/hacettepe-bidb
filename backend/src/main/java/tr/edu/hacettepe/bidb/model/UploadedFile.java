package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

/** Panelden yüklenen belgenin kaydı. Dosyanın kendisi paylaşılan dizinde durur. */
@Entity
@Table(name = "uploaded_file")
public class UploadedFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false, unique = true)
    private String fileName;

    @Column(name = "original_name")
    private String originalName;

    @Column(nullable = false)
    private long sizeBytes;

    @Column(length = 100)
    private String uploadedBy;

    @Column(insertable = false, updatable = false)
    private OffsetDateTime uploadedAt;

    public Long getId() { return id; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getOriginalName() { return originalName; }
    public void setOriginalName(String originalName) { this.originalName = originalName; }
    public long getSizeBytes() { return sizeBytes; }
    public void setSizeBytes(long sizeBytes) { this.sizeBytes = sizeBytes; }
    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }
    public OffsetDateTime getUploadedAt() { return uploadedAt; }
}
