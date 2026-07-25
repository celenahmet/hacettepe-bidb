package tr.edu.hacettepe.bidb.web;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.model.Menu;
import tr.edu.hacettepe.bidb.model.MenuItem;
import tr.edu.hacettepe.bidb.repo.MenuItemRepo;
import tr.edu.hacettepe.bidb.repo.MenuRepo;
import tr.edu.hacettepe.bidb.repo.PageRepo;

import java.util.Comparator;
import java.util.List;

/**
 * Menü yönetimi: bölümler ve içlerindeki bağlantılar.
 * Kimlik doğrulaması gerektirir (bkz. SecurityConfig).
 */
@RestController
@RequestMapping("/api/admin/menus")
public class AdminMenuController {

    private final MenuRepo menuler;
    private final MenuItemRepo items;
    private final PageRepo pages;

    public AdminMenuController(MenuRepo menuler, MenuItemRepo items, PageRepo pages) {
        this.menuler = menuler;
        this.items = items;
        this.pages = pages;
    }

    /* ---------- görüntüleme ---------- */

    public record OgeGorunum(Long id, String label, Long pageId, String pagePath,
                             String externalUrl, boolean newTab, int sortOrder) {}

    public record MenuGorunum(Long id, String language, String position, String title, int sortOrder,
                              List<OgeGorunum> items) {}

    /** Menüler, öğeleri ve bağlı sayfaları tek sorguda gelir (bkz. MenuRepo.findAllWithItems). */
    @GetMapping
    public List<MenuGorunum> liste() {
        return menuler.findAllWithItems().stream()
                .sorted(Comparator.comparing(Menu::getLanguage).thenComparingInt(Menu::getSortOrder))
                .map(m -> new MenuGorunum(
                        m.getId(), m.getLanguage(), m.getPosition(), m.getTitle(), m.getSortOrder(),
                        m.getItems().stream()
                                .map(o -> new OgeGorunum(
                                        o.getId(), o.getLabel(),
                                        o.getPage() == null ? null : o.getPage().getId(),
                                        o.getPage() == null ? null
                                                : "/" + o.getPage().getLanguage() + "/" + o.getPage().getSlug(),
                                        o.getExternalUrl(), o.isNewTab(), o.getSortOrder()))
                                .toList()))
                .toList();
    }

    /* ---------- menü bölümü ---------- */

    public record MenuIstek(String language, String position, String title, int sortOrder) {
        Menu aktar(Menu m) {
            m.setLanguage(language);
            m.setPosition(position == null || position.isBlank() ? "sol" : position);
            m.setTitle(title);
            m.setSortOrder(sortOrder);
            return m;
        }
    }

    private static String bolumHatasi(MenuIstek istek) {
        if (Girdi.bos(istek.language())) return "Dil boş olamaz.";
        if (Girdi.bos(istek.title())) return "Başlık boş olamaz.";
        return null;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> bolumEkle(@RequestBody MenuIstek istek) {
        String hata = bolumHatasi(istek);
        if (hata != null) return ResponseEntity.badRequest().body(hata);
        return ResponseEntity.ok(menuler.save(istek.aktar(new Menu())));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> bolumGuncelle(@PathVariable Long id, @RequestBody MenuIstek istek) {
        String hata = bolumHatasi(istek);
        if (hata != null) return ResponseEntity.badRequest().body(hata);
        return menuler.findById(id)
                .map(m -> ResponseEntity.ok((Object) menuler.save(istek.aktar(m))))
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

    public record OgeIstek(Long menuId, String label, Long pageId, String externalUrl,
                           boolean newTab, int sortOrder) {}

    private MenuItem aktar(OgeIstek istek, MenuItem o) {
        o.setMenuId(istek.menuId());
        o.setLabel(istek.label());
        o.setPage(istek.pageId() == null ? null : pages.findById(istek.pageId()).orElse(null));
        // Sayfa seçildiyse dış adres tutulmaz; ikisi birden anlamlı değildir
        o.setExternalUrl(istek.pageId() == null ? istek.externalUrl() : null);
        o.setNewTab(istek.newTab());
        o.setSortOrder(istek.sortOrder());
        return o;
    }

    /** DB'deki menu_oge_hedef CHECK kısıtıyla (sayfa ya da dış adresten biri) aynı kural. */
    private static String ogeHatasi(OgeIstek istek) {
        if (Girdi.bos(istek.label())) return "Etiket boş olamaz.";
        if (istek.pageId() == null) {
            if (!Girdi.gecerliBaglanti(istek.externalUrl())) return "Bir sayfa seçin ya da geçerli bir dış adres girin.";
        }
        return null;
    }

    @PostMapping("/items")
    @Transactional
    public ResponseEntity<?> ogeEkle(@RequestBody OgeIstek istek) {
        String hata = ogeHatasi(istek);
        if (hata != null) return ResponseEntity.badRequest().body(hata);
        return ResponseEntity.ok(items.save(aktar(istek, new MenuItem())));
    }

    @PutMapping("/items/{id}")
    @Transactional
    public ResponseEntity<?> ogeGuncelle(@PathVariable Long id, @RequestBody OgeIstek istek) {
        String hata = ogeHatasi(istek);
        if (hata != null) return ResponseEntity.badRequest().body(hata);
        return items.findById(id)
                .map(o -> ResponseEntity.ok((Object) items.save(aktar(istek, o))))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/items/{id}")
    @Transactional
    public ResponseEntity<Void> ogeSil(@PathVariable Long id) {
        if (!items.existsById(id)) return ResponseEntity.notFound().build();
        items.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
