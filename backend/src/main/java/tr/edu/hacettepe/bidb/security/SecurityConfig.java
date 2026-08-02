package tr.edu.hacettepe.bidb.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

/**
 * Yayın içeriği herkese açıktır; düzenleme uçları kimlik doğrulaması ister.
 *
 * Yönetici hesabı VERİTABANINDA tutulur (bkz. YoneticiHesabiServisi).
 * BIDB_YONETICI_KULLANICI / BIDB_YONETICI_PAROLA yalnızca ilk kurulumda
 * kullanılan tohumdur: hesap tablosu boşsa açılışta ondan bir hesap
 * oluşturulur. İlk açılışta parola tanımlı değilse uygulama başlamaz.
 */
@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain zincir(HttpSecurity http, YoneticiGirisSinirlayici girisSinirlayici) throws Exception {
        http
            // API durum bilgisi tutmaz; oturum yerine temel kimlik doğrulama kullanılır
            .csrf(csrf -> csrf.disable())
            .sessionManagement(oturum -> oturum.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(girisSinirlayici, BasicAuthenticationFilter.class)
            .authorizeHttpRequests(izin -> izin
                .requestMatchers("/actuator/health", "/error").permitAll()
                // Yayın uçları: yalnızca okuma, herkese açık
                .requestMatchers(HttpMethod.GET, "/api/tr/**", "/api/en/**").permitAll()
                // Dış bağlantılı duyurularda görüntülenme sayacı
                .requestMatchers(HttpMethod.POST,
                        "/api/tr/news/*/view", "/api/en/news/*/view").permitAll()
                // Kimliksiz, çerezsiz Core Web Vitals örnekleri
                .requestMatchers(HttpMethod.POST,
                        "/api/metrics/vitals", "/api/metrics/page-view").permitAll()
                // İletişim formu kimliksiz kabul edilir; hız ve alan sınırları controller'da uygulanır.
                .requestMatchers(HttpMethod.POST, "/api/contact/tickets").permitAll()
                // Yönetim uçları
                .requestMatchers("/api/admin/**").authenticated()
                .anyRequest().denyAll())
            .httpBasic(temel -> {});
        return http.build();
    }

    /* Kimlik artık VERİTABANINDAN okunur: YoneticiHesabiServisi, @Service
       olduğu için zaten tek başına UserDetailsService bean'idir.

       Burada ayrıca bir @Bean TANIMLANMAZ. Tanımlanmıştı ve giriş tamamen
       kırıldı: aynı örnek iki ayrı bean adıyla (yoneticiHesabiServisi,
       yoneticiler) kayıtlı olunca Spring Security "Found 2 UserDetailsService
       beans ... will not use a UserDetailsService for username/password login"
       deyip parola doğrulamasını devre dışı bıraktı; doğru parolayla bile
       401 dönüyordu. Uyarı yalnızca günlüğe düşüyor, açılış başarılı
       görünüyor - bu yüzden ancak gerçek bir giriş denemesiyle fark edilir. */

    @Bean
    PasswordEncoder sifreleyici() {
        return new BCryptPasswordEncoder();
    }
}
