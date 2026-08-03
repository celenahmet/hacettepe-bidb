package tr.edu.hacettepe.bidb.web;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import tr.edu.hacettepe.bidb.VeritabaniTemeli;
import tr.edu.hacettepe.bidb.model.Page;
import tr.edu.hacettepe.bidb.repo.PageRepo;


import java.time.OffsetDateTime;


import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Sayfa adresinin (slug) benzersizlik denetimi.
 *
 * NEDEN BU TEST VAR
 *
 * Benzersizlik iki yerde birden korunuyor: veritabanındaki (slug, dil)
 * UNIQUE kısıtı ve paneldeki ön denetim. Kısıt yayın durumuna BAKMAZ;
 * ön denetim ise bakıyordu (yayın süzgeçli bir sorgu çağırıyordu).
 *
 * KAYBEDİLEN ŞEY MESAJDI, VERİ DEĞİL. Çakışan sayfa yayımlanmamışsa ön
 * denetim "bu adres boşta" deyip geçiyor, kayıt veritabanı kısıtına
 * çarpıyordu. Kısıt görevini yapıyor, VeriHatasiIsleyici de sonucu 400'e
 * çeviriyordu — yani durum kodu doğruydu ve ikinci kayıt oluşmuyordu.
 * Ama işletmen HANGİ adresin çakıştığını göremiyordu: "Bu adres zaten
 * kullanılıyor: /tr/duyurular" yerine "Bu kayıt zaten var" yazıyordu.
 *
 * Bu yüzden testler durum koduna DEĞİL, mesajın çakışan adresi adıyla
 * söyleyip söylemediğine bakar. Yalnızca 400 aranan bir test, kusurlu
 * kodda da geçerdi — denendi, geçti.
 */
@SpringBootTest
@ActiveProfiles("test")
@Import(VeritabaniTemeli.class)
@WithMockUser(username = "sinama-yonetici")
class AdresBenzersizligiTest {

    @Autowired private WebApplicationContext baglam;
    @Autowired private PageRepo sayfalar;

    private MockMvc mvc;

    private static final String ON_EK = "sinama-adres-";

    @BeforeEach
    void hazirla() {
        mvc = MockMvcBuilders.webAppContextSetup(baglam).apply(springSecurity()).build();
        temizle();
    }

    @AfterEach
    void temizle() {
        sayfalar.findAll().stream()
                .filter(s -> s.getSlug() != null && s.getSlug().startsWith(ON_EK))
                .forEach(sayfalar::delete);
    }

    /*
     * Kimlik doğrulaması @WithMockUser ile geçilir; gerçek parola KULLANILMAZ.
     *
     * Önce tohum parolasıyla Basic kimlik gönderiliyordu ve tek başına
     * çalışırken geçiyordu. Tüm takım birlikte koşunca hepsi 401 oldu:
     * ParolaSifirlamaAkisiTest daha önce çalışıp yönetici parolasını
     * GERÇEKTEN değiştiriyor. Bu sınıfın konusu adres benzersizliği;
     * kimlik doğrulamasına bağlanması onu başka bir testin yan etkisine
     * bağımlı kılıyordu. Kimlik doğrulamanın kendisi YetkilendirmeTest'in
     * konusudur ve orada gerçek zincirle sınanır.
     */

    private Page sayfaYaz(String slug, boolean yayinda) {
        Page s = new Page();
        s.setSlug(ON_EK + slug);
        s.setLanguage("tr");
        s.setTitle("Sınama");
        s.setContentHtml("<p>Sınama.</p>");
        s.setPublished(yayinda);
        s.setUpdatedAt(OffsetDateTime.now());
        return sayfalar.save(s);
    }

    private static String yeniSayfaGovdesi(String slug) {
        return "{\"language\":\"tr\",\"slug\":\"" + slug + "\",\"title\":\"Sınama\",\"contentHtml\":\"\"}";
    }

