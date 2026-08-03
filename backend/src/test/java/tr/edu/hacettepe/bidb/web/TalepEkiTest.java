package tr.edu.hacettepe.bidb.web;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import tr.edu.hacettepe.bidb.VeritabaniTemeli;
import tr.edu.hacettepe.bidb.model.ContactTicket;
import tr.edu.hacettepe.bidb.repo.ContactTicketRepo;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Ziyaretçi iletişim formunun dosya eki.
 *
 * NEDEN BU TEST VAR
 *
 * Bu, sitedeki TEK kimliksiz yükleme yüzeyi: internetteki herkes buraya
 * dosya gönderebiliyor. Panel yüklemesinden farkı, saldırganın önce bir
 * hesaba girmesi gerekmemesi — yani aynı kusurun bedeli çok daha yüksek.
 *
 * Buradaki asıl koruma, dosya adının KULLANICIDAN ALINMAMASI: kaydedilen
 * ad, sunucunun ürettiği takip kodudur. Gönderilen ad yalnızca panelde
 * gösterilmek üzere veriye yazılır, dosya sistemine hiç değmez. Bu tasarım
 * yol geçişini baştan olanaksız kılar; test onu yerinde tutar.
 *
 * Testler kendi kayıtlarını ve dosyalarını siler.
 */
@SpringBootTest
@ActiveProfiles("test")
@Import(VeritabaniTemeli.class)
class TalepEkiTest {

    @Autowired private WebApplicationContext baglam;
    @Autowired private ContactTicketRepo talepler;

    @Value("${bidb.dosya-dizini}")
    private String dizinYolu;

    private MockMvc mvc;
    private Path ekDizini;

    /** Hız sınırı IP başına; her istek ayrı adresten gelmeli. */
    private static final AtomicInteger SAYAC = new AtomicInteger(0);

    @BeforeEach
    void hazirla() {
        mvc = MockMvcBuilders.webAppContextSetup(baglam).apply(springSecurity()).build();
        ekDizini = Paths.get(dizinYolu).resolve("talepler");
        temizle();
    }

    @AfterEach
    void temizle() {
        talepler.findAll().stream()
                .filter(t -> t.getSubject() != null && t.getSubject().startsWith("SINAMA"))
                .forEach(talepler::delete);
        if (Files.exists(ekDizini)) {
            try (var akis = Files.walk(ekDizini)) {
                akis.sorted(Comparator.reverseOrder())
                    .filter(p -> !p.equals(ekDizini))
                    .forEach(p -> { try { Files.deleteIfExists(p); } catch (IOException ignored) { } });
            } catch (IOException ignored) { }
        }
    }

    private MockMultipartFile ek(String ad, String icerik) {
        return new MockMultipartFile("attachment", ad, null, icerik.getBytes(StandardCharsets.UTF_8));
    }

    /** Geçerli bir talep isteği; yalnızca ek değişkeni sınanır. */
    private MockMultipartHttpServletRequestBuilder istek() {
        var b = multipart("/api/contact/tickets");
        b.param("language", "tr");
        b.param("category", "GENERAL");
        b.param("subject", "SINAMA talebi");
        b.param("firstName", "Sınama");
        b.param("lastName", "Kullanıcı");
        b.param("email", "sinama@ornek.test");
        b.param("phone", "0312 000 00 00");
        b.param("message", "Bu bir sınama iletisidir ve yeterince uzundur.");
        int n = SAYAC.incrementAndGet();
        b.with(r -> { r.setRemoteAddr("10.70." + (n / 254 % 254) + "." + (n % 254 + 1)); return r; });
        return b;
    }

    // ------------------------------------------------------- yasak türler

    @ParameterizedTest(name = "{0} reddedilir")
    @ValueSource(strings = {
        "kotu.html", "kotu.svg", "kotu.js", "kotu.php", "kotu.exe",
        "kotu.sh", "kotu.zip", "kotu.doc", "kotu.xlsx"
    })
    @DisplayName("Ek olarak yalnızca dar bir belge kümesi kabul edilir")
    void yasakTurlerRet(String ad) throws Exception {
        /* Panel listesinden dar tutulması bilinçli: ziyaretçi eki için
           zip ve doc gibi biçimlere ihtiyaç yok, her ek biçim ayrı bir
           risk yüzeyi. */
        mvc.perform(istek().file(ek(ad, "<script>alert(1)</script>")))
                .andExpect(status().isBadRequest());

        assertTrue(ekDizinBos(), ad + " diske yazılmış");
        assertEquals(0, sinamaTalepSayisi(), ad + " için talep oluşmuş");
    }

    @ParameterizedTest(name = "{0} kabul edilir")
    @ValueSource(strings = { "belge.pdf", "foto.jpg", "foto.jpeg", "ekran.png", "form.docx" })
    @DisplayName("İzin verilen ek türleri kabul edilir")
    void izinliTurlerKabul(String ad) throws Exception {
        mvc.perform(istek().file(ek(ad, "içerik")))
                .andExpect(status().isCreated());
        assertEquals(1, ekDizindekiler().size(), ad + " kaydedilmemiş");
    }

    // ------------------------------------------------------- ad ve yol

