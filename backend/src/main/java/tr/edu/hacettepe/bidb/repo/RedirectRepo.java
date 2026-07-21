package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.Redirect;

import java.util.Optional;

public interface RedirectRepo extends JpaRepository<Redirect, Long> {
    Optional<Redirect> findByEskiYol(String eskiYol);
}
