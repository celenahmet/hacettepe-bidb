package tr.edu.hacettepe.bidb.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Geliştirme sırasında Angular ayrı porttan çalıştığı için gereklidir. */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${bidb.cors.izinli-adresler}")
    private String[] izinliAdresler;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(izinliAdresler)
                .allowedMethods("GET")
                .maxAge(3600);
    }
}
