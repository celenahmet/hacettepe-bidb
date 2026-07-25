package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Limit;
import tr.edu.hacettepe.bidb.model.AdminLoginEvent;

import java.util.List;

public interface AdminLoginEventRepo extends JpaRepository<AdminLoginEvent, Long> {
    List<AdminLoginEvent> findAllByOrderByOccurredAtDesc(Limit limit);
}
