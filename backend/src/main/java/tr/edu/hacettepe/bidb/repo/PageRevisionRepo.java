package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.PageRevision;

import java.util.List;

public interface PageRevisionRepo extends JpaRepository<PageRevision, Long> {
    List<PageRevision> findBySayfaIdOrderByKayitZamaniDesc(Long sayfaId);
}
