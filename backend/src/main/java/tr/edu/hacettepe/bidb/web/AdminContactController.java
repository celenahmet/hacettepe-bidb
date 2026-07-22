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

    public record ChannelRequest(String language, String type, String label,
                                 String value, int sortOrder, boolean published) {

        ContactChannel apply(ContactChannel c) {
            c.setLanguage(language == null || language.isBlank() ? "tr" : language);
            c.setType(type);
            c.setLabel(label);
            c.setValue(value);
            c.setSortOrder(sortOrder);
            c.setPublished(published);
            return c;
        }
    }

    @PostMapping
    @Transactional
    public ContactChannel create(@RequestBody ChannelRequest request) {
        return channels.save(request.apply(new ContactChannel()));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ContactChannel> update(@PathVariable Long id, @RequestBody ChannelRequest request) {
        return channels.findById(id)
                .map(c -> ResponseEntity.ok(channels.save(request.apply(c))))
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
