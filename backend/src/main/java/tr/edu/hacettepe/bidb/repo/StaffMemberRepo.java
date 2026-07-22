package tr.edu.hacettepe.bidb.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tr.edu.hacettepe.bidb.model.StaffMember;

public interface StaffMemberRepo extends JpaRepository<StaffMember, Long> {
}
