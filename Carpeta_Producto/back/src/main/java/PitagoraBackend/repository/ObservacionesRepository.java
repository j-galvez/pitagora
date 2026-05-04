package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Observaciones;
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
}


