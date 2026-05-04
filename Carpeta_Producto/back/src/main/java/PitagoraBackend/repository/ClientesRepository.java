package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Clientes;
import java.util.List;
import java.util.Optional;

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
}

// Made with Bob
