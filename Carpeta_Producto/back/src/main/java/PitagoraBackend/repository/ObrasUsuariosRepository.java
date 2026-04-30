package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.ObrasUsuarios;
import PitagoraBackend.model.ObrasUsuariosId;
import java.util.List;

@Repository
public interface ObrasUsuariosRepository extends JpaRepository<ObrasUsuarios, ObrasUsuariosId> {
    
    // Buscar todos los usuarios de una obra
    List<ObrasUsuarios> findByIdObra_IdObra(Integer idObra);
    
    // Buscar todas las obras de un usuario
    List<ObrasUsuarios> findByIdUsuario_IdUsuario(Integer idUsuario);
}
