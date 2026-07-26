package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tr.edu.hacettepe.bidb.model.Page;

import java.util.List;
import java.util.Optional;

public interface PageRepo extends JpaRepository<Page, Long> {

    /** Belgeler tek sorguda getirilir; yanıt üretilirken oturum kapalı olur. */
    @Query("""
           SELECT s FROM Page s
           LEFT JOIN FETCH s.documents
           WHERE s.slug = :slug AND s.language = :language AND s.published = true
           """)
    Optional<Page> findBySlugAndLanguage(@Param("slug") String slug, @Param("language") String language);

    /** SEO ve liste yanıtlarında içerik/belge ilişkisini yüklemeden sayfayı bulur. */
    Optional<Page> findFirstBySlugAndLanguageAndPublishedTrue(String slug, String language);

    boolean existsBySlugAndLanguageAndPublishedTrue(String slug, String language);

    /**
     * Sıralama id ile de bağlanır: yayındaki sayfalarda aynı dilde aynı sıra
     * numarasını paylaşan 16 grup var (ölçüldü). Bu liste ziyaretçiye sıralı
     * gösterilmiyor, ama site haritasını üretiyor; eşitlik çözülmeden kalırsa
     * harita satırlarının sırası kayıt güncellendikçe değişir ve tarayıcı
     * robotlarına gereksiz değişiklik gibi görünür.
     */
    List<Page> findByLanguageAndPublishedTrueOrderBySortOrderAscIdAsc(String language);
}
