package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

/**
 * Alt bilgide görünen tek bir iletişim bilgisi: bir adres, bir telefon,
 * bir e-posta veya faks.
 *
 * Her değer kendi satırındadır. Önceden hepsi tek metinde " · " ile
 * ayrılıyordu; o yapıda tek bir numarayı değiştirmek metni ayrıştırmayı
 * gerektiriyor ve numaraların ayrı etiketi olamıyordu.
 */
@Entity
@Table(name = "contact_channel")
public class ContactChannel {

    /** Kanal türleri; veritabanında CHECK kısıtıyla da sınırlıdır. */
    public static final String ADRES = "address";
    public static final String TELEFON = "phone";
    public static final String EPOSTA = "email";
    public static final String FAKS = "fax";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2)
    private String language = "tr";

    @Column(nullable = false, length = 20)
    private String type;

    /** "Bize Ulaşın", "Daire Başkanlığı" gibi; boş bırakılabilir. */
    @Column(length = 150)
    private String label;

    @Column(nullable = false, length = 500)
    private String value;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @Column(nullable = false)
    private boolean published = true;

    public Long getId() { return id; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }
}
