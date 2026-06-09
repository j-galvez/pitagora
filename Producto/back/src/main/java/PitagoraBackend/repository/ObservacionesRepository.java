package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Observaciones;
import PitagoraBackend.dto.TopFallaDTO;
import PitagoraBackend.dto.ObraConIncidenciasDTO;
import PitagoraBackend.dto.ReporteObraDTO;
import org.springframework.data.repository.query.Param;
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
    
    // Buscar observaciones por múltiples tickets
    List<Observaciones> findByIdTicketIn(List<Integer> idTickets);
    
    // QUERIES PARA DASHBOARD
    
    // Contar observaciones abiertas (pendiente, en observación, aplica, en proceso)
    @Query("SELECT COUNT(o) FROM Observaciones o WHERE o.estadoObservacion IN ('pendiente', 'en observación', 'aplica', 'en proceso')")
    Long countObservacionesAbiertas();
    
    // Contar observaciones de alta urgencia que no están terminadas
    @Query("SELECT COUNT(o) FROM Observaciones o WHERE o.urgencia = 'alta' AND o.estadoObservacion != 'terminado' AND o.estadoObservacion != 'no aplica'")
    Long countObservacionesAltaUrgencia();
    
    // Top 5 categorías más reportadas
    @Query("SELECT new PitagoraBackend.dto.TopFallaDTO(c.nombreCategoria, COUNT(o)) " +
           "FROM Observaciones o, Categorias c " +
           "WHERE o.idCategoria = c.idCategoria " +
           "GROUP BY c.nombreCategoria " +
           "ORDER BY COUNT(o) DESC")
    List<TopFallaDTO> findTop5Fallas();
    
    // Obras por categoría (drill-down)
    @Query("SELECT new PitagoraBackend.dto.ObraConIncidenciasDTO(ob.idObra, ob.nombreObra, COUNT(o)) " +
           "FROM Observaciones o, Tickets t, Obras ob " +
           "WHERE o.idTicket = t.idTicket " +
           "AND t.idObra = ob.idObra " +
           "AND o.idCategoria = :idCategoria " +
           "GROUP BY ob.idObra, ob.nombreObra " +
           "ORDER BY COUNT(o) DESC")
    List<ObraConIncidenciasDTO> findObrasByCategoria(Integer idCategoria);

    // REPORTE DE TRAZABILIDAD DE OBRAS
    @Query("SELECT new PitagoraBackend.dto.ReporteObraDTO(" +
           "ob.nombreObra, " +
           "concat(u.nombre, ' ', u.apellidoPaterno), " +
           "o.fechaRegistro, " +
           "o.fechaTermino, " +
           "o.falla, " +
           "o.ubicacionExacta, " +
           "o.estadoObservacion, " +
           "o.comentarioAdmin) " +
           "FROM Observaciones o, Tickets t, Obras ob, Usuarios u " +
           "WHERE o.idTicket = t.idTicket " +
           "AND t.idObra = ob.idObra " +
           "AND o.idUsuarioCreador = u.idUsuario")
    List<ReporteObraDTO> findReporteTrazabilidad();

    // BÚSQUEDA OMNIBOX
    @Query("SELECT o FROM Observaciones o WHERE " +
           "LOWER(o.falla) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(o.descripcionProblema) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(o.ubicacionExacta) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Observaciones> searchObservaciones(@Param("query") String query);
}


