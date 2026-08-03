package tr.edu.hacettepe.bidb.web;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Core Web Vitals eşik ve derecelendirme sınırları.
 *
 * NEDEN BU TEST VAR
 *
 * Eşikler bir süre iki denetleyicide ayrı ayrı yazılıydı ve fark edilmeden
 * ayrışmışlardı. Tek kaynağa indirildiler; bu test o birleştirmeyi yerinde
 * tutar. Buradaki bir bozulma sessizdir: uygulama açılır, uç nokta 200
 * döner, panel çalışır — yalnızca her ölçümün derecesi yanlış olur.
 *
 * Sınır değerleri ayrıca panelde EKRANA yazılıyor ("Optimum beklenti").
 * Yanlış bir sınır artık yalnızca yanlış renk değil, kullanıcıya verilen
 * yanlış bilgi demek.
 */
class WebVitalEsikTest {

    /* Google'ın yayımladığı eşikler (web.dev/vitals). Testin bağımsız
       bir kaynağı olması için burada AYRICA yazılırlar; üretim kodundan
       okunsalardı test yalnızca "kod kendisiyle tutarlı" derdi. */
    private static final String[][] BEKLENEN = {
        // metrik, iyi sınırı, zayıf sınırı
        { "LCP",  "2500", "4000" },
        { "INP",  "200",  "500"  },
        { "CLS",  "0.10", "0.25" },
        { "FCP",  "1800", "3000" },
        { "TTFB", "800",  "1800" },
    };

    @Test
    @DisplayName("Beş metriğin eşikleri yayımlanan değerlerle aynı")
    void esiklerYayimlananDegerlerleAyni() {
        for (String[] satir : BEKLENEN) {
            String metrik = satir[0];
            assertEquals(Double.parseDouble(satir[1]), WebVitalController.good(metrik), 1e-9,
                    metrik + " için 'iyi' sınırı değişmiş");
            assertEquals(Double.parseDouble(satir[2]), WebVitalController.poor(metrik), 1e-9,
                    metrik + " için 'zayıf' sınırı değişmiş");
        }
    }

    @ParameterizedTest(name = "{0}: sınırların tam üstünde ve altında derece")
    @ValueSource(strings = { "LCP", "INP", "CLS", "FCP", "TTFB" })
    @DisplayName("Derece, sınırın hangi tarafında olduğuna göre değişir")
    void sinirlardaDerece(String metrik) {
        double iyi = WebVitalController.good(metrik);
        double zayif = WebVitalController.poor(metrik);

        // Sınırın KENDİSİ iyi sayılır (<=), bir tık üstü sayılmaz.
        assertEquals("good", WebVitalController.rating(metrik, iyi),
                metrik + ": iyi sınırının tam kendisi 'good' olmalı");
        assertEquals("good", WebVitalController.rating(metrik, iyi / 2),
                metrik + ": sınırın yarısı 'good' olmalı");
        assertEquals("needs-improvement", WebVitalController.rating(metrik, iyi * 1.0001),
                metrik + ": iyi sınırının hemen üstü artık 'good' olmamalı");

        assertEquals("needs-improvement", WebVitalController.rating(metrik, zayif),
                metrik + ": zayıf sınırının tam kendisi henüz 'poor' değildir");
        assertEquals("poor", WebVitalController.rating(metrik, zayif * 1.0001),
                metrik + ": zayıf sınırının üstü 'poor' olmalı");
        assertEquals("poor", WebVitalController.rating(metrik, zayif * 10),
                metrik + ": sınırın çok üstü 'poor' olmalı");
    }

    @ParameterizedTest
    @ValueSource(strings = { "LCP", "INP", "CLS", "FCP", "TTFB" })
    @DisplayName("İyi sınırı zayıf sınırından küçüktür")
    void iyiSiniriZayiftanKucuk(String metrik) {
        assertTrue(WebVitalController.good(metrik) < WebVitalController.poor(metrik),
                metrik + ": iyi sınırı zayıf sınırından büyük ya da eşit — aralık ters");
    }

    @Test
    @DisplayName("CLS birimsizdir; süre metrikleriyle karışmaz")
    void clsBirimsiz() {
        // CLS 0-1 aralığında bir orandır. Yanlışlıkla milisaniye eşiği
        // verilseydi (ör. 2500) her ölçüm 'good' görünürdü.
        assertTrue(WebVitalController.poor("CLS") < 1.0,
                "CLS zayıf sınırı 1'den küçük olmalı");
        assertEquals("poor", WebVitalController.rating("CLS", 0.5),
                "0,5 CLS zayıf sayılmalı");
    }

    @Test
    @DisplayName("Puan, iyi sınırında 100 ve zayıf sınırında 0")
    void puanSinirlari() {
        for (String[] satir : BEKLENEN) {
            String metrik = satir[0];
            double iyi = WebVitalController.good(metrik);
            double zayif = WebVitalController.poor(metrik);

            assertEquals(100, AdminQualityController.performanceScore(metrik, iyi),
                    metrik + ": iyi sınırında puan 100 olmalı");
            assertEquals(0, AdminQualityController.performanceScore(metrik, zayif),
                    metrik + ": zayıf sınırında puan 0 olmalı");

            // Arada kalan değer 0 ile 100 arasında ve tek yönlü azalır
            double orta = (iyi + zayif) / 2;
            int ortaPuan = AdminQualityController.performanceScore(metrik, orta);
            assertTrue(ortaPuan > 0 && ortaPuan < 100,
                    metrik + ": ara değerin puanı 0-100 arasında olmalı, bulunan: " + ortaPuan);

            double dahaKotu = orta + (zayif - orta) / 2;
            assertTrue(AdminQualityController.performanceScore(metrik, dahaKotu) < ortaPuan,
                    metrik + ": değer kötüleşirken puan düşmeli");
        }
    }

    @Test
    @DisplayName("Puanlama ile derecelendirme aynı eşikleri kullanır")
    void puanVeDereceAyniEsikte() {
        /* İkisi ayrı yerde yazılıyken bu tutarlılık yoktu ve panelde
           "İyi" rozetiyle düşük puanın yan yana görünmesi mümkündü. */
        for (String[] satir : BEKLENEN) {
            String metrik = satir[0];
            double iyi = WebVitalController.good(metrik);
            assertEquals("good", WebVitalController.rating(metrik, iyi));
            assertEquals(100, AdminQualityController.performanceScore(metrik, iyi),
                    metrik + ": derece 'good' derken puan 100 değil");
        }
    }
}
