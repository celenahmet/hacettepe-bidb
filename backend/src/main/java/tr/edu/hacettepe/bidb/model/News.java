package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

/** Haber ve news. */
@Entity
@Table(name = "news")
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2)
    private String language;

    @Column(nullable = false, length = 400)
    private String title;

    @Column(length = 1000)
    private String summary;

    @Column(name = "published_on", nullable = false)
    private LocalDate publishedOn;

    @Column(name = "featured", nullable = false)
    private boolean featured = false;

    @Column(nullable = false)
    private boolean published = true;

    @Column(name = "external_url", length = 500)
    private String externalUrl;

    /** Duyuru detay sayfası yerine doğrudan yüklenen belgeye yönlenir. */
    @Column(name = "document_only", nullable = false)
    private boolean documentOnly = false;

    /** Haber kendi sayfasında yayımlanacaksa adresi: /tr/duyuru/<slug> */
    @Column(length = 200)
    private String slug;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "image_alt", length = 300)
    private String imageAlt;

    @Column(name = "content_html", columnDefinition = "text")
    private String contentHtml;

    @Column(name = "view_count", nullable = false)
    private long viewCount = 0;

    @Column(nullable = false, length = 40)
    private String category = "general";

    @Column(nullable = false, length = 40)
    private String audience = "all-users";

    @Column(name = "cover_template", nullable = false, length = 40)
    private String coverTemplate = "institutional";

    @Column(name = "cover_text", length = 120)
    private String coverText;

    @Column(name = "seo_title", length = 300)
    private String seoTitle;

    @Column(name = "seo_description", length = 500)
    private String seoDescription;

    @Column(name = "seo_keywords", length = 500)
    private String seoKeywords;

    @Column(name = "seo_robots", nullable = false, length = 80)
    private String seoRobots = "index, follow";

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    public Long getId() { return id; }
    public String getLanguage() { return language; }
    public String getTitle() { return title; }
    public String getSummary() { return summary; }
    public LocalDate getPublishedOn() { return publishedOn; }
    public boolean isFeatured() { return featured; }
    public boolean isPublished() { return published; }
    public String getExternalUrl() { return externalUrl; }
    public boolean isDocumentOnly() { return documentOnly; }

    public void setLanguage(String language) { this.language = language; }
    public void setTitle(String title) { this.title = title; }
    public void setSummary(String summary) { this.summary = summary; }
    public void setPublishedOn(java.time.LocalDate publishedOn) { this.publishedOn = publishedOn; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public void setPublished(boolean published) { this.published = published; }
    public void setExternalUrl(String externalUrl) { this.externalUrl = externalUrl; }
    public void setDocumentOnly(boolean documentOnly) { this.documentOnly = documentOnly; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getImageAlt() { return imageAlt; }
    public void setImageAlt(String imageAlt) { this.imageAlt = imageAlt; }
    public String getContentHtml() { return contentHtml; }
    public void setContentHtml(String contentHtml) { this.contentHtml = contentHtml; }
    public long getViewCount() { return viewCount; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getAudience() { return audience; }
    public void setAudience(String audience) { this.audience = audience; }
    public String getCoverTemplate() { return coverTemplate; }
    public void setCoverTemplate(String coverTemplate) { this.coverTemplate = coverTemplate; }
    public String getCoverText() { return coverText; }
    public void setCoverText(String coverText) { this.coverText = coverText; }
    public String getSeoTitle() { return seoTitle; }
    public void setSeoTitle(String seoTitle) { this.seoTitle = seoTitle; }
    public String getSeoDescription() { return seoDescription; }
    public void setSeoDescription(String seoDescription) { this.seoDescription = seoDescription; }
    public String getSeoKeywords() { return seoKeywords; }
    public void setSeoKeywords(String seoKeywords) { this.seoKeywords = seoKeywords; }
    public String getSeoRobots() { return seoRobots; }
    public void setSeoRobots(String seoRobots) { this.seoRobots = seoRobots; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
