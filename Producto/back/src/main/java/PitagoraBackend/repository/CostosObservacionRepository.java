package PitagoraBackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import PitagoraBackend.model.CostosObservacion;

public interface CostosObservacionRepository extends JpaRepository<CostosObservacion, Integer> {

    List<CostosObservacion> findByIdObservacionOrderByFechaRegistroDesc(Integer idObservacion);

    @Query("SELECT COALESCE(SUM(c.monto), 0) FROM CostosObservacion c WHERE c.idObservacion = :idObservacion")
    Long sumMontoByIdObservacion(@Param("idObservacion") Integer idObservacion);
}
