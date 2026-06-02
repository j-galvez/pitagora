package PitagoraBackend.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import PitagoraBackend.model.Usuarios;

@Repository
public interface UsuariosRepository extends JpaRepository<Usuarios, Integer> {
    boolean existsByCorreo(String correo);

    boolean existsByRun(String run);

    Optional<Usuarios> findByCorreo(String correo);

    List<Usuarios> findByIdObra(Integer idObra);

    @Query(value = "SELECT DISTINCT u.* FROM usuarios u " +
            "LEFT JOIN obras_usuarios ou ON u.id_usuario = ou.id_usuario AND ou.id_obra = :idObra " +
            "WHERE u.id_obra = :idObra OR ou.id_usuario IS NOT NULL",
            nativeQuery = true)
    List<Usuarios> findAsignadosAObra(@Param("idObra") Integer idObra);
}
