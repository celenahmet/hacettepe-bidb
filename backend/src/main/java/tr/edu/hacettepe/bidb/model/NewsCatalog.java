package tr.edu.hacettepe.bidb.model;

import java.util.List;
import java.util.Set;

/**
 * Haber sınıflandırması ve görselsiz kapak seçeneklerinin tek doğruluk kaynağı.
 * Veritabanında anahtarlar saklanır; Türkçe/İngilizce etiketler yönetim
 * arayüzüne bu katalogdan sunulur.
 */
public final class NewsCatalog {

    public record Option(String key, String trLabel, String enLabel,
                         String description, String enDescription) {}

    public static final List<Option> CATEGORIES = List.of(
            option("general", "Genel Duyurular", "General Announcements", "Kurumu ilgilendiren genel bilgilendirmeler", "General information concerning the university"),
            option("service-outage", "Hizmet Kesintisi", "Service Interruption", "Erişim sorunları ve kesinti bildirimleri", "Access problems and outage notices"),
            option("maintenance", "Planlı Bakım", "Scheduled Maintenance", "Bakım pencereleri ve teknik çalışmalar", "Maintenance windows and technical work"),
            option("cyber-security", "Siber Güvenlik", "Cyber Security", "Güvenlik uyarıları, zararlı yazılım ve farkındalık", "Security alerts, malware and awareness"),
            option("network-internet", "Ağ ve İnternet", "Network and Internet", "Kablolu, kablosuz ağ, VPN ve internet hizmetleri", "Wired and wireless network, VPN and internet services"),
            option("email", "E-Posta", "E-mail", "Kurumsal e-posta ve hesap işlemleri", "Institutional e-mail and account operations"),
            option("software-license", "Yazılım ve Lisans", "Software and Licensing", "Lisanslı yazılımlar ve Microsoft 365 hizmetleri", "Licensed software and Microsoft 365 services"),
            option("ebys-esignature", "EBYS ve E-İmza", "EDMS and E-Signature", "Belge yönetimi ve elektronik imza hizmetleri", "Document management and electronic signature services"),
            option("web-services", "Web Hizmetleri", "Web Services", "Kurumsal web, içerik yönetimi ve alan adı hizmetleri", "Institutional web, content management and domain services"),
            option("training-event", "Eğitim ve Etkinlik", "Training and Events", "Eğitim, seminer ve etkinlik duyuruları", "Training, seminar and event announcements"),
            option("recruitment", "Personel Alımı", "Recruitment", "Akademik, idari veya sözleşmeli personel ilanları", "Academic, administrative or contracted staff vacancies"),
            option("iskur", "İŞKUR Duyuruları", "İŞKUR Announcements", "İŞKUR Gençlik Programı süreçleri", "İŞKUR Youth Programme processes"),
            option("procurement", "Satın Alma ve İhale", "Procurement and Tender", "Satın alma, ihale ve tedarik bildirimleri", "Purchasing, tender and procurement notices")
    );

    public static final List<Option> AUDIENCES = List.of(
            option("all-users", "Tüm Kullanıcılar", "All Users", "Üniversite topluluğunun tamamı", "The entire university community"),
            option("students", "Öğrenciler", "Students", "Ön lisans, lisans ve lisansüstü öğrenciler", "Associate, undergraduate and postgraduate students"),
            option("academic-staff", "Akademik Personel", "Academic Staff", "Öğretim elemanları ve araştırmacılar", "Teaching staff and researchers"),
            option("administrative-staff", "İdari Personel", "Administrative Staff", "İdari birim çalışanları", "Administrative unit personnel"),
            option("all-staff", "Tüm Personel", "All Staff", "Akademik ve idari personelin tamamı", "All academic and administrative staff"),
            option("alumni", "Mezunlar", "Alumni", "Hacettepe Üniversitesi mezunları", "Hacettepe University alumni"),
            option("unit-managers", "Birim Yöneticileri", "Unit Managers", "Akademik ve idari birim yöneticileri", "Academic and administrative unit managers")
    );

    public static final List<Option> TEMPLATES = List.of(
            option("institutional", "Kurumsal", "Institutional", "Lacivert ve kırmızı, resmî genel duyurular", "Navy and red; official general announcements"),
            option("signal", "Hizmet Sinyali", "Service Signal", "Kesinti ve anlık hizmet durumları", "Outages and live service status"),
            option("technology", "Teknoloji", "Technology", "Yazılım, lisans ve dijital hizmetler", "Software, licensing and digital services"),
            option("security", "Güvenlik", "Security", "Siber güvenlik ve kritik uyarılar", "Cyber security and critical alerts"),
            option("maintenance", "Teknik Bakım", "Technical Maintenance", "Planlı bakım ve altyapı çalışmaları", "Planned maintenance and infrastructure work"),
            option("communication", "İletişim", "Communication", "E-posta, hesap ve kullanıcı iletişimi", "E-mail, account and user communication"),
            option("academic", "Akademik", "Academic", "Öğrenci, eğitim ve akademik etkinlikler", "Student, education and academic events"),
            option("people", "İnsan ve Kurum", "People and Institution", "Personel ve kurumsal insan kaynağı", "Staff and institutional human resources"),
            option("career", "Kariyer", "Career", "İŞKUR ve istihdam duyuruları", "İŞKUR and employment announcements"),
            option("minimal", "Sade Açık", "Minimal Light", "Uzun başlıklar için sakin ve açık zemin", "A calm, light background for long headlines")
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

    private static Option option(String key, String tr, String en,
                                 String description, String enDescription) {
        return new Option(key, tr, en, description, enDescription);
    }

    private static Set<String> keys(List<Option> options) {
        return options.stream().map(Option::key).collect(java.util.stream.Collectors.toUnmodifiableSet());
    }
}

