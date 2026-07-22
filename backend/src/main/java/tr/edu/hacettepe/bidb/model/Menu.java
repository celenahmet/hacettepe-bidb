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
    private String language;

    /** sol | ust | alt */
    @Column(nullable = false, length = 10)
    private String position = "sol";

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false)
    private int sortOrder = 0;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id")
    @OrderBy("sortOrder ASC")
    private List<MenuItem> items = new ArrayList<>();

    public Long getId() { return id; }
    public String getLanguage() { return language; }
    public String getPosition() { return position; }
    public String getTitle() { return title; }
    public int getSortOrder() { return sortOrder; }
    public List<MenuItem> getItems() { return items; }

    public void setLanguage(String language) { this.language = language; }
    public void setPosition(String position) { this.position = position; }
    public void setTitle(String title) { this.title = title; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
}
