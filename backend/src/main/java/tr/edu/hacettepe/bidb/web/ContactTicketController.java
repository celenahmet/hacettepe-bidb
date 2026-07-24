package tr.edu.hacettepe.bidb.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tr.edu.hacettepe.bidb.model.ContactTicket;
import tr.edu.hacettepe.bidb.model.ContactTicketEvent;
import tr.edu.hacettepe.bidb.repo.ContactTicketEventRepo;
import tr.edu.hacettepe.bidb.repo.ContactTicketRepo;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/** Ziyaretçi iletişim formu. Ham IP saklanmaz; yalnızca kısa süreli hız sınırı için bellekte tutulur. */
@RestController
@RequestMapping("/api/contact/tickets")
public class ContactTicketController {
    private static final Set<String> CATEGORIES = Set.of(
        "GENERAL", "TECHNICAL_SUPPORT", "EMAIL", "NETWORK", "SOFTWARE",
        "EBYS", "E_SIGNATURE", "SECURITY", "WEB_SERVICES", "SUGGESTION");
    private static final char[] CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".toCharArray();
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final long WINDOW_SECONDS = 600;
    private static final int WINDOW_LIMIT = 5;

    private final ContactTicketRepo tickets;
    private final ContactTicketEventRepo events;
    private final Map<String, Deque<Instant>> attempts = new ConcurrentHashMap<>();

    public ContactTicketController(ContactTicketRepo tickets, ContactTicketEventRepo events) {
        this.tickets = tickets;
        this.events = events;
    }

    public record CreateRequest(
        @NotBlank @Size(max = 2) String language,
        @NotBlank @Size(max = 40) String category,
        @NotBlank @Size(min = 5, max = 160) String subject,
        @NotBlank @Size(min = 2, max = 120) String name,
        @NotBlank @Email @Size(max = 254) String email,
        @Size(max = 30) String phone,
        @NotBlank @Size(min = 20, max = 5000) String message,
        @Size(max = 0) String website
    ) {}

    public record CreateResponse(String referenceCode, String status, Instant receivedAt) {}

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreateResponse create(@Valid @RequestBody CreateRequest request, HttpServletRequest servletRequest) {
        rateLimit(clientAddress(servletRequest));
        String language = request.language().toLowerCase(Locale.ROOT);
        if (!Set.of("tr", "en").contains(language)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Desteklenmeyen dil");
        }
        String category = request.category().toUpperCase(Locale.ROOT);
        if (!CATEGORIES.contains(category)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçersiz talep kategorisi");
        }

        ContactTicket ticket = new ContactTicket();
        ticket.setReferenceCode(newReferenceCode());
        ticket.setLanguage(language);
        ticket.setCategory(category);
        ticket.setSubject(clean(request.subject()));
        ticket.setRequesterName(clean(request.name()));
        ticket.setRequesterEmail(request.email().trim().toLowerCase(Locale.ROOT));
        ticket.setRequesterPhone(blankToNull(request.phone()));
        ticket.setMessage(request.message().trim());
        ticket = tickets.save(ticket);

        ContactTicketEvent event = new ContactTicketEvent();
        event.setTicketId(ticket.getId());
        event.setEventType("CREATED");
        event.setToStatus("NEW");
        event.setActor("Ziyaretçi");
        events.save(event);
        return new CreateResponse(ticket.getReferenceCode(), ticket.getStatus(), ticket.getCreatedAt().toInstant());
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

    private static String clean(String value) { return value.trim().replaceAll("\\s+", " "); }
    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
