package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

/** Menü bağlantısı. Ya bir sayfaya ya da dış adrese işaret eder. */
@Entity
@Table(name = "menu_item")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_id", nullable = false)
    private Long menuId;

    @Column(nullable = false, length = 200)
    private String label;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id")
    private Page page;

    @Column(name = "external_url", length = 500)
    private String externalUrl;

    @Column(name = "new_tab", nullable = false)
    private boolean newTab = false;

    @Column(nullable = false)
    private int sortOrder = 0;

    public Long getId() { return id; }
    public Long getMenuId() { return menuId; }
    public void setMenuId(Long menuId) { this.menuId = menuId; }

    public String getLabel() { return label; }
    public Page getPage() { return page; }
    public String getExternalUrl() { return externalUrl; }
    public boolean isNewTab() { return newTab; }
    public int getSortOrder() { return sortOrder; }

    public void setLabel(String label) { this.label = label; }
    public void setPage(Page page) { this.page = page; }
    public void setExternalUrl(String externalUrl) { this.externalUrl = externalUrl; }
    public void setNewTab(boolean newTab) { this.newTab = newTab; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
}
