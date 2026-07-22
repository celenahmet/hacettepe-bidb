package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.LocalDate;

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

    /** Haber kendi sayfasında yayımlanacaksa adresi: /tr/duyuru/<slug> */
    @Column(length = 200)
    private String slug;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "image_alt", length = 300)
    private String imageAlt;

    @Column(name = "content_html", columnDefinition = "text")
    private String contentHtml;

    public Long getId() { return id; }
    public String getLanguage() { return language; }
    public String getTitle() { return title; }
    public String getSummary() { return summary; }
    public LocalDate getPublishedOn() { return publishedOn; }
    public boolean isFeatured() { return featured; }
    public boolean isPublished() { return published; }
    public String getExternalUrl() { return externalUrl; }

    public void setLanguage(String language) { this.language = language; }
    public void setTitle(String title) { this.title = title; }
    public void setSummary(String summary) { this.summary = summary; }
    public void setPublishedOn(java.time.LocalDate publishedOn) { this.publishedOn = publishedOn; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public void setPublished(boolean published) { this.published = published; }
    public void setExternalUrl(String externalUrl) { this.externalUrl = externalUrl; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getImageAlt() { return imageAlt; }
    public void setImageAlt(String imageAlt) { this.imageAlt = imageAlt; }
    public String getContentHtml() { return contentHtml; }
    public void setContentHtml(String contentHtml) { this.contentHtml = contentHtml; }
}
