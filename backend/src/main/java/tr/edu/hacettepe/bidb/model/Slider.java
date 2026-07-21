package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/** Ana sayfa slider görseli. */
@Entity
@Table(name = "slider")
public class Slider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2)
    private String dil;

    @Column(length = 300)
    private String baslik;

    @Column(name = "alt_baslik", length = 500)
    private String altBaslik;

    @Column(name = "gorsel_url", nullable = false, length = 500)
    private String gorselUrl;

    @Column(name = "gorsel_alt", length = 300)
    private String gorselAlt;

    @Column(length = 500)
    private String baglanti;

    @Column(nullable = false)
    private int sira = 0;

    @Column(nullable = false)
    private boolean yayinda = true;

    private LocalDate baslangic;
    private LocalDate bitis;

    public Long getId() { return id; }
    public String getDil() { return dil; }
    public String getBaslik() { return baslik; }
    public String getAltBaslik() { return altBaslik; }
    public String getGorselUrl() { return gorselUrl; }
    public String getGorselAlt() { return gorselAlt; }
    public String getBaglanti() { return baglanti; }
    public int getSira() { return sira; }
    public boolean isYayinda() { return yayinda; }
    public LocalDate getBaslangic() { return baslangic; }
    public LocalDate getBitis() { return bitis; }

    public void setDil(String dil) { this.dil = dil; }
    public void setBaslik(String baslik) { this.baslik = baslik; }
    public void setAltBaslik(String altBaslik) { this.altBaslik = altBaslik; }
    public void setGorselUrl(String gorselUrl) { this.gorselUrl = gorselUrl; }
    public void setGorselAlt(String gorselAlt) { this.gorselAlt = gorselAlt; }
    public void setBaglanti(String baglanti) { this.baglanti = baglanti; }
    public void setSira(int sira) { this.sira = sira; }
    public void setYayinda(boolean yayinda) { this.yayinda = yayinda; }
}
