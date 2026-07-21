package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.SosyalHesap;

import java.util.List;

public interface SosyalHesapRepo extends JpaRepository<SosyalHesap, Long> {
    List<SosyalHesap> findByYayindaTrueOrderBySiraAsc();
}
