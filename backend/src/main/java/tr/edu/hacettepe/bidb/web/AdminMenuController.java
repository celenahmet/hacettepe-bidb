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

    /** Menü öğelerindeki sayfa bilgisi tembel yüklendiği için işlem içinde çalışır. */
    @GetMapping
    @Transactional
    public List<MenuGorunum> liste() {
        return menuler.findAll().stream()
                .sorted(Comparator.comparing(Menu::getLanguage).thenComparingInt(Menu::getSortOrder))
                .map(m -> new MenuGorunum(
                        m.getId(), m.getLanguage(), m.getPosition(), m.getTitle(), m.getSortOrder(),
                        items.findByMenuIdOrderBySortOrderAsc(m.getId()).stream()
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

    @PostMapping("/items")
    @Transactional
    public MenuItem ogeEkle(@RequestBody OgeIstek istek) {
        return items.save(aktar(istek, new MenuItem()));
    }

    @PutMapping("/items/{id}")
    @Transactional
    public ResponseEntity<MenuItem> ogeGuncelle(@PathVariable Long id, @RequestBody OgeIstek istek) {
        return items.findById(id)
                .map(o -> ResponseEntity.ok(items.save(aktar(istek, o))))
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
