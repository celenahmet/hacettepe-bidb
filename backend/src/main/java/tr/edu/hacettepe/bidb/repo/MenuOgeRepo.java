package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.MenuOge;

import java.util.List;

public interface MenuOgeRepo extends JpaRepository<MenuOge, Long> {
    List<MenuOge> findByMenuIdOrderBySiraAsc(Long menuId);
}
