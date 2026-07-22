package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.StaffUnit;

import java.util.List;

public interface StaffUnitRepo extends JpaRepository<StaffUnit, Long> {

    /* Kişiler birimle birlikte tek sorguda okunur. Aksi hâlde her birim
       için ayrı sorgu açılır (N+1) ve istek kapandıktan sonra okunmaya
       çalışıldığında oturum kapalı olduğu için hata verir. */

    /** Sitede görünen liste: yalnızca yayımdaki birimler, verilen sırada. */
    @EntityGraph(attributePaths = "members")
    List<StaffUnit> findByLanguageAndPublishedTrueOrderBySortOrderAscIdAsc(String language);

    /** Panelde görünen liste: yayımda olmayanlar da dâhil. */
    @EntityGraph(attributePaths = "members")
    List<StaffUnit> findAllByOrderByLanguageAscSortOrderAscIdAsc();
}
