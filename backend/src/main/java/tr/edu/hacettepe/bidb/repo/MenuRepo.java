package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tr.edu.hacettepe.bidb.model.Menu;

import java.util.List;

public interface MenuRepo extends JpaRepository<Menu, Long> {

    /** Menü öğeleri ve bağlı sayfalar tek sorguda getirilir. */
    @Query("""
           SELECT DISTINCT m FROM Menu m
           LEFT JOIN FETCH m.ogeler o
           LEFT JOIN FETCH o.sayfa
           WHERE m.dil = :dil AND m.konum = :konum
           ORDER BY m.sira
           """)
    List<Menu> findByLanguageAndPosition(@Param("dil") String dil, @Param("konum") String konum);
}
