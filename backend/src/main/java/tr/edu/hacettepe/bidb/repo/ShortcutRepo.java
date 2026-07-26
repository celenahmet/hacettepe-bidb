package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.Shortcut;

import java.util.List;

public interface ShortcutRepo extends JpaRepository<Shortcut, Long> {
    /**
     * Kısayollar ve servisler birlikte; ayrım type sütununda.
     *
     * Sıralama id ile de bağlanır. Yalnızca sortOrder'a göre sıralamak yetmiyordu:
     * yayındaki kayıtlarda aynı dilde aynı sıra numarasını paylaşan 16 grup var
     * (ölçüldü) ve eşit değerlerde veritabanı satırları fiziksel sıraya göre
     * döndürüyor. Bir kayıt güncellendiğinde fiziksel yeri değiştiği için, panelde
     * yalnızca adı düzenlenen bir kısayol ana sayfadaki listede sessizce
     * yer değiştirebiliyordu. Aynı yaklaşım StaffUnitRepo'da zaten kullanılıyor.
     */
    List<Shortcut> findByLanguageAndPublishedTrueOrderBySortOrderAscIdAsc(String language);
}
