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
@Table(name = "setting")
@IdClass(Setting.Kimlik.class)
public class Setting {

    @Id
    @Column(nullable = false, length = 80)
    private String name;

    @Id
    @Column(nullable = false, length = 2)
    private String language = "tr";

    @Column(nullable = false, columnDefinition = "text")
    private String value = "";

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    /** Bileşik name. */
    public static class Kimlik implements Serializable {
        private String name;
        private String language;

        public Kimlik() {}
        public Kimlik(String name, String language) { this.name = name; this.language = language; }

        @Override public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Kimlik k)) return false;
            return Objects.equals(name, k.name) && Objects.equals(language, k.language);
        }
        @Override public int hashCode() { return Objects.hash(name, language); }
    }
}
