package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.Duyuru;

import java.util.List;
import java.util.Optional;

public interface DuyuruRepo extends JpaRepository<Duyuru, Long> {
    List<Duyuru> findByDilAndYayindaTrueOrderByYayinTarihiDesc(String dil, Limit limit);

    List<Duyuru> findByDilAndYayindaTrueOrderByYayinTarihiDesc(String dil);

    Optional<Duyuru> findBySlugAndDilAndYayindaTrue(String slug, String dil);
}
