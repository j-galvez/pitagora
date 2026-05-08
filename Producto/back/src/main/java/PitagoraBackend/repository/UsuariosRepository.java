package PitagoraBackend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Usuarios;
import java.util.Optional;

@Repository
public interface UsuariosRepository extends JpaRepository<Usuarios, Integer> {
    boolean existsByCorreo(String correo);

    boolean existsByRun(String run);

    Optional<Usuarios> findByCorreo(String correo);
}
