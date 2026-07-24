package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.ContactTicket;
import java.util.List;

public interface ContactTicketRepo extends JpaRepository<ContactTicket, Long> {
    List<ContactTicket> findAllByOrderByCreatedAtDesc();
    boolean existsByReferenceCode(String referenceCode);
}
