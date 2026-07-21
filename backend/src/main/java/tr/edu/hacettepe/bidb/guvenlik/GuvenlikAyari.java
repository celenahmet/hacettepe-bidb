package tr.edu.hacettepe.bidb.guvenlik;

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

/**
 * Yayın içeriği herkese açıktır; düzenleme uçları kimlik doğrulaması ister.
 *
 * Yönetici bilgileri ortam değişkeninden okunur. Üretimde mutlaka
 * BIDB_YONETICI_PAROLA tanımlanmalıdır; tanımlanmazsa uygulama başlamaz.
 */
@Configuration
public class GuvenlikAyari {

    @Bean
    SecurityFilterChain zincir(HttpSecurity http) throws Exception {
        http
            // API durum bilgisi tutmaz; oturum yerine temel kimlik doğrulama kullanılır
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(izin -> izin
                .requestMatchers("/actuator/health").permitAll()
                // Yayın uçları: yalnızca okuma, herkese açık
                .requestMatchers(HttpMethod.GET, "/api/tr/**", "/api/en/**").permitAll()
                // Yönetim uçları
                .requestMatchers("/api/yonetim/**").authenticated()
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
