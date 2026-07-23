package tr.edu.hacettepe.bidb.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.model.AnalyticsPageView;
import tr.edu.hacettepe.bidb.repo.AnalyticsPageViewRepo;

import java.util.Set;

/**
 * Kişisel veri içermeyen sayfa görüntüleme kaydı.
 *
 * Tam referrer veya cihaz bilgisi alınmaz; tarayıcı yalnızca önceden tanımlı
 * kaba sınıfları yollar. Böylece aylık içerik raporu kullanıcı profili
 * oluşturmadan üretilebilir.
 */
@RestController
@RequestMapping("/api/metrics/page-view")
public class AnalyticsController {
    private static final Set<String> DEVICES = Set.of("mobile", "tablet", "desktop");
    private static final Set<String> REFERRERS = Set.of("direct", "internal", "search", "social", "external");
    private final AnalyticsPageViewRepo views;

    public AnalyticsController(AnalyticsPageViewRepo views) {
        this.views = views;
    }

    public record PageViewRequest(
            @NotBlank @Size(max = 300) String path,
            @NotBlank @Size(max = 12) String deviceClass,
            @NotBlank @Size(max = 12) String referrerType
    ) {}

    @PostMapping
    public ResponseEntity<Void> collect(@Valid @RequestBody PageViewRequest request) {
        String path = normalizePath(request.path());
        if (path == null || !DEVICES.contains(request.deviceClass())
                || !REFERRERS.contains(request.referrerType())) {
            return ResponseEntity.badRequest().build();
        }
        AnalyticsPageView view = new AnalyticsPageView();
        view.setPath(path);
        view.setLanguage(path.startsWith("/en") ? "en" : "tr");
        view.setDeviceClass(request.deviceClass());
        view.setReferrerType(request.referrerType());
        views.save(view);
        return ResponseEntity.noContent().build();
    }

    private static String normalizePath(String raw) {
        String path = raw.strip().split("[?#]", 2)[0].replaceAll("/{2,}", "/");
        if (!path.matches("^/(tr|en)(/.*)?$") || path.length() > 300) return null;
        return path;
    }
}
