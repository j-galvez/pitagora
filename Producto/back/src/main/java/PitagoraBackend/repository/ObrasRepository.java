package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Obras;

@Repository
public interface ObrasRepository extends JpaRepository<Obras, Integer> {
    
}
