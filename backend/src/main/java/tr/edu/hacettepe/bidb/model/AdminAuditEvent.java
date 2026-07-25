package tr.edu.hacettepe.bidb.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

/** Yönetim panelinde yapılan bir değişiklik işleminin denetim kaydı. */
@Entity
@Table(name = "admin_audit_event")
public class AdminAuditEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "occurred_at", nullable = false)
    private OffsetDateTime occurredAt = OffsetDateTime.now();

    @Column(name = "session_id", nullable = false, length = 64)
    private String sessionId;

    @Column(name = "attempted_username", length = 120)
    private String attemptedUsername;

    @Column(name = "ip_address", nullable = false, length = 64)
    private String ipAddress;

    @Column(name = "local_ip_address", length = 64)
    private String localIpAddress;

    @Column(name = "http_method", nullable = false, length = 10)
    private String httpMethod;

    @Column(name = "resource_path", nullable = false, length = 200)
    private String resourcePath;

    @Column(name = "action_label", nullable = false, length = 160)
    private String actionLabel;

    @Column(name = "http_status", nullable = false)
    private int httpStatus;

    @Column(nullable = false)
    private boolean successful;

    public Long getId() { return id; }
    public OffsetDateTime getOccurredAt() { return occurredAt; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getAttemptedUsername() { return attemptedUsername; }
    public void setAttemptedUsername(String attemptedUsername) { this.attemptedUsername = attemptedUsername; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getLocalIpAddress() { return localIpAddress; }
    public void setLocalIpAddress(String localIpAddress) { this.localIpAddress = localIpAddress; }
    public String getHttpMethod() { return httpMethod; }
    public void setHttpMethod(String httpMethod) { this.httpMethod = httpMethod; }
    public String getResourcePath() { return resourcePath; }
    public void setResourcePath(String resourcePath) { this.resourcePath = resourcePath; }
    public String getActionLabel() { return actionLabel; }
    public void setActionLabel(String actionLabel) { this.actionLabel = actionLabel; }
    public int getHttpStatus() { return httpStatus; }
    public void setHttpStatus(int httpStatus) { this.httpStatus = httpStatus; }
    public boolean isSuccessful() { return successful; }
    public void setSuccessful(boolean successful) { this.successful = successful; }
}
