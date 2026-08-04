package tr.edu.hacettepe.bidb.web;

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
import tr.edu.hacettepe.bidb.model.ContactChannel;
import tr.edu.hacettepe.bidb.repo.ContactChannelRepo;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * İletişim kanallarının iki dilde eşitliği.
 *
 * NEDEN BU TEST VAR
 *
 * contact_channel tablosunda uzun süre YALNIZCA Türkçe kayıtlar vardı
 * (tr=7, en=0) ve bu hiçbir yerde hata üretmedi. İki yüzey sessizce
 * bozuldu:
 *
 *   · Alt bilgide E-POSTA bloğu, listesi boş olduğu için HİÇ görünmedi;
 *     adres satırı da bileşendeki yedek metne düşüp kurum adını yitirdi.
 *   · /en/contact sayfasında iletişim bloğunun tamamı gizlendi.
 *
 * İkisi de "koşullu gösterim" olduğundan ekranda hata çıkmıyor, yalnızca
 * bilgi eksik duruyor. Fark ancak iki dil YAN YANA konduğunda görülür —
 * bu testin yaptığı da budur.
 *
 * Kurumun adresi, telefonu ve e-postası dile göre DEĞİŞMEZ. Bu yüzden
 * burada tam eşitlik aranabilir. Sayfa ve duyuru sayıları için aynı şey
 * geçerli değildir (İngilizce çeviri ayrı ve süren bir iş); onlar bilerek
 * sınanmıyor.
 */
@SpringBootTest
@ActiveProfiles("test")
@Import(VeritabaniTemeli.class)
class IletisimKanaliEsitligiTest {

    @Autowired private WebApplicationContext baglam;
    @Autowired private ContactChannelRepo kanallar;

    private MockMvc mvc;

    @BeforeEach
    void hazirla() {
        mvc = MockMvcBuilders.webAppContextSetup(baglam).apply(springSecurity()).build();
    }

    private List<ContactChannel> dil(String dil) {
        return kanallar.findAll().stream()
                .filter(k -> dil.equals(k.getLanguage()) && k.isPublished())
                .toList();
    }

    private Map<String, Long> turSayilari(String dil) {
        return dil(dil).stream().collect(
                Collectors.groupingBy(ContactChannel::getType, Collectors.counting()));
    }

    @Test
    @DisplayName("Her iki dilde de iletişim kanalı vardır")
    void ikiDildeDeKanalVar() {
        assertFalse(dil("tr").isEmpty(), "Türkçe iletişim kanalı yok");
        assertFalse(dil("en").isEmpty(),
                "İngilizce iletişim kanalı yok — alt bilgideki e-posta bloğu ve "
                + "/en/contact sayfasındaki iletişim bloğu görünmez olur");
    }

    @Test
    @DisplayName("Kanal türleri ve sayıları iki dilde aynıdır")
    void turlerVeSayilarAyni() {
        Map<String, Long> tr = turSayilari("tr");
        Map<String, Long> en = turSayilari("en");

        assertEquals(tr.keySet(), en.keySet(),
                "Bir dilde olan kanal türü öbüründe yok. tr=" + tr + " en=" + en);
        assertEquals(tr, en,
                "Aynı türden kanal sayısı iki dilde farklı. tr=" + tr + " en=" + en);
    }

    @Test
    @DisplayName("Telefon, faks ve e-posta değerleri iki dilde birebir aynıdır")
    void degistirilmeyenlerAyni() {
        /* Kurumun numarası ve adresi dile göre değişmez. Bir dilde
           güncellenip öbüründe unutulmuş bir numara, ziyaretçiyi yanlış
           yere yönlendirir ve hiçbir yerde hata üretmez. */
        for (String tur : List.of("phone", "fax", "email")) {
            List<String> tr = degerler("tr", tur);
            List<String> en = degerler("en", tur);
            assertEquals(tr, en, tur + " değerleri iki dilde farklı");
        }
    }

    @Test
    @DisplayName("Adres, kurum adının o dildeki karşılığını içerir")
    void adresKurumAdiniIcerir() {
        /* Adres çevrilen TEK alandır. Türkçe metnin İngilizce tarafa
           kopyalanması da, kurum adının hiç yazılmaması da kusurdur. */
        String trAdres = String.join(" ", degerler("tr", "address"));
        String enAdres = String.join(" ", degerler("en", "address"));

        assertTrue(trAdres.contains("Bilgi İşlem Daire Başkanlığı"),
                "Türkçe adres kurum adını içermiyor: " + trAdres);
        assertTrue(enAdres.contains("Department of Information Technology"),
                "İngilizce adres kurum adının yerleşik karşılığını içermiyor "
                + "(bkz. docs/ceviri-sozlugu.md): " + enAdres);
        assertFalse(enAdres.contains("Daire Başkanlığı"),
                "İngilizce adreste Türkçe kurum adı kalmış: " + enAdres);

        // İki adres de aynı yerleşkeyi göstermeli
        assertTrue(trAdres.contains("Beytepe") && enAdres.contains("Beytepe"),
                "Adreslerden biri yerleşkeyi belirtmiyor");
    }

    @Test
    @DisplayName("İngilizce adreste Türkçeye özgü harf kalmaz")
    void ingilizceAdresteTurkceHarfYok() {
        /* Türkçeye özgü harf, metnin çevrilmeden kopyalandığının izidir.
           Yer adları (Beytepe, Ankara) bu harfleri içermiyor. */
        String enAdres = String.join(" ", degerler("en", "address"));
        assertFalse(enAdres.matches(".*[çğıöşüÇĞİÖŞÜ].*"),
                "İngilizce adreste Türkçeye özgü harf var: " + enAdres);
    }

    @Test
    @DisplayName("Uçlar iki dilde de dolu yanıt döner")
    void uclarDoluDoner() throws Exception {
        /* Depo doğru olsa bile uç dili süzerken yanlış davranabilir;
           ziyaretçinin gördüğü yüzey burasıdır. */
        for (String d : List.of("tr", "en")) {
            mvc.perform(get("/api/" + d + "/contact-channels"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$[0]").exists());
        }
    }

    @Test
    @DisplayName("Uç yalnızca istenen dilin kayıtlarını döner")
    void ucDiliSuzer() throws Exception {
        /* Süzme kalkarsa iki dilin kayıtları birleşir ve alt bilgide
           adres iki kez, farklı dillerde yan yana görünür. */
        for (String d : List.of("tr", "en")) {
            mvc.perform(get("/api/" + d + "/contact-channels"))
                    .andExpect(jsonPath("$[?(@.language != '" + d + "')]").isEmpty());
        }
    }

    private List<String> degerler(String dil, String tur) {
        return dil(dil).stream()
                .filter(k -> tur.equals(k.getType()))
                .sorted(java.util.Comparator.comparingInt(ContactChannel::getSortOrder)
                        .thenComparing(ContactChannel::getValue))
                .map(ContactChannel::getValue)
                .toList();
    }
}
