package tr.edu.hacettepe.bidb.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

/**
 * Yayın içeriği herkese açıktır; düzenleme uçları kimlik doğrulaması ister.
 *
 * Yönetici bilgileri ortam değişkeninden okunur. Üretimde mutlaka
 * BIDB_YONETICI_PAROLA tanımlanmalıdır; tanımlanmazsa uygulama başlamaz.
 */
@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain zincir(HttpSecurity http, YoneticiGirisSinirlayici girisSinirlayici) throws Exception {
        http
            // API durum bilgisi tutmaz; oturum yerine temel kimlik doğrulama kullanılır
            .csrf(csrf -> csrf.disable())
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

    @Bean
    UserDetailsService yoneticiler(
            @Value("${bidb.yonetici.kullanici:yonetici}") String kullanici,
            @Value("${bidb.yonetici.parola:}") String parola,
            PasswordEncoder sifreleyici) {

        if (parola == null || parola.isBlank()) {
            throw new IllegalStateException(
                "Yönetici parolası tanımlı değil. BIDB_YONETICI_PAROLA ortam değişkenini ayarlayın.");
        }
        return new InMemoryUserDetailsManager(
            User.withUsername(kullanici).password(sifreleyici.encode(parola)).roles("YONETICI").build());
    }

    @Bean
    PasswordEncoder sifreleyici() {
        return new BCryptPasswordEncoder();
    }
}
