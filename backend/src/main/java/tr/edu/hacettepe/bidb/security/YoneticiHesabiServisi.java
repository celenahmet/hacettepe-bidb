package tr.edu.hacettepe.bidb.security;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tr.edu.hacettepe.bidb.model.AdminAccount;
import tr.edu.hacettepe.bidb.repo.AdminAccountRepo;

import java.time.OffsetDateTime;

/**
 * Yönetici hesabı: kimlik doğrulama kaynağı ve tohumlama.
 *
 * Hesap veritabanında durur. Ortam değişkeni (BIDB_YONETICI_KULLANICI /
 * BIDB_YONETICI_PAROLA) yalnızca TOHUMDUR: tablo boşsa açılışta ondan bir
 * hesap oluşturulur. Hesap bir kez oluştuktan sonra ortam değişkenindeki
 * parola ARTIK GEÇERLİ DEĞİLDİR — aksi hâlde parola sıfırlamanın anlamı
 * kalmazdı, eski parola çalışmaya devam ederdi.
 *
 * Acil durum: parola unutulur ve e-posta da yapılandırılmamışsa,
 * veritabanına erişimi olan bir işletmen "DELETE FROM admin_account;"
 * çalıştırıp servisi yeniden başlatarak hesabı ortam değişkenindeki
 * değerlerle yeniden oluşturabilir. Bu kapı bilinçli bırakılmıştır;
 * veritabanı erişimi zaten en yüksek yetki seviyesidir.
 */
@Service
public class YoneticiHesabiServisi implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(YoneticiHesabiServisi.class);

    private final AdminAccountRepo depo;
    private final PasswordEncoder sifreleyici;
    private final String tohumKullanici;
    private final String tohumParola;

    public YoneticiHesabiServisi(AdminAccountRepo depo, PasswordEncoder sifreleyici,
                                 @Value("${bidb.yonetici.kullanici:yonetici}") String tohumKullanici,
                                 @Value("${bidb.yonetici.parola:}") String tohumParola) {
        this.depo = depo;
        this.sifreleyici = sifreleyici;
        this.tohumKullanici = tohumKullanici;
        this.tohumParola = tohumParola;
    }

    /**
     * Tohumlama, bean kurulumu sırasında çalışır.
     *
     * Zamanlama önemli ve iki ucu var:
     *
     *   - Flyway'den SONRA olmalı, yoksa tablo henüz yokken sorgu patlar.
     *     Bu garanti dolaylı ama sağlam: bu servis AdminAccountRepo'ya,
     *     o EntityManagerFactory'ye, o da Spring Boot'un
     *     FlywayJpaDependencyConfiguration'ı sayesinde flywayInitializer'a
     *     bağlı. Yani buraya gelindiğinde göçler uygulanmıştır.
     *
     *   - Web sunucusu istek almaya başlamadan ÖNCE olmalı.
     *     ApplicationReadyEvent bu şartı sağlamıyor: o olay sunucu
     *     dinlemeye başladıktan sonra tetikleniyor ve arada gelen bir giriş
     *     isteği, tablo henüz boş olduğu için başarısız olurdu.
     *
     * @Transactional BİLEREK yok: @PostConstruct bean henüz vekillenmeden
     * çalıştığı için o açıklama zaten etkisiz olurdu. Tek save() çağrısı
     * kendi işlemini açar, yeterli.
     */
    @PostConstruct
    public void tohumla() {
        if (depo.count() > 0) return;

        if (tohumParola == null || tohumParola.isBlank()) {
            throw new IllegalStateException(
                "Yönetici hesabı yok ve tohum parolası tanımlı değil. "
                + "BIDB_YONETICI_PAROLA ortam değişkenini ayarlayıp servisi yeniden başlatın.");
        }

        AdminAccount h = new AdminAccount();
        h.setUsername(tohumKullanici);
        h.setPasswordHash(sifreleyici.encode(tohumParola));
        depo.save(h);
        log.info("Yönetici hesabı ortam değişkenlerinden oluşturuldu: {}", tohumKullanici);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String kullanici) throws UsernameNotFoundException {
        AdminAccount h = depo.findByUsername(kullanici)
                .orElseThrow(() -> new UsernameNotFoundException("Hesap yok"));
        return User.withUsername(h.getUsername())
                .password(h.getPasswordHash())
                .roles("YONETICI")
                .build();
    }

    @Transactional(readOnly = true)
    public AdminAccount hesap() {
        return depo.findFirstByOrderByIdAsc().orElse(null);
    }

    /** Parolayı değiştirir. Çağıran taraf yetkiyi kendisi doğrulamalıdır. */
    @Transactional
    public void parolaBelirle(AdminAccount h, String yeniParola) {
        h.setPasswordHash(sifreleyici.encode(yeniParola));
        h.setPasswordUpdatedAt(OffsetDateTime.now());
        h.setUpdatedAt(OffsetDateTime.now());
        depo.save(h);
    }

    @Transactional
    public void epostaBelirle(AdminAccount h, String eposta) {
        h.setEmail(eposta);
        h.setUpdatedAt(OffsetDateTime.now());
        depo.save(h);
    }
}
