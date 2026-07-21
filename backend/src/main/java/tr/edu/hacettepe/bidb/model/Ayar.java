package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * Site geneli ayarlar: alt bilgideki adres, telefon, e-posta gibi bilgiler.
 *
 * Tablonun birincil anahtarı (anahtar, dil) çiftidir: aynı bilgi her dil
 * için ayrı tutulabilir.
 */
@Entity
@Table(name = "ayar")
@IdClass(Ayar.Kimlik.class)
public class Ayar {

    @Id
    @Column(nullable = false, length = 80)
    private String anahtar;

    @Id
    @Column(nullable = false, length = 2)
    private String dil = "tr";

    @Column(nullable = false, columnDefinition = "text")
    private String deger = "";

    public String getAnahtar() { return anahtar; }
    public void setAnahtar(String anahtar) { this.anahtar = anahtar; }
    public String getDil() { return dil; }
    public void setDil(String dil) { this.dil = dil; }
    public String getDeger() { return deger; }
    public void setDeger(String deger) { this.deger = deger; }

    /** Bileşik anahtar. */
    public static class Kimlik implements Serializable {
        private String anahtar;
        private String dil;

        public Kimlik() {}
        public Kimlik(String anahtar, String dil) { this.anahtar = anahtar; this.dil = dil; }

        @Override public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Kimlik k)) return false;
            return Objects.equals(anahtar, k.anahtar) && Objects.equals(dil, k.dil);
        }
        @Override public int hashCode() { return Objects.hash(anahtar, dil); }
    }
}
