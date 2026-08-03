package tr.edu.hacettepe.bidb.service;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import tr.edu.hacettepe.bidb.VeritabaniTemeli;
import tr.edu.hacettepe.bidb.model.AdminAccount;
import tr.edu.hacettepe.bidb.model.AdminPasswordReset;
import tr.edu.hacettepe.bidb.repo.AdminAccountRepo;
import tr.edu.hacettepe.bidb.repo.AdminPasswordResetRepo;

import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Parola sıfırlama akışının uçtan uca davranışı.
 *
 * NEDEN BU TEST VAR
 *
 * Bu akış, paneli ele geçirmenin en kısa yoludur. Kusurlarının hepsi
 * sessizdir: akış çalışmaya devam eder, kullanıcı parolasını belirler —
 * yalnızca güvence ortadan kalkar. Sınananlar:
 *
 *   · Jeton TEK KULLANIMLIK mı (kullanılmış bağlantı ikinci kez işlemez)
 *   · Süresi dolmuş jeton reddediliyor mu
 *   · Bir jeton kullanılınca hesabın DİĞER bekleyen jetonları kapanıyor mu
 *   · Yanıt, adresin kayıtlı olup olmadığını ele veriyor mu
 *   · Parola gerçekten değişiyor ve karmalanarak saklanıyor mu
 *
 * Jeton e-postayla gider ve düz metni HİÇBİR YERE yazılmaz (ileti gövdesi
 * bilerek günlüklenmiyor). Bu yüzden test, jetonu üretimdeki aynı gizli
 * yordamlarla kendisi üretir ve karmasını kayda yazar; sonra düz metinle
 * uçlara gider. Böylece sınanan şey gerçek doğrulama yolu olur.
 */
@SpringBootTest
@ActiveProfiles("test")
@Import(VeritabaniTemeli.class)
class ParolaSifirlamaAkisiTest {

    @Autowired private WebApplicationContext baglam;
    @Autowired private ParolaSifirlamaServisi servis;
    @Autowired private AdminPasswordResetRepo jetonlar;
    @Autowired private AdminAccountRepo hesaplar;
    @Autowired private PasswordEncoder sifreleyici;

    private MockMvc mvc;

    private static final AtomicInteger SAYAC = new AtomicInteger(0);

    /** Tohum parolası; bkz. src/test/resources/application-test.yml */
    private static final String TOHUM_PAROLA = "test-parolasi-1234";

    @BeforeEach
    void hazirla() {
        mvc = MockMvcBuilders.webAppContextSetup(baglam).apply(springSecurity()).build();
        jetonlar.deleteAll();
    }

    /**
     * Bu sınıf yönetici parolasını GERÇEKTEN değiştirir; paylaşılan durumu
     * bozar. Toplamazsa, aynı bağlamı kullanan sonraki testler tohum
     * parolasıyla giremez. Yaşandı: takım tek tek geçiyor, birlikte
     * koşunca sonraki sınıfın altı testi de 401 alıyordu.
     */
    @AfterEach
    void parolayiGeriAl() {
        jetonlar.deleteAll();
        hesaplar.findAll().forEach(h -> {
            if (!sifreleyici.matches(TOHUM_PAROLA, h.getPasswordHash())) {
                h.setPasswordHash(sifreleyici.encode(TOHUM_PAROLA));
                hesaplar.save(h);
            }
        });
    }

    /** Hız sınırı IP başına; her istek ayrı adresten gelmeli. */
    private String ayriAdres() {
        int n = SAYAC.incrementAndGet();
        return "10.90." + (n / 254 % 254) + "." + (n % 254 + 1);
    }

    // ---------------------------------------------------------------- yardım

    private static String jetonUret() throws Exception {
        Method m = ParolaSifirlamaServisi.class.getDeclaredMethod("jetonUret");
        m.setAccessible(true);
        return (String) m.invoke(null);
    }

    private static String karma(String jeton) throws Exception {
        Method m = ParolaSifirlamaServisi.class.getDeclaredMethod("karma", String.class);
        m.setAccessible(true);
        return (String) m.invoke(null, jeton);
    }

