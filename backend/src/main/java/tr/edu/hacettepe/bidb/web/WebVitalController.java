package tr.edu.hacettepe.bidb.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tr.edu.hacettepe.bidb.model.WebVitalSample;
import tr.edu.hacettepe.bidb.repo.WebVitalSampleRepo;
import tr.edu.hacettepe.bidb.security.HizSinirlayici;

import java.util.List;
import java.util.Locale;

/**
 * Tarayıcıdan anonim performans telemetrisi alır.
 *
 * Yalnızca rota, metrik adı ve sayısal değer saklanır. IP, user-agent,
 * referrer, çerez ve oturum bilgisi veri modeline alınmaz — hız sınırlaması
 * için IP yalnızca bellekte, geçici olarak tutulur, hiçbir yere yazılmaz.
 */
@RestController
@RequestMapping("/api/metrics/vitals")
public class WebVitalController {
    private static final List<String> METRICS = List.of("LCP", "INP", "CLS", "FCP", "TTFB");
    private final WebVitalSampleRepo samples;
    private final HizSinirlayici hizSinirlayici;

    public WebVitalController(WebVitalSampleRepo samples, HizSinirlayici hizSinirlayici) {
        this.samples = samples;
        this.hizSinirlayici = hizSinirlayici;
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
    public ResponseEntity<Void> collect(@Valid @RequestBody VitalRequest request, HttpServletRequest servletRequest) {
        String adres = hizSinirlayici.istekAdresi(servletRequest);
        if (hizSinirlayici.asildiMi("vital:" + adres, 60, 60)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS);
        }
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

    /*
     * Core Web Vitals eşiklerinin TEK kaynağı burasıdır.
     *
     * Bu değerler daha önce AdminQualityController içinde de ayrıca
     * yazılmıştı ve iki kopya şimdiden ayrışmıştı: bilinmeyen bir metrik
     * için "poor" sınırı burada 0, orada 1 idi. Yönetim paneli artık bu
     * eşikleri ekranda da gösterdiğinden üçüncü bir kopya çıkacaktı;
     * ikisi de buradan okur, panel de API'den alır.
     *
     * Değerler Google'ın yayımladığı eşiklerdir (web.dev/vitals).
     */
    static double good(String metric) {
        return switch (metric) {
            case "LCP" -> 2500;
            case "INP" -> 200;
            case "CLS" -> 0.10;
            case "FCP" -> 1800;
            case "TTFB" -> 800;
            default -> 0;
        };
    }

    static double poor(String metric) {
        return switch (metric) {
            case "LCP" -> 4000;
            case "INP" -> 500;
            case "CLS" -> 0.25;
            case "FCP" -> 3000;
            case "TTFB" -> 1800;
            default -> 0;
        };
    }

    static String rating(String metric, double value) {
        if (value <= good(metric)) return "good";
        if (value <= poor(metric)) return "needs-improvement";
        return "poor";
    }
}

