package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;

/**
 * Bir birimde görevli kişi.
 *
 * Kaynak sayfada birim sorumluları adın sonundaki yıldızla belirtiliyordu
 * ("* Birim Sorumluları"). Yıldız bir işaret değil bir bilgidir; kendi
 * alanına alındı ki sayfada ayrıca etiketlenebilsin.
 */
@Entity
@Table(name = "staff_member")
public class StaffMember {

    /** Fotoğraf yüklenmediğinde gösterilecek varsayılan ikon tercihleri. */
    public static final String KADIN = "kadin";
    public static final String ERKEK = "erkek";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "unit_id", nullable = false)
    private StaffUnit unit;

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    /** Yönetim panelinden düzenlenen görev veya kurumsal unvan. */
    @Column(name = "role_title", length = 200)
    private String roleTitle;

    /** Kaynak metinde adın yanındaki açıklama: "(e-imza)". */
    @Column(length = 200)
    private String note;

    /** Profil detayında gösterilen, yönetim panelinden girilebilen isteğe bağlı tanıtım metni. */
    @Column(name = "about_text", columnDefinition = "TEXT")
    private String aboutText;

    @Column(name = "is_lead", nullable = false)
    private boolean lead = false;

    @Column(name = "photo_url", length = 300)
    private String photoUrl;

    /** Yayın sayfasında kullanıcı isteğiyle gösterilen kurumsal e-posta. */
    @Column(length = 254)
    private String email;

    /**
     * Fotoğraf yoksa hangi varsayılan ikonun gösterileceği: "kadin",
     * "erkek" veya boş (nötr). Kişisel bir veri alanı değil, yalnızca bir
     * görsel tercihtir; boş bırakılabilir.
     */
    @Column(length = 10)
    private String avatar;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    public Long getId() { return id; }
    public StaffUnit getUnit() { return unit; }
    public void setUnit(StaffUnit unit) { this.unit = unit; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public String getAboutText() { return aboutText; }
    public void setAboutText(String aboutText) { this.aboutText = aboutText; }
    public boolean isLead() { return lead; }
    public void setLead(boolean lead) { this.lead = lead; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
}
