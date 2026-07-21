package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

/** Panelden yüklenen belgenin kaydı. Dosyanın kendisi paylaşılan dizinde durur. */
@Entity
@Table(name = "yuklenen_dosya")
public class UploadedFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dosya_adi", nullable = false, unique = true)
    private String dosyaAdi;

    @Column(name = "ozgun_ad")
    private String ozgunAd;

    @Column(nullable = false)
    private long boyut;

    @Column(length = 100)
    private String yukleyen;

    @Column(insertable = false, updatable = false)
    private OffsetDateTime yukleme;

    public Long getId() { return id; }
    public String getDosyaAdi() { return dosyaAdi; }
    public void setDosyaAdi(String dosyaAdi) { this.dosyaAdi = dosyaAdi; }
    public String getOzgunAd() { return ozgunAd; }
    public void setOzgunAd(String ozgunAd) { this.ozgunAd = ozgunAd; }
    public long getBoyut() { return boyut; }
    public void setBoyut(long boyut) { this.boyut = boyut; }
    public String getYukleyen() { return yukleyen; }
    public void setYukleyen(String yukleyen) { this.yukleyen = yukleyen; }
    public OffsetDateTime getYukleme() { return yukleme; }
}
