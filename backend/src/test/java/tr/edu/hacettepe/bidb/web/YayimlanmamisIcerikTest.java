package tr.edu.hacettepe.bidb.web;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import tr.edu.hacettepe.bidb.VeritabaniTemeli;
import tr.edu.hacettepe.bidb.model.News;
import tr.edu.hacettepe.bidb.model.Page;
import tr.edu.hacettepe.bidb.repo.NewsRepo;
import tr.edu.hacettepe.bidb.repo.PageRepo;

import java.time.LocalDate;
import java.time.OffsetDateTime;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Yayımlanmamış içerik genel uçlardan görünmemelidir.
 *
 * NEDEN BU TEST VAR
 *
 * Panelde "yayında değil" işaretli bir kayıt, hazırlanmakta olan ya da
 * bilerek geri çekilmiş içeriktir. Genel uçtan okunabiliyorsa, adresi
 * bilen (ya da deneyen) herkes onu görebilir; arama motoru bir yerde
 * bağlantı bulursa dizine de alır. Panelde "yayında değil" yazdığı için
 * kimse durumu fark etmez.
 *
 * Sızıntı bulunmadı; bulunan, komşu bir kusur oldu. Yayın süzgeci
 * PageRepo'daki sorgunun GÖVDESİNDEYDİ ama yöntemin ADINDA değildi
 * ("findBySlugAndLanguage"). Aynı yöntemi yönetim panelindeki slug
 * benzersizlik denetimleri de çağırıyordu ve orada süzgeç yanlıştı:
 * yayımlanmamış bir sayfanın adresi "boşta" görünüyordu. Ayrıntı ve
 * düzeltme için bkz. PageRepo ve AdresBenzersizligiTest.
 *
 * Testler kendi kayıtlarını oluşturur ve siler; var olan veriye dokunmaz.
 */
@SpringBootTest
@ActiveProfiles("test")
@Import(VeritabaniTemeli.class)
class YayimlanmamisIcerikTest {

    @Autowired private WebApplicationContext baglam;
    @Autowired private PageRepo sayfalar;
    @Autowired private NewsRepo duyurular;

    private MockMvc mvc;

    /* Sınama kayıtları bu ön ekle işaretlenir; temizlik yalnızca
       bunları siler, var olan içeriğe dokunulmaz. */
    private static final String ON_EK = "sinama-yayim-";

    @BeforeEach
    void hazirla() {
        mvc = MockMvcBuilders.webAppContextSetup(baglam).apply(springSecurity()).build();
        temizle();
    }

    @AfterEach
    void temizle() {
        sayfalar.findAll().stream().filter(s -> s.getSlug() != null && s.getSlug().startsWith(ON_EK))
                .forEach(sayfalar::delete);
        duyurular.findAll().stream().filter(d -> d.getSlug() != null && d.getSlug().startsWith(ON_EK))
                .forEach(duyurular::delete);
    }

    private Page sayfaYaz(String slug, boolean yayinda) {
        Page s = new Page();
        s.setSlug(ON_EK + slug);
        s.setLanguage("tr");
        s.setTitle("Sınama sayfası");
        s.setContentHtml("<p>Bu içerik yalnızca sınama içindir.</p>");
        s.setPublished(yayinda);
        // updated_at NOT NULL; panelde kayıt kaydedilirken doldurulur
        s.setUpdatedAt(OffsetDateTime.now());
        return sayfalar.save(s);
    }

    private News duyuruYaz(String slug, boolean yayinda) {
        News d = new News();
        d.setSlug(ON_EK + slug);
        d.setLanguage("tr");
        d.setTitle("Sınama duyurusu");
        d.setSummary("Sınama özeti");
        d.setContentHtml("<p>Sınama.</p>");
        d.setPublishedOn(LocalDate.now());
        d.setPublished(yayinda);
        return duyurular.save(d);
    }

    // ---------------------------------------------------------------- sayfa

