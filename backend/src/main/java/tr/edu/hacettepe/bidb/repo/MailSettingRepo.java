package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.MailSetting;

import java.util.Optional;

public interface MailSettingRepo extends JpaRepository<MailSetting, Long> {
    /** Tablo tek satır tutar; göç başlangıç satırını oluşturur. */
    Optional<MailSetting> findFirstByOrderByIdAsc();
}
