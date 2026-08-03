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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import tr.edu.hacettepe.bidb.VeritabaniTemeli;
import tr.edu.hacettepe.bidb.repo.UploadedFileRepo;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Panelden belge yükleme.
 *
 * NEDEN BU TEST VAR
 *
 * Yüklenen dosyalar site üzerinde /dosyalar/... adresinden AYNI KAYNAKTAN
 * sunuluyor. Bu, dosya türü denetimini bir güvenlik sınırı hâline getirir:
 * oraya konan bir .html ya da .svg, üst belge olarak açıldığında kendi
 * betiğini çalıştırır ve CSP'deki script-src 'self' bunu engellemez —
 * dosya zaten "self"tir. Panel oturumu da aynı kaynakta olduğu için
 * sonucu oturumun ele geçirilmesine kadar gider.
 *
 * Denetimin gevşemesi sessizdir: yükleme çalışmaya devam eder, panelde
 * hiçbir şey değişmez. Bu yüzden yalnızca "izinli tür kabul ediliyor mu"
 * değil, "yasak tür GERÇEKTEN reddediliyor mu" da sınanır.
 *
 * Testler kendi dosyalarını yazar ve siler; var olan belgelere dokunmaz.
 */
@SpringBootTest
@ActiveProfiles("test")
@Import(VeritabaniTemeli.class)
@WithMockUser(username = "sinama-yonetici")
class DosyaYuklemeTest {

    @Autowired private WebApplicationContext baglam;
    @Autowired private UploadedFileRepo kayitlar;

    @Value("${bidb.dosya-dizini}")
    private String dizinYolu;

    private MockMvc mvc;
    private Path dizin;

    @BeforeEach
    void hazirla() {
        mvc = MockMvcBuilders.webAppContextSetup(baglam).apply(springSecurity()).build();
        dizin = Paths.get(dizinYolu);
        temizle();
    }

    @AfterEach
    void temizle() {
        kayitlar.deleteAll();
        if (Files.exists(dizin)) {
            try (var akis = Files.walk(dizin)) {
                akis.sorted(Comparator.reverseOrder())
                    .filter(p -> !p.equals(dizin))
                    .forEach(p -> { try { Files.deleteIfExists(p); } catch (IOException ignored) { } });
            } catch (IOException ignored) { }
        }
    }

    private MockMultipartFile dosya(String ad, String icerik) {
        return new MockMultipartFile("dosya", ad, null, icerik.getBytes(StandardCharsets.UTF_8));
    }

    // ------------------------------------------------------- yasak türler

    @ParameterizedTest(name = "{0} reddedilir")
    @ValueSource(strings = {
        "kotu.html", "kotu.htm", "kotu.svg", "kotu.js", "kotu.mjs",
        "kotu.php", "kotu.jsp", "kotu.exe", "kotu.sh", "kotu.bat",
        "kotu.jar", "kotu.xhtml"
    })
    @DisplayName("Çalıştırılabilir ve betik barındırabilen türler reddedilir")
    void yasakTurlerRet(String ad) throws Exception {
        mvc.perform(multipart("/api/admin/files").file(dosya(ad, "<script>alert(1)</script>")))
                .andExpect(status().isBadRequest());

        assertEquals(0, kayitlar.count(), ad + " için kayıt oluşmuş");
        assertTrue(dizinBos(), ad + " diske yazılmış");
    }

    @Test
    @DisplayName("Uzantısız dosya reddedilir")
    void uzantisizRet() throws Exception {
        mvc.perform(multipart("/api/admin/files").file(dosya("uzantisiz", "veri")))
                .andExpect(status().isBadRequest());
        assertTrue(dizinBos());
    }

    @Test
    @DisplayName("Gizli dosya adı (.pdf) uzantı sayılmaz")
    void gizliDosyaRet() throws Exception {
        /* ".pdf" bir uzantı değil, noktayla başlayan bir addır. Uzantı
           çıkarımı buna izin verseydi, ".htaccess" gibi adlar da uzantısı
           "htaccess" sanılıp değerlendirilirdi. */
        mvc.perform(multipart("/api/admin/files").file(dosya(".pdf", "veri")))
                .andExpect(status().isBadRequest());
        assertTrue(dizinBos());
    }

    @Test
    @DisplayName("Çift uzantıda SON uzantı değerlendirilir")
    void ciftUzantiSonaBakar() throws Exception {
        // "rapor.pdf.html" bir HTML dosyasıdır; adının içinde .pdf geçmesi
        // onu belge yapmaz.
        mvc.perform(multipart("/api/admin/files").file(dosya("rapor.pdf.html", "<h1>x</h1>")))
                .andExpect(status().isBadRequest());
        assertTrue(dizinBos());
    }

    // ------------------------------------------------------- izinli türler

    @ParameterizedTest(name = "{0} kabul edilir")
    @ValueSource(strings = { "belge.pdf", "tablo.xlsx", "sunum.pptx", "gorsel.png", "arsiv.zip" })
    @DisplayName("Belge türleri kabul edilir")
    void izinliTurlerKabul(String ad) throws Exception {
        /* Karşı denetim: "her şeyi reddet" de yukarıdaki testleri
           geçirirdi. */
        mvc.perform(multipart("/api/admin/files").file(dosya(ad, "içerik")))
                .andExpect(status().isOk());
        assertEquals(1, kayitlar.count(), ad + " kaydedilmemiş");
    }

