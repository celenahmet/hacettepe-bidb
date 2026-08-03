package tr.edu.hacettepe.bidb.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Parola sıfırlama akışındaki parola kuralları.
 *
 * NEDEN BU TEST VAR
 *
 * Bu kural, panele parola belirleyen tek kapıdır. Gevşemesi hiçbir yerde
 * hata üretmez: akış çalışmaya devam eder, kullanıcı parolasını belirler,
 * yalnızca zayıf bir parola kabul edilmiş olur. Sessiz gevşemeyi ancak
 * bir test yakalar.
 *
 * Servis burada bağımlılıkları null verilerek kurulur; parolaSorunu()
 * ne depoya ne e-postaya dokunur. Bir gün dokunmaya başlarsa bu test
 * NullPointerException ile düşer — bu da istenen uyarıdır: parola
 * denetiminin yan etkisi olmamalıdır.
 */
class ParolaKuraliTest {

    private final ParolaSifirlamaServisi servis =
            new ParolaSifirlamaServisi(null, null, null, "http://localhost:4000");

    @Test
    @DisplayName("Kurallara uyan parola kabul edilir")
    void gecerliParolaKabul() {
        assertNull(servis.parolaSorunu("Hacettepe.2026!bidb", "admin"),
                "Kurallara uyan parola reddedilmemeli");
    }

    @Test
    @DisplayName("Asgari uzunluk on iki karakterdir")
    void kisaParolaRet() {
        assertEquals(12, ParolaSifirlamaServisi.ASGARI_PAROLA,
                "Asgari uzunluk düşürülmüş");

        // Tam sınırda kabul, bir eksiğinde ret
        String onIki = "abcdefgh1234";
        assertEquals(12, onIki.length());
        assertNull(servis.parolaSorunu(onIki, "admin"),
                "Tam on iki karakter kabul edilmeli");

        String onBir = "abcdefgh123";
        assertEquals(11, onBir.length());
        assertNotNull(servis.parolaSorunu(onBir, "admin"),
                "On bir karakter reddedilmeli");
    }

    @Test
    @DisplayName("Boş parola reddedilir")
    void bosParolaRet() {
        assertNotNull(servis.parolaSorunu(null, "admin"), "null parola reddedilmeli");
        assertNotNull(servis.parolaSorunu("", "admin"), "boş parola reddedilmeli");
        assertNotNull(servis.parolaSorunu("   ", "admin"), "boşluklardan ibaret parola reddedilmeli");
    }

    @Test
    @DisplayName("Parola kullanıcı adıyla aynı olamaz — büyük/küçük harf farkı yeterli değil")
    void kullaniciAdiylaAyniRet() {
        assertNotNull(servis.parolaSorunu("yoneticihesabi", "yoneticihesabi"),
                "Kullanıcı adının aynısı reddedilmeli");
        assertNotNull(servis.parolaSorunu("YoneticiHesabi", "yoneticihesabi"),
                "Yalnızca harf büyüklüğü değiştirilerek kural aşılamamalı");
        assertNotNull(servis.parolaSorunu("yoneticihesabi", "YONETICIHESABI"),
                "Karşılaştırma iki yönde de harf büyüklüğünden bağımsız olmalı");
    }

    @ParameterizedTest
    @ValueSource(strings = { "aaaaaaaaaaaa", "ababababababab", "abcabcabcabc", "111111111111" })
    @DisplayName("Dörtten az farklı karakter içeren parola reddedilir")
    void azCesitliParolaRet(String parola) {
        assertTrue(parola.length() >= ParolaSifirlamaServisi.ASGARI_PAROLA,
                "Sınama parolası uzunluk kuralına takılmamalı, çeşitlilik kuralına takılmalı");
        assertNotNull(servis.parolaSorunu(parola, "admin"),
                "Yalnızca " + parola.chars().distinct().count()
                        + " farklı karakter içeren parola kabul edildi: " + parola);
    }

    @Test
    @DisplayName("Tam dört farklı karakter yeterlidir")
    void dortFarkliKarakterYeterli() {
        String parola = "abcdabcdabcd";
        assertEquals(4, parola.chars().distinct().count());
        assertNull(servis.parolaSorunu(parola, "admin"),
                "Dört farklı karakter sınırın kendisidir, kabul edilmeli");
    }

    @Test
    @DisplayName("Aşırı uzun parola reddedilir")
    void asiriUzunParolaRet() {
        assertNull(servis.parolaSorunu("A".repeat(197) + "bcd", "admin"),
                "İki yüz karakter üst sınırın kendisidir, kabul edilmeli");
        assertNotNull(servis.parolaSorunu("A".repeat(198) + "bcd", "admin"),
                "İki yüz karakteri aşan parola reddedilmeli");
    }

    @Test
    @DisplayName("Ret gerekçeleri kullanıcıya gösterilebilir bir cümledir")
    void gerekceOkunabilir() {
        /* Bu metinler doğrudan ekrana basılıyor. Boş ya da teknik bir
           anahtar dönerse kullanıcı ne yapacağını anlamaz. */
        String[] kotuParolalar = { "kisa", "aaaaaaaaaaaa", "admin" };
        for (String p : kotuParolalar) {
            String gerekce = servis.parolaSorunu(p, "admin");
            assertNotNull(gerekce, p + " reddedilmeliydi");
            assertTrue(gerekce.length() > 15, "Gerekçe fazla kısa: " + gerekce);
            assertTrue(gerekce.endsWith("."), "Gerekçe cümle biçiminde olmalı: " + gerekce);
        }
    }
}
