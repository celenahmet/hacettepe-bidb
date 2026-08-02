package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.AdminAccount;

import java.util.Optional;

public interface AdminAccountRepo extends JpaRepository<AdminAccount, Long> {
    Optional<AdminAccount> findByUsername(String username);
    Optional<AdminAccount> findFirstByOrderByIdAsc();
}
