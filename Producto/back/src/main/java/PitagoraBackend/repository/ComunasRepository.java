package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Comunas;
import java.util.List;

@Repository
public interface ComunasRepository extends JpaRepository<Comunas, Integer> {
    
    // Buscar comunas por región
    List<Comunas> findByIdRegion(Integer idRegion);
    
    // Buscar comunas por nombre
    List<Comunas> findByNombreComunaContainingIgnoreCase(String nombreComuna);
}

// Made with Bob
