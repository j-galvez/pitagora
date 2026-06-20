package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Obras;
import PitagoraBackend.dto.ObraDTO;
import java.util.List;

@Repository
public interface ObrasRepository extends JpaRepository<Obras, Integer> {
    Long countByEstadoObra(String estadoObra);

    List<Obras> findByIdCliente(Integer idCliente);

    // Consulta SQL Nativa para cruzar los datos de las obras con clientes, regiones, comunas y contar observaciones abiertas
    @Query(value = "SELECT o.id_obra AS idObra, o.nombre_obra AS nombreObra, " +
                   "o.descripcion_obra AS descripcionObra, o.direccion_calle AS direccion, " +
                   "o.planos_presupuestos AS planosPresupuestos, o.fecha_entrega AS fechaEntrega, " +
                   "o.garantia_expira AS garantiaExpira, o.estado_obra AS estadoObra, " +
                   "o.fecha_creacion AS fechaCreacion, " +
                   "o.id_cliente AS idCliente, c.nombre_empresa AS nombreEmpresa, c.estado AS estadoCliente, " +
                   "o.id_region AS idRegion, r.nombre_region AS nombreRegion, " +
                   "o.id_comuna AS idComuna, com.nombre_comuna AS nombreComuna, " +
                   "COALESCE(COUNT(DISTINCT obs.id_observacion), 0) AS numeroObservacionesAbiertas " +
                   "FROM obras o " +
                   "LEFT JOIN clientes c ON o.id_cliente = c.id_cliente " +
                   "LEFT JOIN regiones r ON o.id_region = r.id_region " +
                   "LEFT JOIN comunas com ON o.id_comuna = com.id_comuna " +
                   "LEFT JOIN tickets t ON o.id_obra = t.id_obra " +
                   "LEFT JOIN observaciones obs ON t.id_ticket = obs.id_ticket " +
                   "    AND obs.estado_observacion IN ('pendiente', 'en observación', 'aplica', 'en proceso', 'en espera aceptación') " +
                   "GROUP BY o.id_obra, o.nombre_obra, o.descripcion_obra, o.direccion_calle, " +
                   "    o.planos_presupuestos, o.fecha_entrega, o.garantia_expira, o.estado_obra, " +
                   "    o.fecha_creacion, o.id_cliente, c.nombre_empresa, c.estado, o.id_region, r.nombre_region, " +
                   "    o.id_comuna, com.nombre_comuna " +
                   "ORDER BY o.nombre_obra",
           nativeQuery = true)
    List<ObraDTO> findAllObrasConDetalles();

    // Consulta para obtener una obra específica con todos sus detalles y conteo de observaciones
    @Query(value = "SELECT o.id_obra AS idObra, o.nombre_obra AS nombreObra, " +
                   "o.descripcion_obra AS descripcionObra, o.direccion_calle AS direccion, " +
                   "o.planos_presupuestos AS planosPresupuestos, o.fecha_entrega AS fechaEntrega, " +
                   "o.garantia_expira AS garantiaExpira, o.estado_obra AS estadoObra, " +
                   "o.fecha_creacion AS fechaCreacion, " +
                   "o.id_cliente AS idCliente, c.nombre_empresa AS nombreEmpresa, c.estado AS estadoCliente, " +
                   "o.id_region AS idRegion, r.nombre_region AS nombreRegion, " +
                   "o.id_comuna AS idComuna, com.nombre_comuna AS nombreComuna, " +
                   "COALESCE(COUNT(DISTINCT obs.id_observacion), 0) AS numeroObservacionesAbiertas " +
                   "FROM obras o " +
                   "LEFT JOIN clientes c ON o.id_cliente = c.id_cliente " +
                   "LEFT JOIN regiones r ON o.id_region = r.id_region " +
                   "LEFT JOIN comunas com ON o.id_comuna = com.id_comuna " +
                   "LEFT JOIN tickets t ON o.id_obra = t.id_obra " +
                   "LEFT JOIN observaciones obs ON t.id_ticket = obs.id_ticket " +
                   "    AND obs.estado_observacion IN ('pendiente', 'en observación', 'aplica', 'en proceso', 'en espera aceptación') " +
                   "WHERE o.id_obra = :idObra " +
                   "GROUP BY o.id_obra, o.nombre_obra, o.descripcion_obra, o.direccion_calle, " +
                   "    o.planos_presupuestos, o.fecha_entrega, o.garantia_expira, o.estado_obra, " +
                   "    o.fecha_creacion, o.id_cliente, c.nombre_empresa, c.estado, o.id_region, r.nombre_region, " +
                   "    o.id_comuna, com.nombre_comuna",
           nativeQuery = true)
    ObraDTO findObraConDetallesById(Integer idObra);

    // Consulta para obtener todas las obras de un cliente específico
    @Query(value = "SELECT o.id_obra AS idObra, o.nombre_obra AS nombreObra, " +
                   "o.descripcion_obra AS descripcionObra, o.direccion_calle AS direccion, " +
                   "o.planos_presupuestos AS planosPresupuestos, o.fecha_entrega AS fechaEntrega, " +
                   "o.garantia_expira AS garantiaExpira, o.estado_obra AS estadoObra, " +
                   "o.fecha_creacion AS fechaCreacion, " +
                   "o.id_cliente AS idCliente, c.nombre_empresa AS nombreEmpresa, c.estado AS estadoCliente, " +
                   "o.id_region AS idRegion, r.nombre_region AS nombreRegion, " +
                   "o.id_comuna AS idComuna, com.nombre_comuna AS nombreComuna, " +
                   "COALESCE(COUNT(DISTINCT obs.id_observacion), 0) AS numeroObservacionesAbiertas " +
                   "FROM obras o " +
                   "LEFT JOIN clientes c ON o.id_cliente = c.id_cliente " +
                   "LEFT JOIN regiones r ON o.id_region = r.id_region " +
                   "LEFT JOIN comunas com ON o.id_comuna = com.id_comuna " +
                   "LEFT JOIN tickets t ON o.id_obra = t.id_obra " +
                   "LEFT JOIN observaciones obs ON t.id_ticket = obs.id_ticket " +
                   "    AND obs.estado_observacion IN ('pendiente', 'en observación', 'aplica', 'en proceso', 'en espera aceptación') " +
                   "WHERE o.id_cliente = :idCliente " +
                   "GROUP BY o.id_obra, o.nombre_obra, o.descripcion_obra, o.direccion_calle, " +
                   "    o.planos_presupuestos, o.fecha_entrega, o.garantia_expira, o.estado_obra, " +
                   "    o.fecha_creacion, o.id_cliente, c.nombre_empresa, c.estado, o.id_region, r.nombre_region, " +
                   "    o.id_comuna, com.nombre_comuna " +
                   "ORDER BY o.nombre_obra",
           nativeQuery = true)
    List<ObraDTO> findObrasByCliente(Integer idCliente);
}
