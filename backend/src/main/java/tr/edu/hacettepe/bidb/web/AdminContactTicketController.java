package tr.edu.hacettepe.bidb.web;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tr.edu.hacettepe.bidb.model.ContactTicket;
import tr.edu.hacettepe.bidb.model.ContactTicketEvent;
import tr.edu.hacettepe.bidb.repo.ContactTicketEventRepo;
import tr.edu.hacettepe.bidb.repo.ContactTicketRepo;

import java.security.Principal;
import java.time.OffsetDateTime;
import java.util.*;

/** Yönetim panelindeki ticket listesi, atama/durum güncellemesi ve işlem geçmişi. */
@RestController
@RequestMapping("/api/admin/contact-tickets")
public class AdminContactTicketController {
    private static final Set<String> STATUSES = Set.of("NEW", "IN_PROGRESS", "WAITING", "RESOLVED", "CLOSED");
    private static final Set<String> PRIORITIES = Set.of("NORMAL", "HIGH", "URGENT");
    private final ContactTicketRepo tickets;
    private final ContactTicketEventRepo events;

    public AdminContactTicketController(ContactTicketRepo tickets, ContactTicketEventRepo events) {
        this.tickets = tickets;
        this.events = events;
    }

    public record TicketView(Long id, String referenceCode, String language, String category,
        String subject, String requesterName, String requesterEmail, String requesterPhone,
        String message, String status, String priority, String assignedTo, String adminNote,
        OffsetDateTime createdAt, OffsetDateTime updatedAt, OffsetDateTime resolvedAt) {
        static TicketView of(ContactTicket ticket) {
            return new TicketView(ticket.getId(), ticket.getReferenceCode(), ticket.getLanguage(),
                ticket.getCategory(), ticket.getSubject(), ticket.getRequesterName(),
                ticket.getRequesterEmail(), ticket.getRequesterPhone(), ticket.getMessage(),
                ticket.getStatus(), ticket.getPriority(), ticket.getAssignedTo(), ticket.getAdminNote(),
                ticket.getCreatedAt(), ticket.getUpdatedAt(), ticket.getResolvedAt());
        }
    }

    public record EventView(Long id, String eventType, String fromStatus, String toStatus,
        String note, String actor, OffsetDateTime createdAt) {
        static EventView of(ContactTicketEvent event) {
            return new EventView(event.getId(), event.getEventType(), event.getFromStatus(),
                event.getToStatus(), event.getNote(), event.getActor(), event.getCreatedAt());
        }
    }

    public record UpdateRequest(String status, String priority,
        @Size(max = 120) String assignedTo, @Size(max = 4000) String adminNote,
        @Size(max = 1000) String eventNote) {}

    @GetMapping
    public List<TicketView> list() {
        return tickets.findAllByOrderByCreatedAtDesc().stream().map(TicketView::of).toList();
    }

    @GetMapping("/{id}/events")
    public List<EventView> events(@PathVariable Long id) {
        if (!tickets.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return events.findByTicketIdOrderByCreatedAtDesc(id).stream().map(EventView::of).toList();
    }

    @PutMapping("/{id}")
    @Transactional
    public TicketView update(@PathVariable Long id, @Valid @RequestBody UpdateRequest request,
                             Principal principal) {
        ContactTicket ticket = tickets.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        String nextStatus = normalized(request.status(), STATUSES, "durum");
        String nextPriority = normalized(request.priority(), PRIORITIES, "öncelik");
        String previousStatus = ticket.getStatus();
        boolean statusChanged = !previousStatus.equals(nextStatus);

        ticket.setStatus(nextStatus);
        ticket.setPriority(nextPriority);
        ticket.setAssignedTo(blankToNull(request.assignedTo()));
        ticket.setAdminNote(blankToNull(request.adminNote()));
        ticket.setUpdatedAt(OffsetDateTime.now());
        if ("RESOLVED".equals(nextStatus) || "CLOSED".equals(nextStatus)) {
            if (ticket.getResolvedAt() == null) ticket.setResolvedAt(OffsetDateTime.now());
        } else {
            ticket.setResolvedAt(null);
        }
        tickets.save(ticket);

        if (statusChanged || (request.eventNote() != null && !request.eventNote().isBlank())) {
            ContactTicketEvent event = new ContactTicketEvent();
            event.setTicketId(ticket.getId());
            event.setEventType(statusChanged ? "STATUS_CHANGED" : "NOTE_ADDED");
            event.setFromStatus(previousStatus);
            event.setToStatus(nextStatus);
            event.setNote(blankToNull(request.eventNote()));
            event.setActor(principal == null ? "Yönetici" : principal.getName());
            events.save(event);
        }
        return TicketView.of(ticket);
    }

    private static String normalized(String value, Set<String> allowed, String field) {
        String normalized = value == null ? "" : value.toUpperCase(Locale.ROOT);
        if (!allowed.contains(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçersiz " + field);
        }
        return normalized;
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
