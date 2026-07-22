package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.Setting;

import java.util.List;
import java.util.Optional;

public interface SettingRepo extends JpaRepository<Setting, Setting.Kimlik> {
    List<Setting> findByLanguageOrderByNameAsc(String language);
    Optional<Setting> findByNameAndLanguage(String name, String language);
}