    @Test
    @DisplayName("Uzantı denetimi harf büyüklüğüne takılmaz")
    void uzantiBuyukHarf() throws Exception {
        mvc.perform(multipart("/api/admin/files").file(dosya("BELGE.PDF", "içerik")))
                .andExpect(status().isOk());

        /* Ters yön daha önemli: büyük harfle yazılan yasak uzantı
           denetimden kaçmamalı. */
        mvc.perform(multipart("/api/admin/files").file(dosya("KOTU.HTML", "<h1>x</h1>")))
                .andExpect(status().isBadRequest());
    }

    // ------------------------------------------------------- ad ve yol

    @ParameterizedTest
    @ValueSource(strings = {
        "../../../etc/cron.d/kotu.pdf",
        "..\\..\\windows\\kotu.pdf",
        "/etc/passwd.pdf",
        "....//....//kotu.pdf"
    })
    @DisplayName("Dosya adındaki yol parçaları dizin dışına çıkamaz")
    void yolGecisiEngellenir(String ad) throws Exception {
        mvc.perform(multipart("/api/admin/files").file(dosya(ad, "içerik")))
                .andExpect(status().isOk());

        /* İstek reddedilmek zorunda değil — ad temizlenip dizin içinde
           kalması yeterli. Sınanan şu: dizinin DIŞINDA hiçbir şey
           oluşmamalı ve yazılan ad yol ayracı içermemeli. */
        List<Path> yazilanlar = dizindekiler();
        assertEquals(1, yazilanlar.size(), "Beklenen tek dosya yerine: " + yazilanlar);

        Path yazilan = yazilanlar.get(0);
        assertTrue(yazilan.normalize().startsWith(dizin.normalize()),
                "Dosya dizin dışına yazılmış: " + yazilan);
        assertEquals(dizin.normalize(), yazilan.getParent().normalize(),
                "Dosya alt dizine kaçmış: " + yazilan);
        assertFalse(yazilan.getFileName().toString().contains(".."),
                "Ada '..' sızmış: " + yazilan.getFileName());
    }

    @Test
    @DisplayName("Türkçe karakterli ad, adres için güvenli hâle getirilir")
    void turkceAdTemizlenir() throws Exception {
        String yanit = mvc.perform(multipart("/api/admin/files")
                        .file(dosya("IŞIK Kılavuzu ÖĞÜT.pdf", "içerik")))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        /* Türkçe küçültme tuzağı burada da geçerli: "I" harfi Türkçe
           kurala göre "ı" olur. Ad temizliği bunu "i"ye çevirmezse
           dosya adında adres için geçersiz bir karakter kalırdı. */
        assertTrue(yanit.contains("isik"), "Türkçe büyük I doğru çevrilmemiş: " + yanit);
        assertFalse(yanit.matches(".*[^\\x20-\\x7e].*"),
                "Dosya adında ASCII dışı karakter kalmış: " + yanit);

        String ad = dizindekiler().get(0).getFileName().toString();
        assertTrue(ad.matches("[a-z0-9.-]+"), "Dosya adı beklenen düzende değil: " + ad);
    }

    @Test
    @DisplayName("Aynı adla ikinci yükleme öncekinin üzerine yazmaz")
    void ayniAdUzerineYazmaz() throws Exception {
        mvc.perform(multipart("/api/admin/files").file(dosya("rapor.pdf", "BİRİNCİ")))
                .andExpect(status().isOk());
        mvc.perform(multipart("/api/admin/files").file(dosya("rapor.pdf", "İKİNCİ")))
                .andExpect(status().isOk());

        List<Path> yazilanlar = dizindekiler();
        assertEquals(2, yazilanlar.size(), "İkinci yükleme birincinin üzerine yazmış");

        boolean birinciDuruyor = yazilanlar.stream().anyMatch(p -> {
            try { return Files.readString(p).equals("BİRİNCİ"); }
            catch (IOException e) { return false; }
        });
        assertTrue(birinciDuruyor, "Önceki belgenin içeriği kaybolmuş");
    }

    @Test
    @DisplayName("Yüklenen içerik diske olduğu gibi yazılır")
    void icerikBozulmaz() throws Exception {
        String icerik = "Hacettepe Üniversitesi — sınama içeriği ÇĞİÖŞÜ";
        mvc.perform(multipart("/api/admin/files").file(dosya("belge.pdf", icerik)))
                .andExpect(status().isOk());

        assertEquals(icerik, Files.readString(dizindekiler().get(0)),
                "Diske yazılan içerik gönderilenden farklı");
    }

    @Test
    @DisplayName("Boş dosya reddedilir")
    void bosDosyaRet() throws Exception {
        mvc.perform(multipart("/api/admin/files").file(dosya("bos.pdf", "")))
                .andExpect(status().isBadRequest());
        assertTrue(dizinBos());
    }

    // ------------------------------------------------------- yardımcılar

    private List<Path> dizindekiler() throws IOException {
        if (!Files.exists(dizin)) return List.of();
        try (var akis = Files.walk(dizin)) {
            return akis.filter(Files::isRegularFile).toList();
        }
    }

    private boolean dizinBos() throws IOException {
        return dizindekiler().isEmpty();
    }
}
