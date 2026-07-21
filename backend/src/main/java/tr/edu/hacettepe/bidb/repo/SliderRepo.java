package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.Slider;

import java.util.List;

public interface SliderRepo extends JpaRepository<Slider, Long> {
    List<Slider> findByDilAndYayindaTrueOrderBySiraAsc(String dil);
}
