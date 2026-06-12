package PitagoraBackend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import PitagoraBackend.model.Mensajes;

@Repository
public interface MensajesRepository extends JpaRepository<Mensajes, Integer> {

    List<Mensajes> findByIdObservacionOrderByFechaEnvioAsc(Integer idObservacion);

    List<Mensajes> findByIdUsuario(Integer idUsuario);

    Optional<Mensajes> findByIdEvidencia(Integer idEvidencia);

    @Query("SELECT m FROM Mensajes m WHERE LOWER(m.mensaje) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Mensajes> searchMensajes(@Param("query") String query);
}
