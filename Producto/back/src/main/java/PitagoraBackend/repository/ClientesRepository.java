package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Clientes;
import java.util.List;
import java.util.Optional;
import PitagoraBackend.dto.ClienteDTO;
import PitagoraBackend.dto.ClienteDetalleDTO;

@Repository
public interface ClientesRepository extends JpaRepository<Clientes, Integer> {
    
    // Buscar cliente por RUT (único)
    Optional<Clientes> findByRut(String rut);
    
    // Buscar clientes por nombre de empresa (puede haber varios con nombres similares)
    List<Clientes> findByNombreEmpresaContainingIgnoreCase(String nombreEmpresa);
    
    // Buscar clientes por estado
    List<Clientes> findByEstado(String estado);
    
    // Verificar si existe un cliente con un RUT específico
    boolean existsByRut(String rut);

    Long countByEstado(String estado);

    // Nuevo método para obtener clientes con el conteo de observaciones abiertas y obras
    @Query(value = "SELECT " +
                   "    c.id_cliente AS idCliente, " +
                   "    c.nombre_empresa AS nombreEmpresa, " +
                   "    c.rut AS rut, " +
                   "    c.correo_contacto AS correoContacto, " +
                   "    c.telefono AS telefono, " +
                   "    COALESCE(COUNT(DISTINCT obs.id_observacion), 0) AS numeroObservacionesAbiertas, " +
                   "    COALESCE(COUNT(DISTINCT o.id_obra), 0) AS numeroObras " +
                   "FROM clientes c " +
                   "LEFT JOIN obras o ON c.id_cliente = o.id_cliente " +
                   "LEFT JOIN tickets t ON o.id_obra = t.id_obra " +
                   "LEFT JOIN observaciones obs ON t.id_ticket = obs.id_ticket " +
                   "    AND obs.estado_observacion IN ('pendiente', 'en observación', 'aplica', 'en proceso', 'en espera aceptación') " +
                   "GROUP BY c.id_cliente, c.nombre_empresa, c.rut, c.correo_contacto, c.telefono " +
                   "ORDER BY c.nombre_empresa", nativeQuery = true)
    List<ClienteDTO> findAllClientesConObservaciones();

    @Query(value = "SELECT c.id_cliente AS idCliente, c.nombre_empresa AS nombreEmpresa, " +
                   "c.rut AS rut, c.correo_contacto AS correoContacto, c.telefono AS telefono, " +
                   "c.direccion_calle AS direccionCalle, c.id_region AS idRegion, " +
                   "r.nombre_region AS nombreRegion, c.id_comuna AS idComuna, " +
                   "com.nombre_comuna AS nombreComuna, c.estado AS estado, " +
                   "c.fecha_creacion AS fechaCreacion " +
                   "FROM clientes c " +
                   "LEFT JOIN regiones r ON c.id_region = r.id_region " +
                   "LEFT JOIN comunas com ON c.id_comuna = com.id_comuna " +
                   "WHERE c.id_cliente = :idCliente",
           nativeQuery = true)
    ClienteDetalleDTO findClienteConDetallesById(Integer idCliente);
}

// Made with Bob
