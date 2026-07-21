package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.Belge;

import java.util.List;

public interface BelgeRepo extends JpaRepository<Belge, Long> {
    List<Belge> findBySayfa_IdOrderBySiraAsc(Long sayfaId);
}
