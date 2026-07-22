package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.ContactChannel;

import java.util.List;

public interface ContactChannelRepo extends JpaRepository<ContactChannel, Long> {
    List<ContactChannel> findByLanguageAndPublishedTrueOrderByTypeAscSortOrderAsc(String language);
    List<ContactChannel> findAllByOrderByLanguageAscTypeAscSortOrderAsc();
}
