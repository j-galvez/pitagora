package PitagoraBackend.repository;

import PitagoraBackend.model.NotificacionesEnviadas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionesEnviadasRepository extends JpaRepository<NotificacionesEnviadas, Integer> {
    List<NotificacionesEnviadas> findByIdObservacionOrderByFechaEnvioAsc(Integer idObservacion);
}
