package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.UploadedFile;

import java.util.List;

public interface UploadedFileRepo extends JpaRepository<UploadedFile, Long> {
    List<UploadedFile> findAllByOrderByUploadedAtDesc();
}
