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
@RequestMapping("/api/yonetim/dosya")
public class AdminFileController {

    /** İzin verilen uzantılar. HTML ve betik dosyaları kasten dışarıda bırakıldı. */
    private static final List<String> IZINLI = List.of(
            "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
            "odt", "ods", "zip", "rar", "jpg", "jpeg", "png", "gif", "webp", "svg"
    );

    private static final long AZAMI_BOYUT = 25L * 1024 * 1024;   // 25 MB

    private final UploadedFileRepo kayitlar;
    private final Path dizin;

    public AdminFileController(UploadedFileRepo kayitlar,
                                  @Value("${bidb.dosya-dizini:/veri/dosyalar}") String dizin) {
        this.kayitlar = kayitlar;
        this.dizin = Paths.get(dizin);
    }

    @GetMapping
    public List<UploadedFile> liste() {
        return kayitlar.findAllByOrderByYuklemeDesc();
    }

    public record YuklemeSonucu(String adres, String dosyaAdi, long boyut) {}

    @PostMapping
    @Transactional
    public ResponseEntity<?> yukle(@RequestParam("dosya") MultipartFile dosya, Authentication kimlik) {
        if (dosya == null || dosya.isEmpty()) return ResponseEntity.badRequest().body("Dosya seçilmedi.");
        if (dosya.getSize() > AZAMI_BOYUT) return ResponseEntity.badRequest().body("Dosya 25 MB'den büyük olamaz.");

        String ozgunAd = Paths.get(dosya.getOriginalFilename() == null ? "belge" : dosya.getOriginalFilename())
                .getFileName().toString();
        String uzanti = uzantiAl(ozgunAd);
        if (!IZINLI.contains(uzanti)) {
            return ResponseEntity.badRequest().body("Bu dosya türüne izin verilmiyor: " + uzanti);
        }

        String ad = benzersizAd(ozgunAd, uzanti);
        try {
            Files.createDirectories(dizin);
            Path hedef = dizin.resolve(ad).normalize();
            // Dizin dışına yazmayı engelle
            if (!hedef.startsWith(dizin.normalize())) {
                return ResponseEntity.badRequest().body("Geçersiz dosya adı.");
            }
            dosya.transferTo(hedef);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Dosya kaydedilemedi: " + e.getMessage());
        }

        UploadedFile kayit = new UploadedFile();
        kayit.setDosyaAdi(ad);
        kayit.setOzgunAd(ozgunAd);
        kayit.setBoyut(dosya.getSize());
        kayit.setYukleyen(kimlik == null ? "bilinmiyor" : kimlik.getName());
        kayitlar.save(kayit);

        return ResponseEntity.ok(new YuklemeSonucu("/dosyalar/" + ad, ad, dosya.getSize()));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> sil(@PathVariable Long id) {
        return kayitlar.findById(id).map(k -> {
            try {
                Files.deleteIfExists(dizin.resolve(k.getDosyaAdi()).normalize());
            } catch (IOException e) {
                return ResponseEntity.internalServerError().body("Dosya silinemedi: " + e.getMessage());
            }
            kayitlar.delete(k);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private static String uzantiAl(String ad) {
        int i = ad.lastIndexOf('.');
        return i > 0 ? ad.substring(i + 1).toLowerCase(Locale.ROOT) : "";
    }

    /** Var olan bir dosyanın üzerine yazılmaması için ada sıra numarası eklenir. */
    private String benzersizAd(String ozgunAd, String uzanti) {
        String govde = ozgunAd.substring(0, Math.max(0, ozgunAd.length() - uzanti.length() - 1));
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
