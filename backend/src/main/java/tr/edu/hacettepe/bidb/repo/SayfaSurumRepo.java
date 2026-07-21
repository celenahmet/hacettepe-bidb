package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.SayfaSurum;

import java.util.List;

public interface SayfaSurumRepo extends JpaRepository<SayfaSurum, Long> {
    List<SayfaSurum> findBySayfaIdOrderByKayitZamaniDesc(Long sayfaId);
}
