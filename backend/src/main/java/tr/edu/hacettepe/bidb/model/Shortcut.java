package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

/** Ana sayfadaki kısayol kutusu veya servis karuseli öğesi.
 *  100 ve üzeri sıra değerleri servis karuselini gösterir. */
@Entity
@Table(name = "shortcut")
public class Shortcut {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2)
    private String language;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "icon_url", length = 500)
    private String iconUrl;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(name = "new_tab", nullable = false)
    private boolean newTab = false;

    @Column(nullable = false)
    private int sortOrder = 0;

    @Column(nullable = false)
    private boolean published = true;

    public Long getId() { return id; }
    public String getLanguage() { return language; }
    public String getName() { return name; }
    public String getIconUrl() { return iconUrl; }
    public String getUrl() { return url; }
    public boolean isNewTab() { return newTab; }
    public int getSortOrder() { return sortOrder; }
    public boolean isPublished() { return published; }

    public void setLanguage(String language) { this.language = language; }
    public void setName(String name) { this.name = name; }
    public void setIconUrl(String iconUrl) { this.iconUrl = iconUrl; }
    public void setUrl(String url) { this.url = url; }
    public void setNewTab(boolean newTab) { this.newTab = newTab; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
    public void setPublished(boolean published) { this.published = published; }
}
