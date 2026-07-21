package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tr.edu.hacettepe.bidb.model.Sayfa;

import java.util.List;
import java.util.Optional;

public interface SayfaRepo extends JpaRepository<Sayfa, Long> {

    /** Belgeler tek sorguda getirilir; yanıt üretilirken oturum kapalı olur. */
    @Query("""
           SELECT s FROM Sayfa s
           LEFT JOIN FETCH s.belgeler
           WHERE s.slug = :slug AND s.dil = :dil AND s.yayinda = true
           """)
    Optional<Sayfa> bul(@Param("slug") String slug, @Param("dil") String dil);

    List<Sayfa> findByDilAndYayindaTrueOrderBySiraAsc(String dil);
}
