package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Obras;
import java.util.List;

@Repository
public interface ObrasRepository extends JpaRepository<Obras, Integer> {
    
    // Buscar todas las obras de un cliente
    List<Obras> findByIdCliente_IdCliente(Integer idCliente);
    
    // Buscar obras por nombre
    List<Obras> findByNombreObraContainingIgnoreCase(String nombre);
}
