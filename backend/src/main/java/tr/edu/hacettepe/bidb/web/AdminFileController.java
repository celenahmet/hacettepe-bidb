package tr.edu.hacettepe.bidb.web;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tr.edu.hacettepe.bidb.model.UploadedFile;
import tr.edu.hacettepe.bidb.repo.UploadedFileRepo;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Locale;

/**
 * Belge yükleme.
 *
 * Dosyalar, ön yüz ile paylaşılan bir dizine yazılır ve site üzerinde
 * /dosyalar/... adresinden sunulur. Yalnızca belge biçimlerine izin verilir;
 * çalıştırılabilir veya betik dosyaları kabul edilmez.
 */
@RestController
@RequestMapping("/api/admin/files")
public class AdminFileController {

    /** İzin verilen uzantılar. HTML ve betik dosyaları kasten dışarıda bırakıldı.
     *  SVG de aynı gerekçeyle dışarıda: içine gömülü <script> barındırabilir ve
     *  dosyanın adresine doğrudan gidildiğinde (bir <img> içinde değil, üst
     *  belge olarak açıldığında) bu betik çalışır — CSP'deki script-src 'self'
     *  bunu engellemez, çünkü dosya zaten aynı kaynaktan sunulur. */
    private static final List<String> IZINLI = List.of(
            "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
            "odt", "ods", "zip", "rar", "jpg", "jpeg", "png", "gif", "webp"
    );

    private static final long AZAMI_BOYUT = 25L * 1024 * 1024;   // 25 MB

    private final UploadedFileRepo kayitlar;
    private final Path dizin;

    /* Varsayılan "/veri/fileslar" yazıyordu: Türkçe tanımlayıcıların
       İngilizceye çevrildiği geçişte "dosya"→"file" değişimi bu dizin
       ADINA da uygulanmış. Yayında etkisi yoktu — application.yml
       özelliği her zaman tanımlıyor — ama özellik verilmediğinde bu
       denetleyici ContactTicketController'dan BAŞKA bir dizine yazardı
       ve panelden yüklenen belgeler ön yüzün sunduğu yerde çıkmazdı. */
    public AdminFileController(UploadedFileRepo kayitlar,
                                  @Value("${bidb.dosya-dizini:/veri/dosyalar}") String dizin) {
        this.kayitlar = kayitlar;
        this.dizin = Paths.get(dizin);
    }

    @GetMapping
    public List<UploadedFile> liste() {
        return kayitlar.findAllByOrderByUploadedAtDesc();
    }

    public record YuklemeSonucu(String url, String fileName, long sizeBytes) {}

    @PostMapping
    @Transactional
    public ResponseEntity<?> yukle(@RequestParam("dosya") MultipartFile dosya, Authentication kimlik) {
        if (dosya == null || dosya.isEmpty()) return ResponseEntity.badRequest().body("Dosya seçilmedi.");
        if (dosya.getSize() > AZAMI_BOYUT) return ResponseEntity.badRequest().body("Dosya 25 MB'den büyük olamaz.");

        String originalName = Paths.get(dosya.getOriginalFilename() == null ? "belge" : dosya.getOriginalFilename())
                .getFileName().toString();
        String uzanti = uzantiAl(originalName);
        if (!IZINLI.contains(uzanti)) {
            return ResponseEntity.badRequest().body("Bu dosya türüne izin verilmiyor: " + uzanti);
        }

        String name = benzersizAd(originalName, uzanti);
        try {
            Files.createDirectories(dizin);
            Path hedef = dizin.resolve(name).normalize();
            // Dizin dışına yazmayı engelle
            if (!hedef.startsWith(dizin.normalize())) {
                return ResponseEntity.badRequest().body("Geçersiz dosya adı.");
            }
            dosya.transferTo(hedef);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Dosya kaydedilemedi: " + e.getMessage());
        }

        UploadedFile kayit = new UploadedFile();
        kayit.setFileName(name);
        kayit.setOriginalName(originalName);
        kayit.setSizeBytes(dosya.getSize());
        kayit.setUploadedBy(kimlik == null ? "bilinmiyor" : kimlik.getName());
        kayitlar.save(kayit);

        return ResponseEntity.ok(new YuklemeSonucu("/dosyalar/" + name, name, dosya.getSize()));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> sil(@PathVariable Long id) {
        return kayitlar.findById(id).map(k -> {
            try {
                Files.deleteIfExists(dizin.resolve(k.getFileName()).normalize());
            } catch (IOException e) {
                return ResponseEntity.internalServerError().body("Dosya silinemedi: " + e.getMessage());
            }
            kayitlar.delete(k);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private static String uzantiAl(String name) {
        int i = name.lastIndexOf('.');
        return i > 0 ? name.substring(i + 1).toLowerCase(Locale.ROOT) : "";
    }

    /** Var olan bir dosyanın üzerine yazılmaması için ada sıra numarası eklenir. */
    private String benzersizAd(String originalName, String uzanti) {
        String govde = originalName.substring(0, Math.max(0, originalName.length() - uzanti.length() - 1));
        govde = govde.toLowerCase(Locale.forLanguageTag("tr"))
                .replace("ı", "i").replace("ğ", "g").replace("ü", "u")
                .replace("ş", "s").replace("ö", "o").replace("ç", "c")
                .replaceAll("[^a-z0-9-]+", "-").replaceAll("-{2,}", "-").replaceAll("^-|-$", "");
        if (govde.isBlank()) govde = "belge";

        String aday = govde + "." + uzanti;
        int n = 2;
        while (Files.exists(dizin.resolve(aday))) {
            aday = govde + "-" + n++ + "." + uzanti;
        }
        return aday;
    }
}
