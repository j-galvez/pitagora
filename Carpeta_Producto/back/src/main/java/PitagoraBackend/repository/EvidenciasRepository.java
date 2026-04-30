package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Evidencias;
import java.util.List;

@Repository
public interface EvidenciasRepository extends JpaRepository<Evidencias, Integer> {
    
    // Buscar evidencias por observación
    List<Evidencias> findByIdObservacion_IdObservacion(Integer idObservacion);
    
    // Buscar evidencias por tipo de archivo
    List<Evidencias> findByTipoArchivo(Evidencias.TipoArchivoEnum tipoArchivo);
    
    // Buscar evidencias por momento (antes/después)
    List<Evidencias> findByMomento(Evidencias.MomentoEnum momento);
}
