package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import tr.edu.hacettepe.bidb.model.AnalyticsPageView;

import java.time.OffsetDateTime;
import java.util.List;

public interface AnalyticsPageViewRepo extends JpaRepository<AnalyticsPageView, Long> {
    interface MonthlyAggregate {
        String getMonth();
        Long getViews();
    }

    interface DailyAggregate {
        String getDay();
        Long getViews();
    }

    interface PageAggregate {
        String getPath();
        Long getViews();
        Long getCurrentMonthViews();
        Long getPreviousMonthViews();
        OffsetDateTime getLastViewedAt();
    }

    interface DimensionAggregate {
        String getName();
        Long getViews();
    }

    @Query(value = """
            SELECT to_char(date_trunc('month', recorded_at AT TIME ZONE 'Europe/Istanbul'), 'YYYY-MM') AS month,
                   count(*) AS views
              FROM analytics_page_view
             WHERE recorded_at >= :since
             GROUP BY 1
             ORDER BY 1
            """, nativeQuery = true)
    List<MonthlyAggregate> monthly(@Param("since") OffsetDateTime since);

    @Query(value = """
            SELECT to_char(date_trunc('day', recorded_at AT TIME ZONE 'Europe/Istanbul'), 'YYYY-MM-DD') AS day,
                   count(*) AS views
              FROM analytics_page_view
             WHERE recorded_at >= :since
             GROUP BY 1
             ORDER BY 1
            """, nativeQuery = true)
    List<DailyAggregate> daily(@Param("since") OffsetDateTime since);

    @Query(value = """
            SELECT path,
                   count(*) AS views,
                   count(*) FILTER (WHERE recorded_at >= :currentStart) AS "currentMonthViews",
                   count(*) FILTER (
                       WHERE recorded_at >= :previousStart AND recorded_at < :currentStart
                   ) AS "previousMonthViews",
                   max(recorded_at) AS "lastViewedAt"
              FROM analytics_page_view
             WHERE recorded_at >= :since
             GROUP BY path
             ORDER BY views DESC, path
            """, nativeQuery = true)
    List<PageAggregate> pages(@Param("since") OffsetDateTime since,
                              @Param("currentStart") OffsetDateTime currentStart,
                              @Param("previousStart") OffsetDateTime previousStart);

    @Query(value = """
            SELECT device_class AS name, count(*) AS views
              FROM analytics_page_view
             WHERE recorded_at >= :since
             GROUP BY device_class
             ORDER BY views DESC
            """, nativeQuery = true)
    List<DimensionAggregate> devices(@Param("since") OffsetDateTime since);

    @Query(value = """
            SELECT referrer_type AS name, count(*) AS views
              FROM analytics_page_view
             WHERE recorded_at >= :since
             GROUP BY referrer_type
             ORDER BY views DESC
            """, nativeQuery = true)
    List<DimensionAggregate> referrers(@Param("since") OffsetDateTime since);

    @Modifying
    @Transactional
    long deleteByRecordedAtBefore(OffsetDateTime before);
}
