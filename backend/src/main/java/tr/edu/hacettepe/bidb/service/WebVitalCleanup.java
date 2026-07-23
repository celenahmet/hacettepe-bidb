package tr.edu.hacettepe.bidb.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import tr.edu.hacettepe.bidb.repo.WebVitalSampleRepo;
import tr.edu.hacettepe.bidb.repo.AnalyticsPageViewRepo;

import java.time.OffsetDateTime;

/** Ölçüm tablosunun sınırsız büyümemesi için 90 günden eski örnekleri siler. */
@Component
public class WebVitalCleanup {
    private final WebVitalSampleRepo samples;
    private final AnalyticsPageViewRepo pageViews;

    public WebVitalCleanup(WebVitalSampleRepo samples, AnalyticsPageViewRepo pageViews) {
        this.samples = samples;
        this.pageViews = pageViews;
    }

    @Scheduled(cron = "0 17 3 * * *", zone = "Europe/Istanbul")
    public void cleanup() {
        samples.deleteByRecordedAtBefore(OffsetDateTime.now().minusDays(90));
        // Aylık raporlar iki yıl tutulur; daha eski anonim olaylar temizlenir.
        pageViews.deleteByRecordedAtBefore(OffsetDateTime.now().minusMonths(24));
    }
}
