package tr.edu.hacettepe.bidb.web;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import tr.edu.hacettepe.bidb.VeritabaniTemeli;

import java.util.concurrent.atomic.AtomicInteger;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Yetkilendirme kuralları.
 *
 * NEDEN BU TEST VAR
 *
 * SecurityConfig'teki kural sırası kırılgandır ve bir hatası sessizdir:
 * yanlış yere konmuş tek bir permitAll, yönetim uçlarını herkese açar ve
 * hiçbir yerde hata görünmez — panel çalışmaya devam eder. Bu sınıfın
 * tamamı o matrisi yerinde tutmak içindir.
 *
 * Özellikle kritik olan: parola sıfırlamanın ÜÇ ucu /api/admin/ altında
 * ve kimliksiz erişime açık. Bu bilinçli bir tercih (denetim günlüğü ve
 * giriş sınırlayıcısı o ön eki izliyor), ama "/api/admin/** toptan
 * gevşetilmemiştir" güvencesi ancak sınanırsa geçerlidir.
 *
 * HER TEST FARKLI BİR IP KULLANIR. Giriş sınırlayıcısı IP başına 5
 * dakikada 8 başarısız denemeden sonra 429 döndürür; aynı adresten
 * çalışan testler birbirini kilitler ve arıza rastgele görünürdü.
 */
@SpringBootTest
@ActiveProfiles("test")
@Import(VeritabaniTemeli.class)
class YetkilendirmeTest {

    @Autowired
    private WebApplicationContext baglam;

    private MockMvc mvc;

    /** Her isteğe ayrı bir kaynak adres; sınırlayıcı testleri etkilemesin. */
    private static final AtomicInteger SAYAC = new AtomicInteger(0);

    private MockMvc istemci() {
        if (mvc == null) {
            mvc = MockMvcBuilders.webAppContextSetup(baglam).apply(springSecurity()).build();
        }
        return mvc;
    }

    /** İsteğe benzersiz bir kaynak adres verir. */
    private static <T extends MockHttpServletRequestBuilder> T ayriAdres(T istek) {
        int n = SAYAC.incrementAndGet();
        istek.with(r -> {
            r.setRemoteAddr("10." + ((n / 65024) % 250 + 1) + "." + ((n / 254) % 254) + "." + (n % 254 + 1));
            return r;
        });
        return istek;
    }

    // ------------------------------------------------ yönetim uçları kapalı

