package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Mensajes;
import java.util.List;

@Repository
public interface MensajesRepository extends JpaRepository<Mensajes, Integer> {
    
    // Buscar mensajes por observación
    List<Mensajes> findByIdObservacion_IdObservacion(Integer idObservacion);
    
    // Buscar mensajes por usuario
    List<Mensajes> findByIdUsuario_IdUsuario(Integer idUsuario);
}
