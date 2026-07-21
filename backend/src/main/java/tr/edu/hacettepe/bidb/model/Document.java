package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

/** Sayfaya bağlı indirilebilir belge (form, yönerge, kılavuz). */
@Entity
@Table(name = "belge")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sayfa_id")
    private Page sayfa;

    @Column(nullable = false, length = 400)
    private String ad;

    @Column(nullable = false, length = 700)
    private String adres;

    @Column(length = 10)
    private String tur;

    @Column(nullable = false)
    private int sira = 0;

    public Long getId() { return id; }
    public Page getSayfa() { return sayfa; }
    public void setSayfa(Page sayfa) { this.sayfa = sayfa; }
    public String getAd() { return ad; }
    public void setAd(String ad) { this.ad = ad; }
    public String getAdres() { return adres; }
    public void setAdres(String adres) { this.adres = adres; }
    public String getTur() { return tur; }
    public void setTur(String tur) { this.tur = tur; }
    public int getSira() { return sira; }
    public void setSira(int sira) { this.sira = sira; }
}
