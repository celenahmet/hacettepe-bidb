package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

/** Menü bağlantısı. Ya bir sayfaya ya da dış adrese işaret eder. */
@Entity
@Table(name = "menu_oge")
public class MenuOge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String etiket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sayfa_id")
    private Sayfa sayfa;

    @Column(name = "dis_adres", length = 500)
    private String disAdres;

    @Column(name = "yeni_sekme", nullable = false)
    private boolean yeniSekme = false;

    @Column(nullable = false)
    private int sira = 0;

    public Long getId() { return id; }
    public String getEtiket() { return etiket; }
    public Sayfa getSayfa() { return sayfa; }
    public String getDisAdres() { return disAdres; }
    public boolean isYeniSekme() { return yeniSekme; }
    public int getSira() { return sira; }
}
