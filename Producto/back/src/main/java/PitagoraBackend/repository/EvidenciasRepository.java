package PitagoraBackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import PitagoraBackend.model.Evidencias;

@Repository
public interface EvidenciasRepository extends JpaRepository<Evidencias, Integer> {

    List<Evidencias> findByIdObservacion(Integer idObservacion);
}
