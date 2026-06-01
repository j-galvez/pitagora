package PitagoraBackend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import PitagoraBackend.model.Mensajes;

@Repository
public interface MensajesRepository extends JpaRepository<Mensajes, Integer> {

    List<Mensajes> findByIdObservacionOrderByFechaEnvioAsc(Integer idObservacion);

    List<Mensajes> findByIdUsuario(Integer idUsuario);

    Optional<Mensajes> findByIdEvidencia(Integer idEvidencia);
}