    @ParameterizedTest(name = "kimliksiz GET {0} → 401")
    @ValueSource(strings = {
        "/api/admin/quality",
        "/api/admin/pages",
        "/api/admin/menus",
        "/api/admin/staff",
        "/api/admin/settings",
        "/api/admin/contact-channels",
        "/api/admin/contact-tickets",
        "/api/admin/audit-events",
        "/api/admin/login-events",
        "/api/admin/analytics",
        "/api/admin/mail/settings",
        "/api/admin/files"
    })
    @DisplayName("Yönetim uçları kimlik doğrulaması ister")
    void yonetimUclariKapali(String yol) throws Exception {
        istemci().perform(ayriAdres(get(yol)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Yanlış parola kabul edilmez")
    void yanlisParolaRet() throws Exception {
        istemci().perform(ayriAdres(get("/api/admin/quality"))
                        .header("Authorization", temelKimlik("admin", "yanlis-parola")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Var olmayan kullanıcı kabul edilmez")
    void olmayanKullaniciRet() throws Exception {
        istemci().perform(ayriAdres(get("/api/admin/quality"))
                        .header("Authorization", temelKimlik("boyle-biri-yok", "herhangi")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Yazma uçları da kimliksiz kapalıdır")
    void yazmaUclariKapali() throws Exception {
        istemci().perform(ayriAdres(post("/api/admin/pages"))
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isUnauthorized());
        istemci().perform(ayriAdres(delete("/api/admin/pages/1")))
                .andExpect(status().isUnauthorized());
        istemci().perform(ayriAdres(put("/api/admin/menus/1"))
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isUnauthorized());
    }

    // ------------------------------------------------ parola sıfırlama açık

    @Test
    @DisplayName("Parola sıfırlama istemi kimliksiz çalışır")
    void sifirlamaIstemiAcik() throws Exception {
        istemci().perform(ayriAdres(post("/api/admin/password-reset/request"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"kimse@ornek.test\"}"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Jeton doğrulama ucu kimliksiz çalışır")
    void jetonDogrulamaAcik() throws Exception {
        istemci().perform(ayriAdres(get("/api/admin/password-reset/validate"))
                        .param("token", "gecersiz-jeton"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(false));
    }

    @Test
    @DisplayName("Parola belirleme ucu kimliksiz erişilebilir")
    void tamamlamaAcik() throws Exception {
        /* Geçersiz jetonla 400 döner — ama 401 DÖNMEZ. Aranan budur:
           uç kimlik doğrulamasına takılmıyor. */
        istemci().perform(ayriAdres(post("/api/admin/password-reset/confirm"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"token\":\"gecersiz\",\"password\":\"Cok.Guclu.2026!\"}"))
                .andExpect(status().is(not401()));
    }

    @Test
    @DisplayName("Sıfırlama muafiyeti yalnızca belirtilen yöntemi kapsar")
    void muafiyetYontemeBagli() throws Exception {
        /* İzin POST için verildi. Aynı yola GET ile gidilirse
           /api/admin/** kuralına düşmeli ve 401 dönmeli. Muafiyeti
           yönteme bakmadan yazmak, o yolu tümüyle açardı. */
        istemci().perform(ayriAdres(get("/api/admin/password-reset/request")))
                .andExpect(status().isUnauthorized());
        istemci().perform(ayriAdres(post("/api/admin/password-reset/validate")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Muafiyet komşu yollara taşmaz")
    void muafiyetTasmaz() throws Exception {
        /* "/api/admin/password-reset/**" biçiminde bir joker kullanılsaydı
           bu yollar da açılırdı. */
        istemci().perform(ayriAdres(post("/api/admin/password-reset"))).andExpect(status().isUnauthorized());
        istemci().perform(ayriAdres(post("/api/admin/password-reset/requestX"))).andExpect(status().isUnauthorized());
        istemci().perform(ayriAdres(get("/api/admin/password-reset/validate/hepsi"))).andExpect(status().isUnauthorized());
    }

    // ------------------------------------------------ yayın uçları açık

    @Test
    @DisplayName("Yayın içeriği herkese açıktır")
    void yayinUclariAcik() throws Exception {
        istemci().perform(ayriAdres(get("/api/tr/pages"))).andExpect(status().isOk());
        istemci().perform(ayriAdres(get("/api/en/pages"))).andExpect(status().isOk());
    }

    @Test
    @DisplayName("Yayın uçlarına yazma kapalıdır")
    void yayinUclarinaYazmaKapali() throws Exception {
        /* Kural yalnızca GET için permitAll veriyor. POST açık olsaydı
           herkes içerik gönderebilirdi. */
        istemci().perform(ayriAdres(post("/api/tr/pages"))
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().is(anyOf403or401()));
    }

    @Test
    @DisplayName("Tanımsız yollar reddedilir")
    void tanimsizYolReddedilir() throws Exception {
        // anyRequest().denyAll(): eşleşmeyen hiçbir yol açık kalmamalı
        istemci().perform(ayriAdres(get("/api/gizli"))).andExpect(status().is(anyOf403or401()));
        istemci().perform(ayriAdres(get("/api/fr/pages"))).andExpect(status().is(anyOf403or401()));
    }

    @Test
    @DisplayName("Sağlık ucu açıktır")
    void saglikUcuAcik() throws Exception {
        istemci().perform(ayriAdres(get("/actuator/health"))).andExpect(status().isOk());
    }

    // ------------------------------------------------ yardımcılar

    private static String temelKimlik(String kullanici, String parola) {
        return "Basic " + java.util.Base64.getEncoder()
                .encodeToString((kullanici + ":" + parola).getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    /** 401 DIŞINDA herhangi bir kod. */
    private static org.hamcrest.Matcher<Integer> not401() {
        return org.hamcrest.Matchers.not(401);
    }

    /** Kimliksiz reddedilmiş sayılan kodlar. */
    private static org.hamcrest.Matcher<Integer> anyOf403or401() {
        return org.hamcrest.Matchers.isIn(java.util.List.of(401, 403));
    }
}
