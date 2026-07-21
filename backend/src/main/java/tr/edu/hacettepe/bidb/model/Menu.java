package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/** Menü başlığı (sol menüdeki bölüm). */
@Entity
@Table(name = "menu")
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2)
    private String dil;

    /** sol | ust | alt */
    @Column(nullable = false, length = 10)
    private String konum = "sol";

    @Column(nullable = false, length = 200)
    private String baslik;

    @Column(nullable = false)
    private int sira = 0;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id")
    @OrderBy("sira ASC")
    private List<MenuOge> ogeler = new ArrayList<>();

    public Long getId() { return id; }
    public String getDil() { return dil; }
    public String getKonum() { return konum; }
    public String getBaslik() { return baslik; }
    public int getSira() { return sira; }
    public List<MenuOge> getOgeler() { return ogeler; }
}
