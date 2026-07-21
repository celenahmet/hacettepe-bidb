package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.HizliErisim;

import java.util.List;

public interface HizliErisimRepo extends JpaRepository<HizliErisim, Long> {
    /** Kısayollar (sıra < 100) ve servisler (sıra >= 100) birlikte, sıraya göre. */
    List<HizliErisim> findByDilAndYayindaTrueOrderBySiraAsc(String dil);
}
