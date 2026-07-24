package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

/** İletişim formundan gelen ve yönetim panelinde yaşam döngüsü izlenen talep. */
@Entity
@Table(name = "contact_ticket")
public class ContactTicket {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "reference_code", nullable = false, unique = true, length = 20)
    private String referenceCode;
    @Column(nullable = false, length = 2)
    private String language = "tr";
    @Column(nullable = false, length = 40)
    private String category;
    @Column(nullable = false, length = 160)
    private String subject;
    @Column(name = "requester_name", nullable = false, length = 120)
    private String requesterName;
    @Column(name = "requester_email", nullable = false, length = 254)
    private String requesterEmail;
    @Column(name = "requester_phone", length = 30)
    private String requesterPhone;
    @Column(nullable = false, columnDefinition = "text")
    private String message;
    @Column(nullable = false, length = 24)
    private String status = "NEW";
    @Column(nullable = false, length = 16)
    private String priority = "NORMAL";
    @Column(name = "assigned_to", length = 120)
    private String assignedTo;
    @Column(name = "admin_note", columnDefinition = "text")
    private String adminNote;
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();
    @Column(name = "resolved_at")
    private OffsetDateTime resolvedAt;

    public Long getId() { return id; }
    public String getReferenceCode() { return referenceCode; }
    public void setReferenceCode(String value) { referenceCode = value; }
    public String getLanguage() { return language; }
    public void setLanguage(String value) { language = value; }
    public String getCategory() { return category; }
    public void setCategory(String value) { category = value; }
    public String getSubject() { return subject; }
    public void setSubject(String value) { subject = value; }
    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String value) { requesterName = value; }
    public String getRequesterEmail() { return requesterEmail; }
    public void setRequesterEmail(String value) { requesterEmail = value; }
    public String getRequesterPhone() { return requesterPhone; }
    public void setRequesterPhone(String value) { requesterPhone = value; }
    public String getMessage() { return message; }
    public void setMessage(String value) { message = value; }
    public String getStatus() { return status; }
    public void setStatus(String value) { status = value; }
    public String getPriority() { return priority; }
    public void setPriority(String value) { priority = value; }
    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String value) { assignedTo = value; }
    public String getAdminNote() { return adminNote; }
    public void setAdminNote(String value) { adminNote = value; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime value) { createdAt = value; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime value) { updatedAt = value; }
    public OffsetDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(OffsetDateTime value) { resolvedAt = value; }
}
