package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Observaciones;
import PitagoraBackend.dto.TopFallaDTO;
import java.util.List;

@Repository
public interface ObservacionesRepository extends JpaRepository<Observaciones, Integer> {
    
    // Buscar observaciones por ticket
    List<Observaciones> findByIdTicket(Integer idTicket);
    
    // Buscar observaciones por categoría
    List<Observaciones> findByIdCategoria(Integer idCategoria);
    
    // Buscar observaciones por estado
    List<Observaciones> findByEstadoObservacion(String estadoObservacion);
    
    // Buscar observaciones por urgencia
    List<Observaciones> findByUrgencia(String urgencia);
    
    // Buscar observaciones por confirmación del cliente
    List<Observaciones> findByConfirmacionCliente(String confirmacionCliente);
    
    // QUERIES PARA DASHBOARD
    
    // Contar observaciones abiertas (pendiente, en observación, aplica, en proceso)
    @Query("SELECT COUNT(o) FROM Observaciones o WHERE o.estadoObservacion IN ('pendiente', 'en observación', 'aplica', 'en proceso')")
    Long countObservacionesAbiertas();
    
    // Contar observaciones de alta urgencia que no están terminadas
    @Query("SELECT COUNT(o) FROM Observaciones o WHERE o.urgencia = 'alta' AND o.estadoObservacion != 'terminado' AND o.estadoObservacion != 'no aplica'")
    Long countObservacionesAltaUrgencia();
    
    // Top 5 categorías más reportadas
    @Query("SELECT new PitagoraBackend.dto.TopFallaDTO(c.nombreCategoria, COUNT(o)) " +
           "FROM Observaciones o JOIN Categorias c ON o.idCategoria = c.idCategoria " +
           "GROUP BY c.nombreCategoria " +
           "ORDER BY COUNT(o) DESC")
    List<TopFallaDTO> findTop5Fallas();
}


