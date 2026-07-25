package tr.edu.hacettepe.bidb.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.constraints.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import tr.edu.hacettepe.bidb.model.ContactTicket;
import tr.edu.hacettepe.bidb.model.ContactTicketEvent;
import tr.edu.hacettepe.bidb.repo.ContactTicketEventRepo;
import tr.edu.hacettepe.bidb.repo.ContactTicketRepo;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/** Ziyaretçi iletişim formu. Ham IP saklanmaz; yalnızca kısa süreli hız sınırı için bellekte tutulur. */
@RestController
@RequestMapping("/api/contact/tickets")
@Validated
public class ContactTicketController {
    private static final Set<String> CATEGORIES = Set.of(
        "GENERAL", "TECHNICAL_SUPPORT", "EMAIL", "NETWORK", "SOFTWARE",
        "EBYS", "E_SIGNATURE", "SECURITY", "WEB_SERVICES", "SUGGESTION");
    private static final char[] CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".toCharArray();
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final long WINDOW_SECONDS = 600;
    private static final int WINDOW_LIMIT = 5;

    /** Ek dosyalarda izin verilen biçimler; HTML ve betik dosyaları kasten dışarıda bırakıldı
     *  (bkz. AdminFileController'daki aynı yaklaşım). */
    private static final Set<String> EK_IZINLI_UZANTI = Set.of("pdf", "jpg", "jpeg", "png", "docx");
    private static final long EK_AZAMI_BOYUT = 10L * 1024 * 1024; // 10 MB

    private final ContactTicketRepo tickets;
    private final ContactTicketEventRepo events;
    private final Path ekDizini;
    private final Map<String, Deque<Instant>> attempts = new ConcurrentHashMap<>();

    public ContactTicketController(ContactTicketRepo tickets, ContactTicketEventRepo events,
                                    @Value("${bidb.dosya-dizini:/veri/dosyalar}") String dosyaDizini) {
        this.tickets = tickets;
        this.events = events;
        // Panelden yönetilen belgelerle aynı paylaşılan birim kullanılır, ancak
        // ziyaretçi ekleri ayrı bir alt klasörde durur; admin dosya listesine karışmaz.
        this.ekDizini = Paths.get(dosyaDizini).resolve("talepler");
    }

    public record CreateResponse(String referenceCode, String status, Instant receivedAt) {}

