package tr.edu.hacettepe.bidb.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.model.WebVitalSample;
import tr.edu.hacettepe.bidb.repo.WebVitalSampleRepo;

import java.util.List;
import java.util.Locale;

/**
 * Tarayıcıdan anonim performans telemetrisi alır.
 *
 * Yalnızca rota, metrik adı ve sayısal değer saklanır. IP, user-agent,
 * referrer, çerez ve oturum bilgisi veri modeline alınmaz.
 */
@RestController
@RequestMapping("/api/metrics/vitals")
public class WebVitalController {
    private static final List<String> METRICS = List.of("LCP", "INP", "CLS", "FCP", "TTFB");
    private final WebVitalSampleRepo samples;

    public WebVitalController(WebVitalSampleRepo samples) {
        this.samples = samples;
    }

    public record Metric(
            @NotBlank @Size(max = 8) String name,
            @PositiveOrZero @DecimalMax("120000") double value
    ) {}

    public record VitalRequest(
            @NotBlank @Size(max = 300) String path,
            @NotEmpty @Size(max = 5) List<@Valid Metric> metrics
    ) {}

    @PostMapping
    public ResponseEntity<Void> collect(@Valid @RequestBody VitalRequest request) {
        String path = normalizePath(request.path());
        if (path == null) return ResponseEntity.badRequest().build();

        List<WebVitalSample> records = request.metrics().stream()
                .filter(metric -> METRICS.contains(metric.name().toUpperCase(Locale.ROOT)))
                .map(metric -> {
                    String name = metric.name().toUpperCase(Locale.ROOT);
                    WebVitalSample sample = new WebVitalSample();
                    sample.setPath(path);
                    sample.setMetric(name);
                    sample.setValue(round(name, metric.value()));
                    sample.setRating(rating(name, metric.value()));
                    return sample;
                })
                .toList();
        if (records.isEmpty()) return ResponseEntity.badRequest().build();
        samples.saveAll(records);
        return ResponseEntity.noContent().build();
    }

    private static String normalizePath(String raw) {
        String path = raw.strip().split("[?#]", 2)[0].replaceAll("/{2,}", "/");
        if (!path.matches("^/(tr|en)(/.*)?$") || path.startsWith("/yonetim")
                || path.startsWith("/error/") || path.length() > 300) return null;
        return path.isBlank() ? "/" : path;
    }

    private static double round(String metric, double value) {
        double factor = metric.equals("CLS") ? 1000d : 10d;
        return Math.round(value * factor) / factor;
    }

    static String rating(String metric, double value) {
        double good = switch (metric) {
            case "LCP" -> 2500;
            case "INP" -> 200;
            case "CLS" -> 0.10;
            case "FCP" -> 1800;
            case "TTFB" -> 800;
            default -> 0;
        };
        double poor = switch (metric) {
            case "LCP" -> 4000;
            case "INP" -> 500;
            case "CLS" -> 0.25;
            case "FCP" -> 3000;
            case "TTFB" -> 1800;
            default -> 0;
        };
        if (value <= good) return "good";
        if (value <= poor) return "needs-improvement";
        return "poor";
    }
}

