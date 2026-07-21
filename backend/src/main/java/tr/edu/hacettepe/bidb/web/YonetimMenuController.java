package tr.edu.hacettepe.bidb.web;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.model.Menu;
import tr.edu.hacettepe.bidb.model.MenuOge;
import tr.edu.hacettepe.bidb.repo.MenuOgeRepo;
import tr.edu.hacettepe.bidb.repo.MenuRepo;
import tr.edu.hacettepe.bidb.repo.SayfaRepo;

import java.util.Comparator;
import java.util.List;

/**
 * Menü yönetimi: bölümler ve içlerindeki bağlantılar.
 * Kimlik doğrulaması gerektirir (bkz. GuvenlikAyari).
 */
@RestController
@RequestMapping("/api/yonetim/menu")
public class YonetimMenuController {

    private final MenuRepo menuler;
    private final MenuOgeRepo ogeler;
    private final SayfaRepo sayfalar;

    public YonetimMenuController(MenuRepo menuler, MenuOgeRepo ogeler, SayfaRepo sayfalar) {
        this.menuler = menuler;
        this.ogeler = ogeler;
        this.sayfalar = sayfalar;
    }

    /* ---------- görüntüleme ---------- */

    public record OgeGorunum(Long id, String etiket, Long sayfaId, String sayfaYolu,
                             String disAdres, boolean yeniSekme, int sira) {}

    public record MenuGorunum(Long id, String dil, String konum, String baslik, int sira,
                              List<OgeGorunum> ogeler) {}

    /** Menü öğelerindeki sayfa bilgisi tembel yüklendiği için işlem içinde çalışır. */
    @GetMapping
    @Transactional
    public List<MenuGorunum> liste() {
        return menuler.findAll().stream()
                .sorted(Comparator.comparing(Menu::getDil).thenComparingInt(Menu::getSira))
                .map(m -> new MenuGorunum(
                        m.getId(), m.getDil(), m.getKonum(), m.getBaslik(), m.getSira(),
                        ogeler.findByMenuIdOrderBySiraAsc(m.getId()).stream()
                                .map(o -> new OgeGorunum(
                                        o.getId(), o.getEtiket(),
                                        o.getSayfa() == null ? null : o.getSayfa().getId(),
                                        o.getSayfa() == null ? null
                                                : "/" + o.getSayfa().getDil() + "/" + o.getSayfa().getSlug(),
                                        o.getDisAdres(), o.isYeniSekme(), o.getSira()))
                                .toList()))
                .toList();
    }

    /* ---------- menü bölümü ---------- */

    public record MenuIstek(String dil, String konum, String baslik, int sira) {
        Menu aktar(Menu m) {
            m.setDil(dil);
            m.setKonum(konum == null || konum.isBlank() ? "sol" : konum);
            m.setBaslik(baslik);
            m.setSira(sira);
            return m;
        }
    }

    @PostMapping
    @Transactional
    public Menu bolumEkle(@RequestBody MenuIstek istek) {
        return menuler.save(istek.aktar(new Menu()));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Menu> bolumGuncelle(@PathVariable Long id, @RequestBody MenuIstek istek) {
        return menuler.findById(id)
                .map(m -> ResponseEntity.ok(menuler.save(istek.aktar(m))))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> bolumSil(@PathVariable Long id) {
        if (!menuler.existsById(id)) return ResponseEntity.notFound().build();
        menuler.deleteById(id);   // öğeler veritabanında ilişkili olarak silinir
        return ResponseEntity.noContent().build();
    }

    /* ---------- menü öğesi ---------- */

    public record OgeIstek(Long menuId, String etiket, Long sayfaId, String disAdres,
                           boolean yeniSekme, int sira) {}

    private MenuOge aktar(OgeIstek istek, MenuOge o) {
        o.setMenuId(istek.menuId());
        o.setEtiket(istek.etiket());
        o.setSayfa(istek.sayfaId() == null ? null : sayfalar.findById(istek.sayfaId()).orElse(null));
        // Sayfa seçildiyse dış adres tutulmaz; ikisi birden anlamlı değildir
        o.setDisAdres(istek.sayfaId() == null ? istek.disAdres() : null);
        o.setYeniSekme(istek.yeniSekme());
        o.setSira(istek.sira());
        return o;
    }

    @PostMapping("/oge")
    @Transactional
    public MenuOge ogeEkle(@RequestBody OgeIstek istek) {
        return ogeler.save(aktar(istek, new MenuOge()));
    }

    @PutMapping("/oge/{id}")
    @Transactional
    public ResponseEntity<MenuOge> ogeGuncelle(@PathVariable Long id, @RequestBody OgeIstek istek) {
        return ogeler.findById(id)
                .map(o -> ResponseEntity.ok(ogeler.save(aktar(istek, o))))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/oge/{id}")
    @Transactional
    public ResponseEntity<Void> ogeSil(@PathVariable Long id) {
        if (!ogeler.existsById(id)) return ResponseEntity.notFound().build();
        ogeler.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
