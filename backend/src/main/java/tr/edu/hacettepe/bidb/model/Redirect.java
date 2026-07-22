package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

/**
 * Sayfanın adresi değiştiğinde eski adres burada tutulur ve kalıcı
 * yönlendirmeyle yenisine taşınır. Böylece dış bağlantılar ve arama
 * sonuçları kırılmaz.
 */
@Entity
@Table(name = "redirect")
public class Redirect {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "old_path", nullable = false, unique = true, length = 300)
    private String oldPath;

    @Column(name = "new_path", nullable = false, length = 300)
    private String newPath;

    public Long getId() { return id; }
    public String getOldPath() { return oldPath; }
    public void setOldPath(String oldPath) { this.oldPath = oldPath; }
    public String getNewPath() { return newPath; }
    public void setNewPath(String newPath) { this.newPath = newPath; }
}
