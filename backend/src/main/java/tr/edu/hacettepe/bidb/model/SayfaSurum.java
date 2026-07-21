package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

/**
 * Bir sayfanın geçmiş hâli.
 *
 * Sayfa her kaydedildiğinde, kaydetmeden ÖNCEKİ hâli buraya yazılır.
 * Böylece yanlış bir düzenleme geri alınabilir ve kaynak aktarımından
 * gelen ilk hâl kalıcı olarak korunur.
 */
@Entity
@Table(name = "sayfa_surum")
public class SayfaSurum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sayfa_id", nullable = false)
    private Long sayfaId;

    @Column(length = 300)
    private String baslik;

    @Column(name = "icerik_html", nullable = false, columnDefinition = "text")
    private String icerikHtml;

    @Column(length = 200)
    private String aciklama;

    @Column(length = 100)
    private String kaydeden;

    @Column(name = "kayit_zamani", insertable = false, updatable = false)
    private OffsetDateTime kayitZamani;

    public Long getId() { return id; }
    public Long getSayfaId() { return sayfaId; }
    public void setSayfaId(Long sayfaId) { this.sayfaId = sayfaId; }
    public String getBaslik() { return baslik; }
    public void setBaslik(String baslik) { this.baslik = baslik; }
    public String getIcerikHtml() { return icerikHtml; }
    public void setIcerikHtml(String icerikHtml) { this.icerikHtml = icerikHtml; }
    public String getAciklama() { return aciklama; }
    public void setAciklama(String aciklama) { this.aciklama = aciklama; }
    public String getKaydeden() { return kaydeden; }
    public void setKaydeden(String kaydeden) { this.kaydeden = kaydeden; }
    public OffsetDateTime getKayitZamani() { return kayitZamani; }
}
