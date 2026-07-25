package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import tr.edu.hacettepe.bidb.model.News;

import java.util.List;
import java.util.Optional;

public interface NewsRepo extends JpaRepository<News, Long> {
    // "Öne çıkan" (featured) işaretli duyurular, yayın tarihinden bağımsız
    // olarak listenin başına sabitlenir — panelde bu alan zaten vardı ama
    // hiçbir sorgu okumuyordu, ilk sıradaki (i===0) manşet kartı yalnızca
    // en son yayınlanana gidiyordu.
    List<News> findByLanguageAndPublishedTrueOrderByFeaturedDescPublishedOnDesc(String language, Limit limit);

    List<News> findByLanguageAndPublishedTrueOrderByFeaturedDescPublishedOnDesc(String language);

    Optional<News> findBySlugAndLanguageAndPublishedTrue(String slug, String language);

    /** Eş zamanlı ziyaretlerde değer kaybetmemek için sayaç veritabanında atomik artar. */
    @Modifying
    @Transactional
    @Query("""
            update News n
               set n.viewCount = n.viewCount + 1
             where n.id = :id
               and n.language = :language
               and n.published = true
            """)
    int goruntulenmeyiArtir(@Param("id") Long id, @Param("language") String language);
}
