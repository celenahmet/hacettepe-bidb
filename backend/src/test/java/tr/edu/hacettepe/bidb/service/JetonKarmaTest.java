package tr.edu.hacettepe.bidb.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Parola sıfırlama jetonunun üretimi ve saklanma biçimi.
 *
 * NEDEN BU TEST VAR
 *
 * Jetonun kendisi veritabanına YAZILMAZ; yalnızca SHA-256 karması yazılır.
 * Sebebi şu: veritabanı yedeği ya da bir okuma açığı sızarsa, elindeki
 * kayıtla kimse parola sıfırlayamasın. Bu koruma bozulursa hiçbir şey
 * görünürde değişmez — akış çalışmaya devam eder, sıfırlama başarılı
 * olur, yalnızca jeton artık düz metin durur.
 *
 * jetonUret ve karma özel (private) metotlardır ve öyle kalmalıdırlar;
 * güvenlik açısından anlamlı olan tek sebeple, sınama için yansımayla
 * çağrılırlar. Metot adı değişirse test düşer — istenen budur.
 */
class JetonKarmaTest {

    private static Method gizliMetot(String ad, Class<?>... imzalar) throws Exception {
        Method m = ParolaSifirlamaServisi.class.getDeclaredMethod(ad, imzalar);
        m.setAccessible(true);
        return m;
    }

    private static String jetonUret() throws Exception {
        return (String) gizliMetot("jetonUret").invoke(null);
    }

    private static String karma(String jeton) throws Exception {
        return (String) gizliMetot("karma", String.class).invoke(null, jeton);
    }

    @Test
    @DisplayName("Karma, jetonun kendisini içermez")
    void karmaJetonuIcermez() throws Exception {
        String jeton = jetonUret();
        String karma = karma(jeton);

        assertNotEquals(jeton, karma, "Karma ile jeton aynı — jeton düz metin saklanıyor");
        assertFalse(karma.contains(jeton), "Karma jetonu barındırıyor");
        assertFalse(jeton.contains(karma), "Jeton karmayı barındırıyor");
    }

    @Test
    @DisplayName("Karma, veritabanı sütununa sığan 64 haneli onaltılıktır")
    void karmaBicimi() throws Exception {
        String karma = karma(jetonUret());

        // Sütun VARCHAR(64) tanımlı (V72). Daha uzun bir karmaya geçilirse
        // kayıt sessizce kesilmez, açıkça burada düşer.
        assertEquals(64, karma.length(), "SHA-256 onaltılık gösterimi 64 hane olmalı");
        assertTrue(karma.matches("[0-9a-f]{64}"),
                "Karma yalnızca küçük harf onaltılık olmalı, bulunan: " + karma);
    }

    @Test
    @DisplayName("Aynı jeton her zaman aynı karmayı verir")
    void karmaKararli() throws Exception {
        String jeton = jetonUret();
        assertEquals(karma(jeton), karma(jeton),
                "Karma kararsız — kayıtlı jeton bir daha bulunamaz, akış tamamen kırılır");
    }

    @Test
    @DisplayName("Farklı jetonlar farklı karma verir")
    void farkliJetonFarkliKarma() throws Exception {
        assertNotEquals(karma("aaaaaaaaaaaa"), karma("aaaaaaaaaaab"),
                "Tek harf farkı karmaya yansımıyor");
    }

    @Test
    @DisplayName("Jeton tahmin edilemeyecek uzunlukta ve her seferinde farklı")
    void jetonBenzersiz() throws Exception {
        Set<String> uretilen = new HashSet<>();
        for (int i = 0; i < 500; i++) {
            String jeton = jetonUret();

            // 32 bayt, dolgusuz Base64 → 43 karakter. Kısalırsa jeton
            // kaba kuvvetle denenebilir hâle gelir.
            assertEquals(43, jeton.length(),
                    "Jeton uzunluğu değişmiş (32 bayt beklenir): " + jeton);
            assertTrue(uretilen.add(jeton), "Aynı jeton iki kez üretildi: " + jeton);
        }
        assertEquals(500, uretilen.size());
    }

    @Test
    @DisplayName("Jeton adres satırında bozulmayan karakterlerden oluşur")
    void jetonAdresGuvenli() throws Exception {
        /* Sıfırlama bağlantısı e-postayla gidiyor. Jetonda '+' ya da '/'
           bulunsaydı adres çözümlenirken bozulur, kullanıcı geçerli bir
           jetonu "geçersiz" olarak görürdü. */
        for (int i = 0; i < 200; i++) {
            String jeton = jetonUret();
            assertTrue(jeton.matches("[A-Za-z0-9_-]+"),
                    "Jetonda adres için güvenli olmayan karakter var: " + jeton);
        }
    }
}
