package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.HistorialBitacora;
import java.util.List;

@Repository
public interface HistorialBitacoraRepository extends JpaRepository<HistorialBitacora, Integer> {
    
    // Buscar historial por observación
    List<HistorialBitacora> findByIdObservacion_IdObservacion(Integer idObservacion);
    
    // Buscar historial por usuario
    List<HistorialBitacora> findByIdUsuario_IdUsuario(Integer idUsuario);
    
    // Buscar historial ordenado por fecha descendente
    List<HistorialBitacora> findAllByOrderBySelloTiempoDesc();
}
