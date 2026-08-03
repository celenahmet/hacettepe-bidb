package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tr.edu.hacettepe.bidb.model.Page;

import java.util.List;
import java.util.Optional;

public interface PageRepo extends JpaRepository<Page, Long> {

    /**
     * YALNIZCA YAYINDAKİ sayfa. Belgeler tek sorguda getirilir; yanıt
     * üretilirken oturum kapalı olur.
     *
     * Adı önce "findBySlugAndLanguage" idi ve sorgunun yayın süzgecini
     * gizliyordu. İki sonucu oldu:
     *
     * (1) PageController'ı okuyan, yayımlanmamış sayfanın sızdığını
     *     sanıyordu — sızmıyordu, süzgeç sorgunun gövdesindeydi.
     * (2) Yönetim panelindeki slug BENZERSİZLİK denetimleri de bu yöntemi
     *     çağırıyordu ve orada süzgeç YANLIŞTI: yayımlanmamış bir sayfanın
     *     adresi "boşta" görünüyordu.
     *
     * (2)'nin sonucu veri bozulması DEĞİLDİ — veritabanındaki UNIQUE kısıt
     * ikinci kaydı zaten engelliyor, VeriHatasiIsleyici de bunu 400'e
     * çeviriyordu. Kaybedilen şey mesajın kendisiydi: işletmen "Bu adres
     * zaten kullanılıyor: /tr/duyurular" yerine "Bu kayıt zaten var" gibi
     * genel bir uyarı alıyor, hangi adresin çakıştığını göremiyordu.
     *
     * Benzersizlik için existsBySlugAndLanguage() kullanılır.
     */
    @Query("""
           SELECT s FROM Page s
           LEFT JOIN FETCH s.documents
           WHERE s.slug = :slug AND s.language = :language AND s.published = true
           """)
    Optional<Page> findPublishedBySlugAndLanguage(@Param("slug") String slug, @Param("language") String language);

    /**
     * Adres KULLANIMDA mı — yayın durumuna BAKMAKSIZIN.
     *
     * Benzersizlik veritabanında (slug, dil) UNIQUE kısıtıyla sağlanıyor;
     * o kısıt da yayın durumuna bakmaz. Denetimin kısıtla aynı soruyu
     * sorması gerekir, yoksa denetim geçer ve kayıt kısıta çarpar.
     */
    boolean existsBySlugAndLanguage(String slug, String language);

    /** SEO ve liste yanıtlarında içerik/belge ilişkisini yüklemeden sayfayı bulur. */
    Optional<Page> findFirstBySlugAndLanguageAndPublishedTrue(String slug, String language);

    boolean existsBySlugAndLanguageAndPublishedTrue(String slug, String language);

    /**
     * Sıralama id ile de bağlanır: yayındaki sayfalarda aynı dilde aynı sıra
     * numarasını paylaşan 16 grup var (ölçüldü). Bu liste ziyaretçiye sıralı
     * gösterilmiyor, ama site haritasını üretiyor; eşitlik çözülmeden kalırsa
     * harita satırlarının sırası kayıt güncellendikçe değişir ve tarayıcı
     * robotlarına gereksiz değişiklik gibi görünür.
     */
    List<Page> findByLanguageAndPublishedTrueOrderBySortOrderAscIdAsc(String language);
}
