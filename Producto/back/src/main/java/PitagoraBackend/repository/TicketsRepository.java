package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Tickets;

@Repository
public interface TicketsRepository extends JpaRepository <Tickets, Integer>{
    
    // Contar tickets por estado
    @Query("SELECT COUNT(t) FROM Tickets t WHERE t.estadoGeneral IN ('abierto', 'en proceso')")
    Long countTicketsAbiertos();
}
