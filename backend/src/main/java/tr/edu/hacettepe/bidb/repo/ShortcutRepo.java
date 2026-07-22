package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.Shortcut;

import java.util.List;

public interface ShortcutRepo extends JpaRepository<Shortcut, Long> {
    /** Kısayollar ve servisler birlikte; ayrım type sütununda. */
    List<Shortcut> findByLanguageAndPublishedTrueOrderBySortOrderAsc(String language);
}
