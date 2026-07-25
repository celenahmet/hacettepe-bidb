package tr.edu.hacettepe.bidb.web;

import org.springframework.data.domain.Limit;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tr.edu.hacettepe.bidb.model.AdminAuditEvent;
import tr.edu.hacettepe.bidb.repo.AdminAuditEventRepo;

import java.time.OffsetDateTime;
import java.util.List;

/** Yönetim panelinde yapılan değişiklik işlemlerinin denetim kaydı. */
@RestController
@RequestMapping("/api/admin/audit-events")
public class AdminAuditEventController {
    private final AdminAuditEventRepo depo;

    public AdminAuditEventController(AdminAuditEventRepo depo) {
        this.depo = depo;
    }

    public record AuditEventView(
            Long id, OffsetDateTime occurredAt, String sessionId, String attemptedUsername,
            String ipAddress, String localIpAddress, String httpMethod, String resourcePath,
            String actionLabel, int httpStatus, boolean successful) {
        static AuditEventView of(AdminAuditEvent e) {
            return new AuditEventView(e.getId(), e.getOccurredAt(), e.getSessionId(), e.getAttemptedUsername(),
                    e.getIpAddress(), e.getLocalIpAddress(), e.getHttpMethod(), e.getResourcePath(),
                    e.getActionLabel(), e.getHttpStatus(), e.isSuccessful());
        }
    }

    @GetMapping
    public List<AuditEventView> liste() {
        return depo.findAllByOrderByOccurredAtDesc(Limit.of(300)).stream().map(AuditEventView::of).toList();
    }
}