    @Test
    @DisplayName("Yayındaki bir adres yeniden kullanılamaz ve mesaj adresi söyler")
    void yayindakiAdresCakisir() throws Exception {
        sayfaYaz("dolu", true);

        String yanit = mvc.perform(post("/api/admin/pages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(yeniSayfaGovdesi(ON_EK + "dolu")))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        assertTrue(yanit.contains(ON_EK + "dolu"),
                "Uyarı çakışan adresi söylemiyor: " + yanit);
    }

    @Test
    @DisplayName("YAYIMLANMAMIŞ bir adres de yeniden kullanılamaz ve mesaj adresi söyler")
    void yayimlanmamisAdresDeCakisir() throws Exception {
        sayfaYaz("gizli-ama-dolu", false);

        String yanit = mvc.perform(post("/api/admin/pages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(yeniSayfaGovdesi(ON_EK + "gizli-ama-dolu")))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        /* Asıl denetim BU: kusurlu kodda da 400 dönüyordu (UNIQUE kısıt
           yakalıyor, VeriHatasiIsleyici 400'e çeviriyor) ama mesaj genel
           kalıyor, hangi adresin dolu olduğunu söylemiyordu. */
        assertTrue(yanit.contains(ON_EK + "gizli-ama-dolu"),
                "Uyarı çakışan adresi söylemiyor — ön denetim yayımlanmamış sayfayı "
                + "görmemiş, uyarı veritabanı kısıtından gelmiş olmalı: " + yanit);

        assertEquals(1, sayfalar.findAll().stream()
                        .filter(s -> (ON_EK + "gizli-ama-dolu").equals(s.getSlug())).count(),
                "Aynı adresten ikinci kayıt oluşmuş");
    }

    @Test
    @DisplayName("Boşta bir adres kullanılabilir")
    void bostaAdresKullanilir() throws Exception {
        /* Karşı denetim: "her zaman 400 döndür" gibi bir düzeltme de
           yukarıdaki testleri geçirirdi. */
        mvc.perform(post("/api/admin/pages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(yeniSayfaGovdesi(ON_EK + "bos-adres")))
                .andExpect(status().isOk());

        assertTrue(sayfalar.existsBySlugAndLanguage(ON_EK + "bos-adres", "tr"),
                "Sayfa oluşturulmamış");
    }

    @Test
    @DisplayName("Adres değiştirirken yayımlanmamış bir adrese çarpılmaz")
    void adresDegistirmedeCakisma() throws Exception {
        sayfaYaz("hedef-gizli", false);
        Page tasinacak = sayfaYaz("tasinacak", true);

        String yanit = mvc.perform(put("/api/admin/pages/" + tasinacak.getId() + "/address")
                        
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"slug\":\"" + ON_EK + "hedef-gizli\",\"title\":\"Sınama\"}"))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        assertTrue(yanit.contains(ON_EK + "hedef-gizli"),
                "Uyarı çakışan adresi söylemiyor: " + yanit);

        Page hala = sayfalar.findById(tasinacak.getId()).orElseThrow();
        assertEquals(ON_EK + "tasinacak", hala.getSlug(),
                "Çakışmaya rağmen adres değişmiş");
    }

    @Test
    @DisplayName("Adres boşta bir değere değiştirilebilir")
    void adresDegistirmeCalisir() throws Exception {
        Page s = sayfaYaz("eski-adres", true);

        mvc.perform(put("/api/admin/pages/" + s.getId() + "/address")
                        
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"slug\":\"" + ON_EK + "yeni-adres\",\"title\":\"Sınama\"}"))
                .andExpect(status().isOk());

        Page guncel = sayfalar.findById(s.getId()).orElseThrow();
        assertEquals(ON_EK + "yeni-adres", guncel.getSlug(), "Adres değişmemiş");
    }

    @Test
    @DisplayName("Benzersizlik dile göredir")
    void benzersizlikDileGore() throws Exception {
        sayfaYaz("iki-dilli", true);   // tr

        /* Kısıt (slug, dil) üzerinde. Aynı adres başka dilde serbesttir;
           denetim dili yok sayarsa İngilizce karşılık hiç açılamazdı. */
        mvc.perform(post("/api/admin/pages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"language\":\"en\",\"slug\":\"" + ON_EK + "iki-dilli\","
                               + "\"title\":\"Test\",\"contentHtml\":\"\"}"))
                .andExpect(status().isOk());

        sayfalar.findAll().stream()
                .filter(x -> (ON_EK + "iki-dilli").equals(x.getSlug()) && "en".equals(x.getLanguage()))
                .forEach(sayfalar::delete);
    }
}
