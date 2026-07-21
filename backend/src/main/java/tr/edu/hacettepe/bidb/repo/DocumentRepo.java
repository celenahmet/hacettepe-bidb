package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.Document;

import java.util.List;

public interface DocumentRepo extends JpaRepository<Document, Long> {
    List<Document> findBySayfa_IdOrderBySiraAsc(Long sayfaId);
}
