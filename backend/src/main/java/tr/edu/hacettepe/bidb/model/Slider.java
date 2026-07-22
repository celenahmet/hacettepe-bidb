package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/** Ana sayfa slider görseli. */
@Entity
@Table(name = "slide")
public class Slider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2)
    private String language;

    @Column(length = 300)
    private String title;

    @Column(name = "subtitle", length = 500)
    private String subtitle;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "image_alt", length = 300)
    private String imageAlt;

    @Column(length = 500)
    private String linkUrl;

    @Column(nullable = false)
    private int sortOrder = 0;

    @Column(nullable = false)
    private boolean published = true;

    private LocalDate startsOn;
    private LocalDate endsOn;

    public Long getId() { return id; }
    public String getLanguage() { return language; }
    public String getTitle() { return title; }
    public String getSubtitle() { return subtitle; }
    public String getImageUrl() { return imageUrl; }
    public String getImageAlt() { return imageAlt; }
    public String getLinkUrl() { return linkUrl; }
    public int getSortOrder() { return sortOrder; }
    public boolean isPublished() { return published; }
    public LocalDate getStartsOn() { return startsOn; }
    public LocalDate getEndsOn() { return endsOn; }

    public void setLanguage(String language) { this.language = language; }
    public void setTitle(String title) { this.title = title; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setImageAlt(String imageAlt) { this.imageAlt = imageAlt; }
    public void setLinkUrl(String linkUrl) { this.linkUrl = linkUrl; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
    public void setPublished(boolean published) { this.published = published; }
}
