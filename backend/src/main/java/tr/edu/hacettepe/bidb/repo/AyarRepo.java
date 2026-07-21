package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.Ayar;

import java.util.List;
import java.util.Optional;

public interface AyarRepo extends JpaRepository<Ayar, Ayar.Kimlik> {
    List<Ayar> findByDilOrderByAnahtarAsc(String dil);
    Optional<Ayar> findByAnahtarAndDil(String anahtar, String dil);
}
