package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

/** Bir dildeki tek bir içerik sayfası. Slug + dil birlikte benzersizdir. */
@Entity
@Table(name = "sayfa")
public class Sayfa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String slug;

    @Column(nullable = false, length = 2)
    private String dil;

    @Column(nullable = false, length = 300)
    private String baslik;

    /** Kaynak içerik birebir saklanır. */
    @Column(name = "icerik_html", nullable = false, columnDefinition = "text")
    private String icerikHtml = "";

    @Column(name = "seo_title", length = 300)
    private String seoTitle;

    @Column(name = "seo_description", length = 500)
    private String seoDescription;

    @Column(name = "seo_keywords", length = 500)
    private String seoKeywords;

    @Column(nullable = false)
    private boolean yayinda = true;

    @Column(nullable = false)
    private int sira = 0;

    @Column(name = "guncelleme")
    private OffsetDateTime guncelleme;

    @OneToMany(mappedBy = "sayfa", fetch = FetchType.LAZY)
    @OrderBy("sira ASC")
    private List<Belge> belgeler = new ArrayList<>();

    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getDil() { return dil; }
    public void setDil(String dil) { this.dil = dil; }
    public String getBaslik() { return baslik; }
    public void setBaslik(String baslik) { this.baslik = baslik; }
    public String getIcerikHtml() { return icerikHtml; }
    public void setIcerikHtml(String icerikHtml) { this.icerikHtml = icerikHtml; }
    public String getSeoTitle() { return seoTitle; }
    public void setSeoTitle(String seoTitle) { this.seoTitle = seoTitle; }
    public String getSeoDescription() { return seoDescription; }
    public void setSeoDescription(String seoDescription) { this.seoDescription = seoDescription; }
    public String getSeoKeywords() { return seoKeywords; }
    public void setSeoKeywords(String seoKeywords) { this.seoKeywords = seoKeywords; }
    public boolean isYayinda() { return yayinda; }
    public void setYayinda(boolean yayinda) { this.yayinda = yayinda; }
    public int getSira() { return sira; }
    public void setSira(int sira) { this.sira = sira; }
    public OffsetDateTime getGuncelleme() { return guncelleme; }
    public void setGuncelleme(OffsetDateTime guncelleme) { this.guncelleme = guncelleme; }
    public List<Belge> getBelgeler() { return belgeler; }
}
