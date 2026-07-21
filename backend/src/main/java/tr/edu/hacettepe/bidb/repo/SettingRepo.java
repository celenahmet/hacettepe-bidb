package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.Setting;

import java.util.List;
import java.util.Optional;

public interface SettingRepo extends JpaRepository<Setting, Setting.Kimlik> {
    List<Setting> findByDilOrderByAnahtarAsc(String dil);
    Optional<Setting> findByAnahtarAndDil(String anahtar, String dil);
}