    @PostMapping(consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    public CreateResponse create(
            @RequestParam @NotBlank @Size(max = 2) String language,
            @RequestParam @NotBlank @Size(max = 40) String category,
            @RequestParam @NotBlank @Size(min = 5, max = 160) String subject,
            @RequestParam @NotBlank @Size(min = 2, max = 120) String name,
            @RequestParam @NotBlank @Email @Size(max = 254) String email,
            @RequestParam @NotBlank @Size(min = 7, max = 30)
            @Pattern(regexp = "^[0-9+()\\-.\\s]+$", message = "Telefon numarası yalnızca rakam ve yaygın ayraçlar içerebilir.")
            String phone,
            @RequestParam @NotBlank @Size(min = 20, max = 5000) String message,
            @RequestParam(required = false, defaultValue = "") @Size(max = 0) String website,
            @RequestParam(name = "attachment", required = false) MultipartFile attachment,
            HttpServletRequest servletRequest) {
        rateLimit(clientAddress(servletRequest));
        String languageNormalized = language.toLowerCase(Locale.ROOT);
        if (!Set.of("tr", "en").contains(languageNormalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Desteklenmeyen dil");
        }
        String categoryNormalized = category.toUpperCase(Locale.ROOT);
        if (!CATEGORIES.contains(categoryNormalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçersiz talep kategorisi");
        }

        String referenceCode = newReferenceCode();
        ContactTicket ticket = new ContactTicket();
        ticket.setReferenceCode(referenceCode);
        ticket.setLanguage(languageNormalized);
        ticket.setCategory(categoryNormalized);
        ticket.setSubject(clean(subject));
        ticket.setRequesterName(clean(name));
        ticket.setRequesterEmail(email.trim().toLowerCase(Locale.ROOT));
        ticket.setRequesterPhone(clean(phone));
        ticket.setMessage(message.trim());

        if (attachment != null && !attachment.isEmpty()) {
            AttachmentInfo ek = ekKaydet(attachment, referenceCode);
            ticket.setAttachmentUrl(ek.url());
            ticket.setAttachmentName(ek.originalName());
            ticket.setAttachmentSizeBytes(ek.sizeBytes());
        }

        ticket = tickets.save(ticket);

        ContactTicketEvent event = new ContactTicketEvent();
        event.setTicketId(ticket.getId());
        event.setEventType("CREATED");
        event.setToStatus("NEW");
        event.setActor("Ziyaretçi");
        events.save(event);
        return new CreateResponse(ticket.getReferenceCode(), ticket.getStatus(), ticket.getCreatedAt().toInstant());
    }

    // @RequestParam üzerindeki kısıt ihlalleri (@NotBlank, @Size, @Email vb.),
    // @RequestBody + @Valid'in aksine, varsayılan olarak yakalanmadan 500'e
    // düşer. Eksik/hatalı alanlarda ziyaretçiye düzgün bir 400 dönülür.
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> gecersizAlan(ConstraintViolationException e) {
        return ResponseEntity.badRequest().body(Map.of("message", "Gönderilen bilgiler eksik veya hatalı."));
    }

    private record AttachmentInfo(String url, String originalName, long sizeBytes) {}

    private AttachmentInfo ekKaydet(MultipartFile dosya, String referenceCode) {
        if (dosya.getSize() > EK_AZAMI_BOYUT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ek dosya 10 MB'den büyük olamaz.");
        }
        String originalName = Paths.get(dosya.getOriginalFilename() == null ? "ek" : dosya.getOriginalFilename())
            .getFileName().toString();
        String uzanti = uzantiAl(originalName);
        if (!EK_IZINLI_UZANTI.contains(uzanti)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bu dosya türüne izin verilmiyor: " + uzanti);
        }
        // Takip kodu zaten benzersiz olduğundan, dosya adı olarak kullanılması
        // çakışmayı önler; orijinal ad yalnızca görüntülemede kullanılır.
        String dosyaAdi = referenceCode.toLowerCase(Locale.ROOT) + "." + uzanti;
        try {
            Files.createDirectories(ekDizini);
            Path hedef = ekDizini.resolve(dosyaAdi).normalize();
            if (!hedef.startsWith(ekDizini.normalize())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçersiz dosya adı.");
            }
            dosya.transferTo(hedef);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Ek dosya kaydedilemedi.");
        }
        return new AttachmentInfo("/dosyalar/talepler/" + dosyaAdi, originalName, dosya.getSize());
    }

    private void rateLimit(String address) {
        Instant now = Instant.now();
        Deque<Instant> entries = attempts.computeIfAbsent(address, ignored -> new ArrayDeque<>());
        synchronized (entries) {
            while (!entries.isEmpty() && entries.peekFirst().isBefore(now.minusSeconds(WINDOW_SECONDS))) {
                entries.removeFirst();
            }
            if (entries.size() >= WINDOW_LIMIT) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Kısa sürede çok sayıda talep gönderdiniz. Lütfen daha sonra tekrar deneyin.");
            }
            entries.addLast(now);
        }
        if (attempts.size() > 10_000) {
            Instant threshold = now.minusSeconds(WINDOW_SECONDS);
            attempts.entrySet().removeIf(entry -> {
                Instant last = entry.getValue().peekLast();
                return last == null || last.isBefore(threshold);
            });
        }
    }

    private String clientAddress(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) return forwarded.split(",")[0].trim();
        return Optional.ofNullable(request.getRemoteAddr()).orElse("unknown");
    }

    private String newReferenceCode() {
        String code;
        do {
            StringBuilder value = new StringBuilder("BIDB-");
            for (int i = 0; i < 8; i++) value.append(CODE_CHARS[RANDOM.nextInt(CODE_CHARS.length)]);
            code = value.toString();
        } while (tickets.existsByReferenceCode(code));
        return code;
    }

    private static String uzantiAl(String name) {
        int i = name.lastIndexOf('.');
        return i > 0 ? name.substring(i + 1).toLowerCase(Locale.ROOT) : "";
    }

    private static String clean(String value) { return value.trim().replaceAll("\\s+", " "); }
}
