package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Tickets;
import java.util.List;

@Repository
public interface TicketsRepository extends JpaRepository<Tickets, Integer> {
    
    // Buscar todos los tickets de una obra
    List<Tickets> findByIdObra_IdObra(Integer idObra);
    
    // Buscar todos los tickets creados por un usuario
    List<Tickets> findByIdUsuarioCreador_IdUsuario(Integer idUsuario);
}
