package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/** Haber ve duyurular. */
@Entity
@Table(name = "duyuru")
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2)
    private String dil;

    @Column(nullable = false, length = 400)
    private String baslik;

    @Column(length = 1000)
    private String ozet;

    @Column(name = "yayin_tarihi", nullable = false)
    private LocalDate yayinTarihi;

    @Column(name = "one_cikan", nullable = false)
    private boolean oneCikan = false;

    @Column(nullable = false)
    private boolean yayinda = true;

    @Column(name = "dis_adres", length = 500)
    private String disAdres;

    /** Haber kendi sayfasında yayımlanacaksa adresi: /tr/duyuru/<slug> */
    @Column(length = 200)
    private String slug;

    @Column(name = "gorsel_url", length = 500)
    private String gorselUrl;

    @Column(name = "gorsel_alt", length = 300)
    private String gorselAlt;

    @Column(name = "icerik_html", columnDefinition = "text")
    private String icerikHtml;

    public Long getId() { return id; }
    public String getDil() { return dil; }
    public String getBaslik() { return baslik; }
    public String getOzet() { return ozet; }
    public LocalDate getYayinTarihi() { return yayinTarihi; }
    public boolean isOneCikan() { return oneCikan; }
    public boolean isYayinda() { return yayinda; }
    public String getDisAdres() { return disAdres; }

    public void setDil(String dil) { this.dil = dil; }
    public void setBaslik(String baslik) { this.baslik = baslik; }
    public void setOzet(String ozet) { this.ozet = ozet; }
    public void setYayinTarihi(java.time.LocalDate yayinTarihi) { this.yayinTarihi = yayinTarihi; }
    public void setOneCikan(boolean oneCikan) { this.oneCikan = oneCikan; }
    public void setYayinda(boolean yayinda) { this.yayinda = yayinda; }
    public void setDisAdres(String disAdres) { this.disAdres = disAdres; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getGorselUrl() { return gorselUrl; }
    public void setGorselUrl(String gorselUrl) { this.gorselUrl = gorselUrl; }
    public String getGorselAlt() { return gorselAlt; }
    public void setGorselAlt(String gorselAlt) { this.gorselAlt = gorselAlt; }
    public String getIcerikHtml() { return icerikHtml; }
    public void setIcerikHtml(String icerikHtml) { this.icerikHtml = icerikHtml; }
}
