package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

/**
 * Sayfanın adresi değiştiğinde eski adres burada tutulur ve kalıcı
 * yönlendirmeyle yenisine taşınır. Böylece dış bağlantılar ve arama
 * sonuçları kırılmaz.
 */
@Entity
@Table(name = "yonlendirme")
public class Yonlendirme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "eski_yol", nullable = false, unique = true, length = 300)
    private String eskiYol;

    @Column(name = "yeni_yol", nullable = false, length = 300)
    private String yeniYol;

    public Long getId() { return id; }
    public String getEskiYol() { return eskiYol; }
    public void setEskiYol(String eskiYol) { this.eskiYol = eskiYol; }
    public String getYeniYol() { return yeniYol; }
    public void setYeniYol(String yeniYol) { this.yeniYol = yeniYol; }
}
