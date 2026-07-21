package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.News;

import java.util.List;
import java.util.Optional;

public interface NewsRepo extends JpaRepository<News, Long> {
    List<News> findByDilAndYayindaTrueOrderByYayinTarihiDesc(String dil, Limit limit);

    List<News> findByDilAndYayindaTrueOrderByYayinTarihiDesc(String dil);

    Optional<News> findBySlugAndDilAndYayindaTrue(String slug, String dil);
}