    /** Verilen süre sonra dolacak, kullanılmamış bir jeton oluşturur. */
    private String jetonYaz(long dakikaSonra) throws Exception {
        AdminAccount hesap = hesaplar.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("Tohum hesabı yok"));
        String jeton = jetonUret();
        AdminPasswordReset kayit = new AdminPasswordReset();
        kayit.setAccount(hesap);
        kayit.setTokenHash(karma(jeton));
        kayit.setCreatedAt(OffsetDateTime.now());
        kayit.setExpiresAt(OffsetDateTime.now().plusMinutes(dakikaSonra));
        kayit.setRequestedIp("10.0.0.1");
        jetonlar.save(kayit);
        return jeton;
    }

    private static String govde(String jeton, String parola) {
        return "{\"token\":\"" + jeton + "\",\"password\":\"" + parola + "\"}";
    }

    // ---------------------------------------------------------------- jeton

    @Test
    @DisplayName("Geçerli jeton parolayı değiştirir")
    void gecerliJetonCalisir() throws Exception {
        String jeton = jetonYaz(30);
        String yeni = "Yeni.Parola.2026!";

        mvc.perform(post("/api/admin/password-reset/confirm")
                        .with(r -> { r.setRemoteAddr(ayriAdres()); return r; })
                        .contentType(MediaType.APPLICATION_JSON).content(govde(jeton, yeni)))
                .andExpect(status().isOk());

        AdminAccount hesap = hesaplar.findAll().get(0);
        assertTrue(sifreleyici.matches(yeni, hesap.getPasswordHash()),
                "Parola değişmedi");
        assertFalse(hesap.getPasswordHash().contains(yeni),
                "Parola düz metin saklanıyor");
    }

    @Test
    @DisplayName("Jeton yalnızca BİR KEZ kullanılabilir")
    void jetonTekKullanimlik() throws Exception {
        String jeton = jetonYaz(30);

        mvc.perform(post("/api/admin/password-reset/confirm")
                        .with(r -> { r.setRemoteAddr(ayriAdres()); return r; })
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(govde(jeton, "Ilk.Parola.2026!")))
                .andExpect(status().isOk());

        /* Aynı bağlantı ikinci kez işlerse, e-postasına erişen biri
           parolayı istediği zaman yeniden değiştirebilir. */
        mvc.perform(post("/api/admin/password-reset/confirm")
                        .with(r -> { r.setRemoteAddr(ayriAdres()); return r; })
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(govde(jeton, "Ikinci.Parola.2026!")))
                .andExpect(status().is4xxClientError());

        AdminAccount hesap = hesaplar.findAll().get(0);
        assertTrue(sifreleyici.matches("Ilk.Parola.2026!", hesap.getPasswordHash()),
                "İkinci kullanım parolayı değiştirmiş");
    }

    @Test
    @DisplayName("Kullanılmış jeton doğrulama ucunda da geçersizdir")
    void kullanilmisJetonGecersiz() throws Exception {
        String jeton = jetonYaz(30);
        assertTrue(servis.gecerliMi(jeton), "Taze jeton geçerli olmalı");

        servis.tamamla(jeton, "Bir.Parola.2026!", "10.0.0.9");

        assertFalse(servis.gecerliMi(jeton), "Kullanılmış jeton hâlâ geçerli görünüyor");
        mvc.perform(get("/api/admin/password-reset/validate").param("token", jeton))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(false));
    }

    @Test
    @DisplayName("Süresi dolmuş jeton reddedilir")
    void suresiDolmusJetonRet() throws Exception {
        String jeton = jetonYaz(-1);   // bir dakika ÖNCE dolmuş

        assertFalse(servis.gecerliMi(jeton), "Süresi dolmuş jeton geçerli sayıldı");
        assertFalse(servis.tamamla(jeton, "Gecerli.Parola.2026!", "10.0.0.9"),
                "Süresi dolmuş jetonla parola değişti");

        mvc.perform(get("/api/admin/password-reset/validate").param("token", jeton))
                .andExpect(jsonPath("$.valid").value(false));
    }

    @Test
    @DisplayName("Uydurma jeton reddedilir")
    void uydurmaJetonRet() throws Exception {
        jetonYaz(30);   // veritabanında geçerli bir jeton var, ama bu o değil
        String uydurma = Base64.getUrlEncoder().withoutPadding()
                .encodeToString("bu-bir-saldiri-denemesidir-0001".getBytes(StandardCharsets.UTF_8));

        assertFalse(servis.gecerliMi(uydurma));
        assertFalse(servis.tamamla(uydurma, "Gecerli.Parola.2026!", "10.0.0.9"));
    }

    @Test
    @DisplayName("Bir jeton kullanılınca hesabın diğer bekleyen jetonları da kapanır")
    void kullanimDigerJetonlariKapatir() throws Exception {
        String eski = jetonYaz(30);
        String yeni = jetonYaz(30);
        assertTrue(servis.gecerliMi(eski) && servis.gecerliMi(yeni));

        servis.tamamla(yeni, "Kapanis.Parolasi.2026!", "10.0.0.9");

        /* Aksi hâlde arka arkaya istenmiş bütün bağlantılar açık kalır ve
           saldırı penceresi her istekle genişler. */
        assertFalse(servis.gecerliMi(eski),
                "Önceki bağlantı hâlâ açık — saldırı penceresi kapanmıyor");
    }

    @Test
    @DisplayName("Jeton veritabanına düz metin yazılmaz")
    void jetonDuzMetinSaklanmaz() throws Exception {
        String jeton = jetonYaz(30);
        AdminPasswordReset kayit = jetonlar.findAll().get(0);

        assertNotEquals(jeton, kayit.getTokenHash(), "Jeton düz metin saklanmış");
        assertEquals(64, kayit.getTokenHash().length(), "Saklanan değer SHA-256 karması değil");
        assertTrue(jetonlar.findByTokenHash(jeton).isEmpty(),
                "Düz metin jetonla kayıt bulunabiliyor");
    }

    // ---------------------------------------------------------------- yanıt

    @Test
    @DisplayName("İstem yanıtı, adresin kayıtlı olup olmadığını ele vermez")
    void yanitAdresiEleVermez() throws Exception {
        AdminAccount hesap = hesaplar.findAll().get(0);
        String kayitli = hesap.getEmail();

        String bilinmeyen = mvc.perform(post("/api/admin/password-reset/request")
                        .with(r -> { r.setRemoteAddr(ayriAdres()); return r; })
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"kesinlikle-yok@ornek.test\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        if (kayitli != null && !kayitli.isBlank()) {
            String bilinen = mvc.perform(post("/api/admin/password-reset/request")
                            .with(r -> { r.setRemoteAddr(ayriAdres()); return r; })
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"email\":\"" + kayitli + "\"}"))
                    .andExpect(status().isOk())
                    .andReturn().getResponse().getContentAsString();

            assertEquals(bilinen, bilinmeyen,
                    "Kayıtlı ve kayıtsız adres için yanıt farklı — adres varlığı sızıyor");
        }
    }

    @Test
    @DisplayName("Hız sınırı aşıldığında da aynı nötr yanıt döner")
    void hizSinirindaAyniYanit() throws Exception {
        String adres = ayriAdres();
        String ilk = null;

        /* Sınır aşımında 429 dönmek, "bu adres için çok deneme yapıldı"
           bilgisini sızdırırdı. Sınır uygulanır ama yanıt değişmez. */
        for (int i = 0; i < 8; i++) {
            String yanit = mvc.perform(post("/api/admin/password-reset/request")
                            .with(r -> { r.setRemoteAddr(adres); return r; })
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"email\":\"deneme@ornek.test\"}"))
                    .andExpect(status().isOk())
                    .andReturn().getResponse().getContentAsString();
            if (ilk == null) ilk = yanit;
            assertEquals(ilk, yanit, (i + 1) + ". istekte yanıt değişti — sınır durumu sızıyor");
        }
    }

    @Test
    @DisplayName("Kurallara uymayan parola kabul edilmez ve jeton harcanmaz")
    @Transactional
    void zayifParolaJetonuHarcamaz() throws Exception {
        String jeton = jetonYaz(30);

        mvc.perform(post("/api/admin/password-reset/confirm")
                        .with(r -> { r.setRemoteAddr(ayriAdres()); return r; })
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(govde(jeton, "kisa")))
                .andExpect(status().isBadRequest());

        /* Zayıf parola denemesi jetonu tüketseydi, kullanıcı yazım
           hatası yüzünden bağlantısını kaybeder ve yeniden istemek
           zorunda kalırdı. */
        assertTrue(servis.gecerliMi(jeton), "Reddedilen deneme jetonu harcamış");
    }
}