    @Test
    @DisplayName("Diske yazılan ad kullanıcıdan GELMEZ; takip kodudur")
    void diskAdiKullanicidanGelmez() throws Exception {
        String yanit = mvc.perform(istek().file(ek("gizli-belgem.pdf", "içerik")))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        List<Path> yazilanlar = ekDizindekiler();
        assertEquals(1, yazilanlar.size());
        String diskAdi = yazilanlar.get(0).getFileName().toString();

        assertFalse(diskAdi.contains("gizli-belgem"),
                "Kullanıcının verdiği ad dosya sistemine geçmiş: " + diskAdi);

        /* Ad, yanıtta dönen takip kodundan üretilmeli. */
        ContactTicket talep = talepler.findAll().stream()
                .filter(t -> "SINAMA talebi".equals(t.getSubject())).findFirst().orElseThrow();
        assertEquals(talep.getReferenceCode().toLowerCase() + ".pdf", diskAdi,
                "Dosya adı takip kodundan üretilmemiş");
        assertTrue(yanit.contains(talep.getReferenceCode()), "Yanıt takip kodunu döndürmüyor");
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "../../../etc/cron.d/kotu.pdf",
        "..\\..\\kotu.pdf",
        "/etc/passwd.pdf",
        "....//kotu.pdf"
    })
    @DisplayName("Ek adındaki yol parçaları dizin dışına çıkamaz")
    void yolGecisiEngellenir(String ad) throws Exception {
        mvc.perform(istek().file(ek(ad, "içerik")))
                .andExpect(status().isCreated());

        List<Path> yazilanlar = ekDizindekiler();
        assertEquals(1, yazilanlar.size(), "Beklenen tek dosya yerine: " + yazilanlar);

        Path yazilan = yazilanlar.get(0);
        assertEquals(ekDizini.normalize(), yazilan.getParent().normalize(),
                "Dosya talepler dizininin dışına yazılmış: " + yazilan);
        assertFalse(yazilan.getFileName().toString().contains(".."),
                "Ada '..' sızmış: " + yazilan.getFileName());
    }

    @Test
    @DisplayName("Ekler panel belgeleriyle aynı dizine karışmaz")
    void eklerAyriDizinde() throws Exception {
        mvc.perform(istek().file(ek("belge.pdf", "içerik"))).andExpect(status().isCreated());

        /* Ziyaretçi eki ile kurumun yayımladığı belge aynı yerde
           durmamalı: panelin belge listesi ziyaretçi dosyalarıyla
           dolar ve yanlışlıkla yayımlanabilir. */
        Path ust = Paths.get(dizinYolu);
        try (var akis = Files.list(ust)) {
            assertTrue(akis.filter(Files::isRegularFile).findAny().isEmpty(),
                    "Ek, üst dizine yazılmış");
        }
        assertEquals(1, ekDizindekiler().size());
    }

    @Test
    @DisplayName("Orijinal ad veriye yazılır ama diske geçmez")
    void orijinalAdVerideDurur() throws Exception {
        mvc.perform(istek().file(ek("Ağustos Raporu.pdf", "içerik")))
                .andExpect(status().isCreated());

        ContactTicket talep = talepler.findAll().stream()
                .filter(t -> "SINAMA talebi".equals(t.getSubject())).findFirst().orElseThrow();

        assertEquals("Ağustos Raporu.pdf", talep.getAttachmentName(),
                "Gösterim için tutulan özgün ad değişmiş");
        assertTrue(talep.getAttachmentUrl().startsWith("/dosyalar/talepler/"),
                "Ek adresi beklenen dizinde değil: " + talep.getAttachmentUrl());
        assertFalse(talep.getAttachmentUrl().contains("Ağustos"),
                "Özgün ad adrese sızmış: " + talep.getAttachmentUrl());
    }

    // ------------------------------------------------------- eksiz talep

    @Test
    @DisplayName("Ek zorunlu değildir")
    void eksizTalepKabul() throws Exception {
        mvc.perform(istek()).andExpect(status().isCreated());
        assertEquals(1, sinamaTalepSayisi());
        assertTrue(ekDizinBos(), "Eksiz talep dosya oluşturmuş");
    }

    @Test
    @DisplayName("Reddedilen ek talebi de engeller; yarım kayıt kalmaz")
    void reddedilenEkTalebiEngeller() throws Exception {
        mvc.perform(istek().file(ek("kotu.html", "<h1>x</h1>")))
                .andExpect(status().isBadRequest());

        /* Ek doğrulaması kaydetmeden ÖNCE yapılmalı. Sonra yapılsaydı,
           reddedilen her ek arkasında eksiz bir talep bırakırdı. */
        assertEquals(0, sinamaTalepSayisi(), "Reddedilen ek arkasında talep bırakmış");
    }

    // ------------------------------------------------------- yardımcılar

    private long sinamaTalepSayisi() {
        return talepler.findAll().stream()
                .filter(t -> t.getSubject() != null && t.getSubject().startsWith("SINAMA")).count();
    }

    private List<Path> ekDizindekiler() throws IOException {
        if (!Files.exists(ekDizini)) return List.of();
        try (var akis = Files.walk(ekDizini)) {
            return akis.filter(Files::isRegularFile).toList();
        }
    }

    private boolean ekDizinBos() throws IOException {
        return ekDizindekiler().isEmpty();
    }
}
