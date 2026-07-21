package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

/** Ana sayfadaki kısayol kutusu veya servis karuseli öğesi.
 *  100 ve üzeri sıra değerleri servis karuselini gösterir. */
@Entity
@Table(name = "hizli_erisim")
public class Shortcut {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2)
    private String dil;

    @Column(nullable = false, length = 200)
    private String ad;

    @Column(name = "ikon_url", length = 500)
    private String ikonUrl;

    @Column(nullable = false, length = 500)
    private String adres;

    @Column(name = "yeni_sekme", nullable = false)
    private boolean yeniSekme = false;

    @Column(nullable = false)
    private int sira = 0;

    @Column(nullable = false)
    private boolean yayinda = true;

    public Long getId() { return id; }
    public String getDil() { return dil; }
    public String getAd() { return ad; }
    public String getIkonUrl() { return ikonUrl; }
    public String getAdres() { return adres; }
    public boolean isYeniSekme() { return yeniSekme; }
    public int getSira() { return sira; }
    public boolean isYayinda() { return yayinda; }

    public void setDil(String dil) { this.dil = dil; }
    public void setAd(String ad) { this.ad = ad; }
    public void setIkonUrl(String ikonUrl) { this.ikonUrl = ikonUrl; }
    public void setAdres(String adres) { this.adres = adres; }
    public void setYeniSekme(boolean yeniSekme) { this.yeniSekme = yeniSekme; }
    public void setSira(int sira) { this.sira = sira; }
    public void setYayinda(boolean yayinda) { this.yayinda = yayinda; }
}
