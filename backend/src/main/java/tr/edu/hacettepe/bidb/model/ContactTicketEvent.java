package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

/** Bir ticket üzerinde yapılan yönetim işleminin değiştirilemez geçmiş kaydı. */
@Entity
@Table(name = "contact_ticket_event")
public class ContactTicketEvent {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "ticket_id", nullable = false)
    private Long ticketId;
    @Column(name = "event_type", nullable = false, length = 24)
    private String eventType;
    @Column(name = "from_status", length = 24)
    private String fromStatus;
    @Column(name = "to_status", length = 24)
    private String toStatus;
    @Column(columnDefinition = "text")
    private String note;
    @Column(nullable = false, length = 120)
    private String actor;
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Long getId() { return id; }
    public Long getTicketId() { return ticketId; }
    public void setTicketId(Long value) { ticketId = value; }
    public String getEventType() { return eventType; }
    public void setEventType(String value) { eventType = value; }
    public String getFromStatus() { return fromStatus; }
    public void setFromStatus(String value) { fromStatus = value; }
    public String getToStatus() { return toStatus; }
    public void setToStatus(String value) { toStatus = value; }
    public String getNote() { return note; }
    public void setNote(String value) { note = value; }
    public String getActor() { return actor; }
    public void setActor(String value) { actor = value; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime value) { createdAt = value; }
}
