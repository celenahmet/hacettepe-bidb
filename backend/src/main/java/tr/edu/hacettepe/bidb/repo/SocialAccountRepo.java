package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.SocialAccount;

import java.util.List;

public interface SocialAccountRepo extends JpaRepository<SocialAccount, Long> {
    List<SocialAccount> findByYayindaTrueOrderBySiraAsc();
}