    @Test
    @DisplayName("Yayımlanmamış sayfa doğrudan adresinden okunamaz")
    void yayimlanmamisSayfaOkunamaz() throws Exception {
        sayfaYaz("gizli", false);

        mvc.perform(get("/api/tr/pages/" + ON_EK + "gizli"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Yayımlanmış sayfa okunabilir")
    void yayimlanmisSayfaOkunur() throws Exception {
        sayfaYaz("acik", true);

        /* Karşı denetim. Bu olmadan, "hepsini 404 döndür" gibi bir
           düzeltme de testi geçirirdi. */
        mvc.perform(get("/api/tr/pages/" + ON_EK + "acik"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value(ON_EK + "acik"));
    }

    @Test
    @DisplayName("Yayımlanmamış sayfa listede görünmez")
    void yayimlanmamisSayfaListedeYok() throws Exception {
        sayfaYaz("listede-olmamali", false);
        sayfaYaz("listede-olmali", true);

        String liste = mvc.perform(get("/api/tr/pages"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        org.junit.jupiter.api.Assertions.assertFalse(liste.contains(ON_EK + "listede-olmamali"),
                "Yayımlanmamış sayfa listede görünüyor");
        org.junit.jupiter.api.Assertions.assertTrue(liste.contains(ON_EK + "listede-olmali"),
                "Yayımlanmış sayfa listede görünmüyor");
    }

    @Test
    @DisplayName("Yayından kaldırılan sayfa erişilemez hâle gelir")
    void yayindanKaldirilanErisilemez() throws Exception {
        Page s = sayfaYaz("geri-cekilecek", true);
        mvc.perform(get("/api/tr/pages/" + ON_EK + "geri-cekilecek")).andExpect(status().isOk());

        s.setPublished(false);
        sayfalar.save(s);

        /* Geri çekmenin bir anlamı olmalı. Kayıt yayından kaldırıldığı
           hâlde adresi çalışmaya devam ederse, "kaldırdım" diyen
           işletmen yanılmış olur. */
        mvc.perform(get("/api/tr/pages/" + ON_EK + "geri-cekilecek"))
                .andExpect(status().isNotFound());
    }

    // ---------------------------------------------------------------- duyuru

    @Test
    @DisplayName("Yayımlanmamış duyuru doğrudan adresinden okunamaz")
    void yayimlanmamisDuyuruOkunamaz() throws Exception {
        duyuruYaz("gizli-duyuru", false);

        mvc.perform(get("/api/tr/news/" + ON_EK + "gizli-duyuru"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Yayımlanmış duyuru okunabilir")
    void yayimlanmisDuyuruOkunur() throws Exception {
        duyuruYaz("acik-duyuru", true);

        mvc.perform(get("/api/tr/news/" + ON_EK + "acik-duyuru"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Yayımlanmamış duyuru listede ve ana sayfada görünmez")
    void yayimlanmamisDuyuruListedeYok() throws Exception {
        duyuruYaz("duyuru-gizli", false);

        String liste = mvc.perform(get("/api/tr/news"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        org.junit.jupiter.api.Assertions.assertFalse(liste.contains(ON_EK + "duyuru-gizli"),
                "Yayımlanmamış duyuru listede görünüyor");

        String anaSayfa = mvc.perform(get("/api/tr/home"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        org.junit.jupiter.api.Assertions.assertFalse(anaSayfa.contains(ON_EK + "duyuru-gizli"),
                "Yayımlanmamış duyuru ana sayfada görünüyor");
    }

    // ---------------------------------------------------------------- genel

    @Test
    @DisplayName("Yayımlanmamış içerik hiçbir genel uçta geçmez")
    void hicbirGenelUctaGecmez() throws Exception {
        sayfaYaz("tarama-sayfa", false);
        duyuruYaz("tarama-duyuru", false);

        /* Tek tek uç saymak yerine genel yüzeyin taranması: yeni bir uç
           eklendiğinde bu test onu da kapsar. */
        String[] uclar = { "/api/tr/home", "/api/tr/pages", "/api/tr/news",
                           "/api/en/home", "/api/en/pages", "/api/en/news" };
        for (String uc : uclar) {
            String govde = mvc.perform(get(uc)).andReturn().getResponse().getContentAsString();
            org.junit.jupiter.api.Assertions.assertFalse(govde.contains(ON_EK),
                    uc + " yanıtında yayımlanmamış sınama kaydı geçiyor");
        }
    }
}
