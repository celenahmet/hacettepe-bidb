package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Limit;
import tr.edu.hacettepe.bidb.model.AdminAuditEvent;

import java.util.List;

public interface AdminAuditEventRepo extends JpaRepository<AdminAuditEvent, Long> {
    List<AdminAuditEvent> findAllByOrderByOccurredAtDesc(Limit limit);
}
