package tr.edu.hacettepe.bidb.model;

import java.util.List;
import java.util.Set;

/**
 * Haber sınıflandırması ve görselsiz kapak seçeneklerinin tek doğruluk kaynağı.
 * Veritabanında anahtarlar saklanır; Türkçe/İngilizce etiketler yönetim
 * arayüzüne bu katalogdan sunulur.
 */
public final class NewsCatalog {

    public record Option(String key, String trLabel, String enLabel, String description) {}

    public static final List<Option> CATEGORIES = List.of(
            option("general", "Genel Duyurular", "General Announcements", "Kurumu ilgilendiren genel bilgilendirmeler"),
            option("service-outage", "Hizmet Kesintisi", "Service Interruption", "Erişim sorunları ve kesinti bildirimleri"),
            option("maintenance", "Planlı Bakım", "Scheduled Maintenance", "Bakım pencereleri ve teknik çalışmalar"),
            option("cyber-security", "Siber Güvenlik", "Cyber Security", "Güvenlik uyarıları, zararlı yazılım ve farkındalık"),
            option("network-internet", "Ağ ve İnternet", "Network and Internet", "Kablolu, kablosuz ağ, VPN ve internet hizmetleri"),
            option("email", "E-Posta", "E-mail", "Kurumsal e-posta ve hesap işlemleri"),
            option("software-license", "Yazılım ve Lisans", "Software and Licensing", "Lisanslı yazılımlar ve Microsoft 365 hizmetleri"),
            option("ebys-esignature", "EBYS ve E-İmza", "EDMS and E-Signature", "Belge yönetimi ve elektronik imza hizmetleri"),
            option("web-services", "Web Hizmetleri", "Web Services", "Kurumsal web, içerik yönetimi ve alan adı hizmetleri"),
            option("training-event", "Eğitim ve Etkinlik", "Training and Events", "Eğitim, seminer ve etkinlik duyuruları"),
            option("recruitment", "Personel Alımı", "Recruitment", "Akademik, idari veya sözleşmeli personel ilanları"),
            option("iskur", "İŞKUR Duyuruları", "İŞKUR Announcements", "İŞKUR Gençlik Programı süreçleri"),
            option("procurement", "Satın Alma ve İhale", "Procurement and Tender", "Satın alma, ihale ve tedarik bildirimleri")
    );

    public static final List<Option> AUDIENCES = List.of(
            option("all-users", "Tüm Kullanıcılar", "All Users", "Üniversite topluluğunun tamamı"),
            option("students", "Öğrenciler", "Students", "Ön lisans, lisans ve lisansüstü öğrenciler"),
            option("academic-staff", "Akademik Personel", "Academic Staff", "Öğretim elemanları ve araştırmacılar"),
            option("administrative-staff", "İdari Personel", "Administrative Staff", "İdari birim çalışanları"),
            option("all-staff", "Tüm Personel", "All Staff", "Akademik ve idari personelin tamamı"),
            option("alumni", "Mezunlar", "Alumni", "Hacettepe Üniversitesi mezunları"),
            option("unit-managers", "Birim Yöneticileri", "Unit Managers", "Akademik ve idari birim yöneticileri")
    );

    public static final List<Option> TEMPLATES = List.of(
            option("institutional", "Kurumsal", "Institutional", "Lacivert ve kırmızı, resmî genel duyurular"),
            option("signal", "Hizmet Sinyali", "Service Signal", "Kesinti ve anlık hizmet durumları"),
            option("technology", "Teknoloji", "Technology", "Yazılım, lisans ve dijital hizmetler"),
            option("security", "Güvenlik", "Security", "Siber güvenlik ve kritik uyarılar"),
            option("maintenance", "Teknik Bakım", "Technical Maintenance", "Planlı bakım ve altyapı çalışmaları"),
            option("communication", "İletişim", "Communication", "E-posta, hesap ve kullanıcı iletişimi"),
            option("academic", "Akademik", "Academic", "Öğrenci, eğitim ve akademik etkinlikler"),
            option("people", "İnsan ve Kurum", "People and Institution", "Personel ve kurumsal insan kaynağı"),
            option("career", "Kariyer", "Career", "İŞKUR ve istihdam duyuruları"),
            option("minimal", "Sade Açık", "Minimal Light", "Uzun başlıklar için sakin ve açık zemin")
    );

    private static final Set<String> CATEGORY_KEYS = keys(CATEGORIES);
    private static final Set<String> AUDIENCE_KEYS = keys(AUDIENCES);
    private static final Set<String> TEMPLATE_KEYS = keys(TEMPLATES);

    private NewsCatalog() {}

    /*
     * Üç metot da "tanımlı değilse varsayılana düş" işini yapar. Değerin null
     * olup olmadığı AYRICA sorulmalı: bu kümeler Collectors.toUnmodifiableSet()
     * ile üretiliyor ve değişmez kümeler contains(null) çağrısında false
     * dönmez, NullPointerException FIRLATIR (HashSet'ten farkı budur).
     *
     * Sonuç, varsayılana düşme mekanizmasının tam da ihtiyaç duyulduğu anda
     * çalışmamasıydı: kategorisi belirtilmemiş bir duyuru gönderildiğinde
     * panel, alan uyarısı yerine 500 hatası alıyordu (yeniden üretildi).
     */
    public static String category(String value) {
        return value != null && CATEGORY_KEYS.contains(value) ? value : "general";
    }

    public static String audience(String value) {
        return value != null && AUDIENCE_KEYS.contains(value) ? value : "all-users";
    }

    public static String template(String value) {
        return value != null && TEMPLATE_KEYS.contains(value) ? value : "institutional";
    }

    private static Option option(String key, String tr, String en, String description) {
        return new Option(key, tr, en, description);
    }

    private static Set<String> keys(List<Option> options) {
        return options.stream().map(Option::key).collect(java.util.stream.Collectors.toUnmodifiableSet());
    }
}

