package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tr.edu.hacettepe.bidb.model.AdminPasswordReset;

import java.time.OffsetDateTime;
import java.util.Optional;

public interface AdminPasswordResetRepo extends JpaRepository<AdminPasswordReset, Long> {

    Optional<AdminPasswordReset> findByTokenHash(String tokenHash);

    /**
     * Hesabın bekleyen bütün jetonlarını geçersizleştirir.
     *
     * Bir jeton kullanıldığında çağrılır: aksi hâlde arka arkaya istenmiş
     * bağlantıların hepsi açık kalır ve saldırı penceresi genişler.
     */
    @Modifying
    @Query("update AdminPasswordReset r set r.usedAt = :an "
         + "where r.account.id = :hesapId and r.usedAt is null")
    int hepsiniGecersizKil(@Param("hesapId") Long hesapId, @Param("an") OffsetDateTime an);

    /** Belirli bir süre içinde o hesap için üretilmiş jeton sayısı (hız sınırı). */
    @Query("select count(r) from AdminPasswordReset r "
         + "where r.account.id = :hesapId and r.createdAt > :esik")
    long sayacSonra(@Param("hesapId") Long hesapId, @Param("esik") OffsetDateTime esik);
}
