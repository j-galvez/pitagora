package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Clientes;
import java.util.Optional;

@Repository
public interface ClientesRepository extends JpaRepository<Clientes, Integer> {
    
    // Buscar cliente por RUT (único)
    Optional<Clientes> findByRut(String rut);
    
    // Buscar clientes por nombre (búsqueda parcial)
    java.util.List<Clientes> findByNombreEmpresaContainingIgnoreCase(String nombre);
}
