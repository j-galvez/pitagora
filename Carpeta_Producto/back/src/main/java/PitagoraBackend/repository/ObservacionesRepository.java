package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Observaciones;
import java.util.List;

@Repository
public interface ObservacionesRepository extends JpaRepository<Observaciones, Integer> {
    
    // Buscar observaciones por ticket
    List<Observaciones> findByIdTicket_IdTicket(Integer idTicket);
    
    // Buscar observaciones por categoría
    List<Observaciones> findByIdCategoria_IdCategoria(Integer idCategoria);
    
    // Buscar observaciones por estado
    List<Observaciones> findByEstadoObservacion(Observaciones.EstadoObservacionEnum estado);
    
    // Buscar observaciones por urgencia
    List<Observaciones> findByUrgencia(Observaciones.UrgenciaEnum urgencia);
    
    // Buscar por token de aceptación
    Observaciones findByTokenAceptacion(String token);
}
