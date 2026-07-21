package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/** Haber ve duyurular. */
@Entity
@Table(name = "duyuru")
public class Duyuru {

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
}
