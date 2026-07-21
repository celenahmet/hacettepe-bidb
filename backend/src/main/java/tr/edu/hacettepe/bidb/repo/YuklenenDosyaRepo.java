package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.YuklenenDosya;

import java.util.List;

public interface YuklenenDosyaRepo extends JpaRepository<YuklenenDosya, Long> {
    List<YuklenenDosya> findAllByOrderByYuklemeDesc();
}
