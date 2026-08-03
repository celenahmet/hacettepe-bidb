package tr.edu.hacettepe.bidb;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.PostgreSQLContainer;

/**
 * Testler için tek kullanımlık PostgreSQL.
 *
 * NEDEN GERÇEK VERİTABANI
 *
 * Şema Flyway ile yönetiliyor ve JPA `ddl-auto: validate` ile açılıyor.
 * H2 gibi bir taklit veritabanında geçişlerin bir kısmı çalışmaz; çalışsa
 * bile sınanan şey artık üretimdeki şema olmaz. Testcontainers, üretimle
 * aynı sürümü (postgres:16) ayağa kaldırır ve 75 geçişin tamamını uygular
 * — geçişlerin uygulanabilirliği de böylece sınanmış olur.
 *
 * Kap her test sınıfı için değil, JVM ömrü boyunca BİR KEZ başlatılır
 * (static). Sınıf başına yeniden başlatmak koşuyu dakikalarca uzatırdı.
 *
 * Geliştirme veritabanına (bidb-db) DOKUNULMAZ: ayrı bir kap, ayrı bir
 * port, testler bittiğinde silinir.
 */
@TestConfiguration(proxyBeanMethods = false)
public class VeritabaniTemeli {

    /* Üretimdeki sürümün aynısı. Sürüm farkı, üretimde çalışan bir
       geçişin testte düşmesine (ya da tersine) yol açabilirdi. */
    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16-alpine")
                    .withDatabaseName("bidb")
                    .withUsername("bidb")
                    .withPassword("bidb")
                    .withReuse(false);

    static {
        POSTGRES.start();
    }

    @Bean
    @ServiceConnection
    PostgreSQLContainer<?> postgresKabi() {
        return POSTGRES;
    }
}
