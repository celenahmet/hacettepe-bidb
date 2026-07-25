package tr.edu.hacettepe.bidb.web;

import org.springframework.data.domain.Limit;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tr.edu.hacettepe.bidb.model.AdminLoginEvent;
import tr.edu.hacettepe.bidb.repo.AdminLoginEventRepo;

import java.time.OffsetDateTime;
import java.util.List;

/** Yönetim paneline yapılan giriş denemelerinin kaydı (güvenlik denetimi). */
@RestController
@RequestMapping("/api/admin/login-events")
public class AdminLoginEventController {
    private final AdminLoginEventRepo depo;

    public AdminLoginEventController(AdminLoginEventRepo depo) {
        this.depo = depo;
    }

    public record LoginEventView(
            Long id, OffsetDateTime occurredAt, boolean successful, String attemptedUsername,
            String ipAddress, String localIpAddress, String deviceClass, String browser, String operatingSystem,
            String city, String country) {
        static LoginEventView of(AdminLoginEvent e) {
            return new LoginEventView(e.getId(), e.getOccurredAt(), e.isSuccessful(), e.getAttemptedUsername(),
                    e.getIpAddress(), e.getLocalIpAddress(), e.getDeviceClass(), e.getBrowser(), e.getOperatingSystem(),
                    e.getCity(), e.getCountry());
        }
    }

    @GetMapping
    public List<LoginEventView> liste() {
        return depo.findAllByOrderByOccurredAtDesc(Limit.of(200)).stream().map(LoginEventView::of).toList();
    }
}
