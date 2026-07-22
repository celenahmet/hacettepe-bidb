package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

/**
 * Bir sayfanın geçmiş hâli.
 *
 * Sayfa her kaydedildiğinde, kaydetmeden ÖNCEKİ hâli buraya yazılır.
 * Böylece yanlış bir düzenleme geri alınabilir ve kaynak aktarımından
 * gelen ilk hâl kalıcı olarak korunur.
 */
@Entity
@Table(name = "page_revision")
public class PageRevision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "page_id", nullable = false)
    private Long pageId;

    @Column(length = 300)
    private String title;

    @Column(name = "content_html", nullable = false, columnDefinition = "text")
    private String contentHtml;

    @Column(length = 200)
    private String note;

    @Column(length = 100)
    private String savedBy;

    @Column(name = "saved_at", insertable = false, updatable = false)
    private OffsetDateTime savedAt;

    public Long getId() { return id; }
    public Long getPageId() { return pageId; }
    public void setPageId(Long pageId) { this.pageId = pageId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContentHtml() { return contentHtml; }
    public void setContentHtml(String contentHtml) { this.contentHtml = contentHtml; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public String getSavedBy() { return savedBy; }
    public void setSavedBy(String savedBy) { this.savedBy = savedBy; }
    public OffsetDateTime getSavedAt() { return savedAt; }
}
