package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

/** Sayfaya bağlı indirilebilir belge (form, yönerge, kılavuz). */
@Entity
@Table(name = "belge")
public class Belge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sayfa_id")
    private Sayfa sayfa;

    @Column(nullable = false, length = 400)
    private String ad;

    @Column(nullable = false, length = 700)
    private String adres;

    @Column(length = 10)
    private String tur;

    @Column(nullable = false)
    private int sira = 0;

    public Long getId() { return id; }
    public Sayfa getSayfa() { return sayfa; }
    public String getAd() { return ad; }
    public String getAdres() { return adres; }
    public String getTur() { return tur; }
    public int getSira() { return sira; }
}
