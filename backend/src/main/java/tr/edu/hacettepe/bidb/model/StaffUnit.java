package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Personel sayfasındaki bir birim.
 *
 * Aynı birimin iki yerleşkedeki ekibi ayrı kayıttır: kaynak sayfada da
 * "Kullanıcı Destek Birimi (Beytepe)" ve "(Sıhhiye)" ayrı listelerdi.
 * Yerleşke ve telefon, adın içine gömülü olmak yerine kendi alanlarında
 * durur; ancak böyle sorgulanabilir ve ayrı biçimlendirilebilirler.
 */
@Entity
@Table(name = "staff_unit")
public class StaffUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2)
    private String language = "tr";

    @Column(nullable = false, length = 200)
    private String name;

    /** "Beytepe" veya "Sıhhiye"; birim tek yerleşkedeyse boş. */
    @Column(length = 60)
    private String campus;

    @Column(length = 60)
    private String phone;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @Column(nullable = false)
    private boolean published = true;

    /* Birim silinince kişileri de silinir: kişinin birimsiz bir anlamı yok.
       Veritabanında da ON DELETE CASCADE ile aynı kural yazılıdır. */
    @OneToMany(mappedBy = "unit", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC, id ASC")
    private List<StaffMember> members = new ArrayList<>();

    public Long getId() { return id; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCampus() { return campus; }
    public void setCampus(String campus) { this.campus = campus; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }
    public List<StaffMember> getMembers() { return members; }
    public void setMembers(List<StaffMember> members) { this.members = members; }
}
