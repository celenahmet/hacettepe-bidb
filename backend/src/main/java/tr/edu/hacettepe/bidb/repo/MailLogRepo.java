package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.MailLog;

import java.util.List;

public interface MailLogRepo extends JpaRepository<MailLog, Long> {
    List<MailLog> findAllByOrderByCreatedAtDesc(Limit limit);
}
