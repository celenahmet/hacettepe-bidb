package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import tr.edu.hacettepe.bidb.model.WebVitalSample;

import java.time.OffsetDateTime;
import java.util.List;

public interface WebVitalSampleRepo extends JpaRepository<WebVitalSample, Long> {
    interface VitalAggregate {
        String getPath();
        String getMetric();
        Double getP75();
        Long getSampleCount();
        java.time.Instant getLastMeasuredAt();
    }

    /** Core Web Vitals değerlendirmesi ortalamayla değil 75. yüzdelikle yapılır. */
    @Query(value = """
            SELECT path,
                   metric,
                   percentile_cont(0.75) WITHIN GROUP (ORDER BY value) AS p75,
                   count(*) AS "sampleCount",
                   max(recorded_at) AS "lastMeasuredAt"
              FROM web_vital_sample
             WHERE recorded_at >= :since
             GROUP BY path, metric
             ORDER BY path, metric
            """, nativeQuery = true)
    List<VitalAggregate> aggregateSince(@Param("since") OffsetDateTime since);

    @Modifying
    @Transactional
    long deleteByRecordedAtBefore(OffsetDateTime before);
}
