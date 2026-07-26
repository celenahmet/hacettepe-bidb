package tr.edu.hacettepe.bidb.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Veritabanı kısıtlarına takılan istekleri, sunucu arızası gibi değil
 * "gönderilen veri uygun değil" biçiminde yanıtlar.
 *
 * <p>Yönetim uçlarının çoğu alan uzunluklarını denetlemiyor; sütun sınırını
 * aşan bir değer (ör. 300 karakterlik başlık alanına daha uzun bir metin)
 * doğrudan veritabanına gidip <em>500 Internal Server Error</em> döndürüyordu.
 * Panelde çalışan kişi bunu bir sistem arızası sanıyor, gerçek nedeni —
 * kendi girdiğinin çok uzun olduğunu — hiçbir yerde göremiyordu. Kayıtlarda
 * da gerçek bir arıza gibi görünüyor, izlemeyi kirletiyordu.
 *
 * <p>Buradaki dönüşüm bir doğrulama yerine geçmez; alanlara özgü denetimler
 * ilgili controller'larda kalır. Bu yalnızca, kaçan durumların doğru HTTP
 * sınıfıyla ve anlaşılır bir mesajla dönmesini sağlayan ortak ağdır.
 */
@RestControllerAdvice
public class VeriHatasiIsleyici {

    private static final Logger kayit = LoggerFactory.getLogger(VeriHatasiIsleyici.class);

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> veriKisitlamasi(DataIntegrityViolationException e) {
        // Ayrıntı istemciye verilmez (tablo/sütun adları sızdırmaz), ancak
        // operatörün nedeni bulabilmesi için sunucu kaydına yazılır.
        kayit.warn("Veri kısıtlaması ihlali: {}", e.getMostSpecificCause().getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", mesaj(e)));
    }

    private static String mesaj(DataIntegrityViolationException e) {
        String neden = e.getMostSpecificCause().getMessage();
        if (neden == null) return "Gönderilen veri kaydedilemedi; alanları kontrol edin.";
        String kucuk = neden.toLowerCase();
        if (kucuk.contains("value too long") || kucuk.contains("çok uzun")) {
            return "Alanlardan biri izin verilen uzunluğu aşıyor. Lütfen kısaltıp tekrar deneyin.";
        }
        if (kucuk.contains("duplicate key") || kucuk.contains("unique")) {
            return "Bu kayıt zaten var. Aynı değeri ikinci kez ekleyemezsiniz.";
        }
        if (kucuk.contains("null value") || kucuk.contains("not-null")) {
            return "Zorunlu alanlardan biri boş bırakılmış.";
        }
        if (kucuk.contains("foreign key")) {
            return "Bağlantılı bir kayıt bulunamadı; seçimlerinizi kontrol edin.";
        }
        return "Gönderilen veri kaydedilemedi; alanları kontrol edin.";
    }
}
