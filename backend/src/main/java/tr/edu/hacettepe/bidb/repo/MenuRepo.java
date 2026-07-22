package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tr.edu.hacettepe.bidb.model.Menu;

import java.util.List;

public interface MenuRepo extends JpaRepository<Menu, Long> {

    /** Menü öğeleri ve bağlı pages tek sorguda getirilir. */
    @Query("""
           SELECT DISTINCT m FROM Menu m
           LEFT JOIN FETCH m.items o
           LEFT JOIN FETCH o.page
           WHERE m.language = :language AND m.position = :position
           ORDER BY m.sortOrder
           """)
    List<Menu> findByLanguageAndPosition(@Param("language") String language, @Param("position") String position);
}
