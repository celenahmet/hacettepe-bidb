package tr.edu.hacettepe.bidb.web;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.model.ContactChannel;
import tr.edu.hacettepe.bidb.repo.ContactChannelRepo;

import java.util.List;

/**
 * İletişim bilgileri yönetimi.
 *
 * Her telefon, e-posta ve adres kendi kaydıdır; biçimlendirme veriye
 * karışmaz. Sıralama ve etiket kayıt başına verilir.
 */
@RestController
@RequestMapping("/api/admin/contact-channels")
public class AdminContactController {

    private final ContactChannelRepo channels;

    public AdminContactController(ContactChannelRepo channels) {
        this.channels = channels;
    }

    @GetMapping
    public List<ContactChannel> list() {
        return channels.findAllByOrderByLanguageAscTypeAscSortOrderAsc();
    }

    private static final java.util.Set<String> GECERLI_TURLER = java.util.Set.of(
            ContactChannel.ADRES, ContactChannel.TELEFON, ContactChannel.EPOSTA, ContactChannel.FAKS);

    public record ChannelRequest(String language, String type, String label,
                                 String value, int sortOrder, boolean published) {

        ContactChannel apply(ContactChannel c) {
            c.setLanguage(language == null || language.isBlank() ? "tr" : language);
            c.setType(type);
            c.setLabel(label == null || label.isBlank() ? null : label.trim());
            c.setValue(value.trim());
            c.setSortOrder(sortOrder);
            c.setPublished(published);
            return c;
        }
    }

    /** DB kısıtlarına (NOT NULL, CHECK type) çarpıp çirkin bir 500 dönmeden önce temiz bir 400 verir. */
    private static String dogrulamaHatasi(ChannelRequest request) {
        if (request.type() == null || !GECERLI_TURLER.contains(request.type())) {
            return "Geçersiz kanal türü; adres, telefon, e-posta veya faks olmalı.";
        }
        if (request.value() == null || request.value().isBlank()) return "Değer boş olamaz.";
        if (ContactChannel.EPOSTA.equals(request.type())
                && !request.value().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            return "Geçerli bir e-posta adresi girin.";
        }
        if ((ContactChannel.TELEFON.equals(request.type()) || ContactChannel.FAKS.equals(request.type()))
                && !request.value().matches("^[0-9+()\\-.\\s]+$")) {
            return "Telefon/faks yalnızca rakam ve yaygın ayraçlar içerebilir.";
        }
        return null;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> create(@RequestBody ChannelRequest request) {
        String hata = dogrulamaHatasi(request);
        if (hata != null) return ResponseEntity.badRequest().body(hata);
        return ResponseEntity.ok(channels.save(request.apply(new ContactChannel())));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ChannelRequest request) {
        String hata = dogrulamaHatasi(request);
        if (hata != null) return ResponseEntity.badRequest().body(hata);
        return channels.findById(id)
                .map(c -> ResponseEntity.ok((Object) channels.save(request.apply(c))))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!channels.existsById(id)) return ResponseEntity.notFound().build();
        channels.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
