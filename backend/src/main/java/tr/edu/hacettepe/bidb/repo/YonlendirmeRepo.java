package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.Yonlendirme;

import java.util.Optional;

public interface YonlendirmeRepo extends JpaRepository<Yonlendirme, Long> {
    Optional<Yonlendirme> findByEskiYol(String eskiYol);
}
