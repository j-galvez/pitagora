package PitagoraBackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import PitagoraBackend.model.CorreosEntrantes;

@Repository
public interface CorreosEntrantesRepository extends JpaRepository<CorreosEntrantes, Integer> {

    List<CorreosEntrantes> findAllByOrderByFechaRecepcionDesc();

    List<CorreosEntrantes> findByAsuntoNormalizadoAndIdUsuarioOrderByFechaRecepcionAsc(
            String asuntoNormalizado, Integer idUsuario);
}
