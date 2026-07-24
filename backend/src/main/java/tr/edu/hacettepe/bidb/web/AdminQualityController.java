package tr.edu.hacettepe.bidb.web;

import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.model.News;
import tr.edu.hacettepe.bidb.model.Page;
import tr.edu.hacettepe.bidb.repo.*;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Stream;

/** Yönetim paneli için SEO bütünlüğü ve gerçek kullanıcı performans özeti. */
@RestController
@RequestMapping("/api/admin/quality")
public class AdminQualityController {
    private final PageRepo pages;
    private final NewsRepo news;
    private final SliderRepo slides;
    private final WebVitalSampleRepo vitals;

    public AdminQualityController(PageRepo pages, NewsRepo news, SliderRepo slides,
                                  WebVitalSampleRepo vitals) {
        this.pages = pages;
        this.news = news;
        this.slides = slides;
        this.vitals = vitals;
    }

    public record PageScore(String path, String title, String contentType,
                            int score, List<String> issues) {}
    public record VitalScore(String path, String metric, double p75, long samples,
                             String rating, int score, OffsetDateTime lastMeasuredAt) {}
    public record QualitySummary(int seoScore, Integer performanceScore, long performanceSamples,
                                 OffsetDateTime generatedAt, List<PageScore> pages,
                                 List<VitalScore> vitals) {}

    @GetMapping
    public QualitySummary summary(@RequestParam(defaultValue = "28") int days) {
        int safeDays = Math.max(1, Math.min(days, 90));
        Set<String> homeLanguagesWithImage = new HashSet<>();
        slides.findAll().stream().filter(s -> s.isPublished()).forEach(s ->
                homeLanguagesWithImage.add(s.getLanguage()));

        List<PageScore> pageScores = Stream.concat(
                pages.findAll().stream().filter(Page::isPublished)
                        .map(page -> scorePage(page, homeLanguagesWithImage.contains(page.getLanguage()))),
                news.findAll().stream().filter(News::isPublished)
                        .filter(item -> item.getSlug() != null && !item.getSlug().isBlank())
                        .map(this::scoreNews)
        ).sorted(Comparator.comparingInt(PageScore::score).thenComparing(PageScore::path)).toList();

        List<VitalScore> vitalScores = vitals.aggregateSince(OffsetDateTime.now().minusDays(safeDays))
                .stream().map(item -> {
                    double value = item.getP75() == null ? 0 : item.getP75();
                    String rating = WebVitalController.rating(item.getMetric(), value);
                    return new VitalScore(item.getPath(), item.getMetric(), value,
                            item.getSampleCount(), rating, performanceScore(item.getMetric(), value),
                            item.getLastMeasuredAt() == null ? null : item.getLastMeasuredAt().atOffset(java.time.ZoneOffset.UTC));
                }).toList();

        int seoScore = pageScores.isEmpty() ? 0
                : (int) Math.round(pageScores.stream().mapToInt(PageScore::score).average().orElse(0));
        Integer performanceScore = vitalScores.isEmpty() ? null
                : (int) Math.round(vitalScores.stream().mapToInt(VitalScore::score).average().orElse(0));
        long sampleCount = vitalScores.stream().mapToLong(VitalScore::samples).sum();
        return new QualitySummary(seoScore, performanceScore, sampleCount,
                OffsetDateTime.now(), pageScores, vitalScores);
    }

    private PageScore scorePage(Page page, boolean homeHasImage) {
        String path = page.getSlug().equals("home")
                ? "/" + page.getLanguage()
                : "/" + page.getLanguage() + "/" + page.getSlug();
        List<String> issues = new ArrayList<>();
        int score = commonScore(page.getSeoTitle(), page.getTitle(), page.getSeoDescription(),
                page.getSeoKeywords(), page.getSeoImage(), page.getSeoRobots(),
                page.getSeoSchemaType(), page.getUpdatedAt(), homeHasImage, issues);
        return new PageScore(path, page.getTitle(), "page", score, issues);
    }

    private PageScore scoreNews(News item) {
        List<String> issues = new ArrayList<>();
        int score = commonScore(item.getSeoTitle(), item.getTitle(),
                firstNonBlank(item.getSeoDescription(), item.getSummary()),
                item.getSeoKeywords(), item.getImageUrl(), item.getSeoRobots(),
                "NewsArticle", item.getUpdatedAt(), false, issues);
        return new PageScore("/" + item.getLanguage() + "/newsItem/" + item.getSlug(),
                item.getTitle(), "news", score, issues);
    }

    private static int commonScore(String seoTitle, String fallbackTitle, String description,
                                   String keywords, String image, String robots, String schema,
                                   OffsetDateTime updatedAt, boolean fallbackImage,
                                   List<String> issues) {
        String title = firstNonBlank(seoTitle, fallbackTitle);
        int score = 0;
        if (title != null) score += 10;
        if (title != null && title.length() >= 25 && title.length() <= 70) score += 10;
        else issues.add("Başlık uzunluğu 25–70 karakter aralığında değil.");

        if (description != null) score += 15;
        else issues.add("SEO açıklaması eksik.");
        if (description != null && description.length() >= 70 && description.length() <= 180) score += 15;
        else issues.add("Açıklama uzunluğu 70–180 karakter aralığında değil.");

        if (image != null || fallbackImage) score += 15;
        else issues.add("Sayfaya özel sosyal paylaşım görseli eksik.");
        if (robots != null && !robots.contains("noindex")) score += 10;
        else issues.add("Sayfa arama motoru dizinine kapalı.");
        if (schema != null && !schema.isBlank()) score += 10;
        else issues.add("Yapılandırılmış veri türü eksik.");
        if (keywords != null && !keywords.isBlank()) score += 5;
        else issues.add("İçerik anahtar kelimeleri tanımlanmamış.");
        if (updatedAt != null) score += 5;
        if (fallbackTitle != null && !fallbackTitle.isBlank()) score += 5;
        if (fallbackTitle != null && !fallbackTitle.isBlank() && fallbackTitle.length() <= 300) score += 5;
        return Math.min(score, 100);
    }

    private static int performanceScore(String metric, double value) {
        double good = switch (metric) {
            case "LCP" -> 2500; case "INP" -> 200; case "CLS" -> 0.10;
            case "FCP" -> 1800; case "TTFB" -> 800; default -> 0;
        };
        double poor = switch (metric) {
            case "LCP" -> 4000; case "INP" -> 500; case "CLS" -> 0.25;
            case "FCP" -> 3000; case "TTFB" -> 1800; default -> 1;
        };
        if (value <= good) return 100;
        if (value >= poor) return 0;
        return (int) Math.round(100 * (poor - value) / (poor - good));
    }

    private static String firstNonBlank(String... values) {
        return Arrays.stream(values).filter(Objects::nonNull)
                .map(String::trim).filter(value -> !value.isBlank()).findFirst().orElse(null);
    }
}

