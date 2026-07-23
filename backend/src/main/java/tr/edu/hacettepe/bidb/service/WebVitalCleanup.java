package tr.edu.hacettepe.bidb.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import tr.edu.hacettepe.bidb.repo.WebVitalSampleRepo;

import java.time.OffsetDateTime;

/** Ölçüm tablosunun sınırsız büyümemesi için 90 günden eski örnekleri siler. */
@Component
public class WebVitalCleanup {
    private final WebVitalSampleRepo samples;

    public WebVitalCleanup(WebVitalSampleRepo samples) {
        this.samples = samples;
    }

    @Scheduled(cron = "0 17 3 * * *", zone = "Europe/Istanbul")
    public void cleanup() {
        samples.deleteByRecordedAtBefore(OffsetDateTime.now().minusDays(90));
    }
}

