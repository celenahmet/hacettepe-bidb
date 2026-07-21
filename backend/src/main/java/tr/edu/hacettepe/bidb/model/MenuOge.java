package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

/** Menü bağlantısı. Ya bir sayfaya ya da dış adrese işaret eder. */
@Entity
@Table(name = "menu_oge")
public class MenuOge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_id", nullable = false)
    private Long menuId;

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
    public Long getMenuId() { return menuId; }
    public void setMenuId(Long menuId) { this.menuId = menuId; }

    public String getEtiket() { return etiket; }
    public Sayfa getSayfa() { return sayfa; }
    public String getDisAdres() { return disAdres; }
    public boolean isYeniSekme() { return yeniSekme; }
    public int getSira() { return sira; }

    public void setEtiket(String etiket) { this.etiket = etiket; }
    public void setSayfa(Sayfa sayfa) { this.sayfa = sayfa; }
    public void setDisAdres(String disAdres) { this.disAdres = disAdres; }
    public void setYeniSekme(boolean yeniSekme) { this.yeniSekme = yeniSekme; }
    public void setSira(int sira) { this.sira = sira; }
}
