package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.ContactTicketEvent;
import java.util.List;

public interface ContactTicketEventRepo extends JpaRepository<ContactTicketEvent, Long> {
    List<ContactTicketEvent> findByTicketIdOrderByCreatedAtDesc(Long ticketId);
}
