package tr.edu.hacettepe.bidb.web;

import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.repo.AnalyticsPageViewRepo;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Mobil ve masaüstü yönetim paneli için aylık, sayfa bazlı gerçek kullanım raporu. */
@RestController
@RequestMapping("/api/admin/analytics")
public class AdminAnalyticsController {
    private static final ZoneId REPORT_ZONE = ZoneId.of("Europe/Istanbul");
    private final AnalyticsPageViewRepo views;

    public AdminAnalyticsController(AnalyticsPageViewRepo views) {
        this.views = views;
    }

    public record PeriodPoint(String key, long views) {}
    public record Breakdown(String name, long views, double percentage) {}
    public record PageReport(String path, long views, long currentMonthViews,
                             long previousMonthViews, Double changePercent,
                             OffsetDateTime lastViewedAt) {}
    public record AnalyticsReport(long totalViews, long currentMonthViews,
                                  long previousMonthViews, Double monthlyChangePercent,
                                  int activePages, int months, OffsetDateTime generatedAt,
                                  List<PeriodPoint> monthly, List<PeriodPoint> daily,
                                  List<PageReport> pages, List<Breakdown> devices,
                                  List<Breakdown> referrers) {}

    @GetMapping
    public AnalyticsReport report(@RequestParam(defaultValue = "12") int months) {
        int safeMonths = Math.max(1, Math.min(months, 24));
        ZonedDateTime now = ZonedDateTime.now(REPORT_ZONE);
        OffsetDateTime currentStart = now.withDayOfMonth(1).toLocalDate()
                .atStartOfDay(REPORT_ZONE).toOffsetDateTime();
        OffsetDateTime previousStart = currentStart.minusMonths(1);
        OffsetDateTime since = currentStart.minusMonths(safeMonths - 1L);

        List<PeriodPoint> monthly = completeMonths(
                views.monthly(since), YearMonth.from(now), safeMonths);
        LocalDate firstDay = now.toLocalDate().minusDays(29);
        List<PeriodPoint> daily = completeDays(
                views.daily(firstDay.atStartOfDay(REPORT_ZONE).toOffsetDateTime()),
                firstDay, 30);
        List<PageReport> pages = views.pages(since, currentStart, previousStart).stream()
                .map(item -> new PageReport(item.getPath(), item.getViews(),
                        item.getCurrentMonthViews(), item.getPreviousMonthViews(),
                        change(item.getCurrentMonthViews(), item.getPreviousMonthViews()),
                        item.getLastViewedAt().atZone(REPORT_ZONE).toOffsetDateTime()))
                .toList();

        long total = pages.stream().mapToLong(PageReport::views).sum();
        long current = pages.stream().mapToLong(PageReport::currentMonthViews).sum();
        long previous = pages.stream().mapToLong(PageReport::previousMonthViews).sum();
        return new AnalyticsReport(total, current, previous, change(current, previous),
                pages.size(), safeMonths, OffsetDateTime.now(),
                monthly, daily, pages,
                breakdown(views.devices(since), total),
                breakdown(views.referrers(since), total));
    }

    private static List<Breakdown> breakdown(
            List<AnalyticsPageViewRepo.DimensionAggregate> items, long total) {
        return items.stream().map(item -> new Breakdown(item.getName(), item.getViews(),
                total == 0 ? 0 : Math.round(item.getViews() * 10_000d / total) / 100d)).toList();
    }

    private static Double change(long current, long previous) {
        if (previous == 0) return current == 0 ? 0d : null;
        return Math.round((current - previous) * 10_000d / previous) / 100d;
    }

    private static List<PeriodPoint> completeMonths(
            List<AnalyticsPageViewRepo.MonthlyAggregate> rows, YearMonth current, int count) {
        Map<String, Long> values = new LinkedHashMap<>();
        rows.forEach(row -> values.put(row.getMonth(), row.getViews()));
        List<PeriodPoint> result = new ArrayList<>(count);
        for (int offset = count - 1; offset >= 0; offset--) {
            String key = current.minusMonths(offset).toString();
            result.add(new PeriodPoint(key, values.getOrDefault(key, 0L)));
        }
        return result;
    }

    private static List<PeriodPoint> completeDays(
            List<AnalyticsPageViewRepo.DailyAggregate> rows, LocalDate firstDay, int count) {
        Map<String, Long> values = new LinkedHashMap<>();
        rows.forEach(row -> values.put(row.getDay(), row.getViews()));
        List<PeriodPoint> result = new ArrayList<>(count);
        for (int offset = 0; offset < count; offset++) {
            String key = firstDay.plusDays(offset).format(DateTimeFormatter.ISO_LOCAL_DATE);
            result.add(new PeriodPoint(key, values.getOrDefault(key, 0L)));
        }
        return result;
    }
}
