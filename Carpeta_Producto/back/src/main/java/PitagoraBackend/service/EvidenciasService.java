package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.model.Evidencias;
import PitagoraBackend.repository.EvidenciasRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EvidenciasService {
    
    @Autowired
    private EvidenciasRepository evidenciasRepository;
    
    // CREATE - Crear una nueva evidencia
    public Evidencias crearEvidencia(Evidencias evidencia) {
        evidencia.setFecha_subida(LocalDateTime.now());
        if (evidencia.getMomento() == null) {
            evidencia.setMomento(Evidencias.MomentoEnum.ANTES);
        }
        return evidenciasRepository.save(evidencia);
    }
    
    // READ - Obtener todas las evidencias
    public List<Evidencias> obtenerTodas() {
        return evidenciasRepository.findAll();
    }
    
    // READ - Obtener una evidencia por ID
    public Optional<Evidencias> obtenerPorId(Integer id) {
        return evidenciasRepository.findById(id);
    }
    
    // READ - Obtener evidencias por observación
    public List<Evidencias> obtenerPorObservacion(Integer idObservacion) {
        return evidenciasRepository.findByIdObservacion_IdObservacion(idObservacion);
    }
    
    // READ - Obtener evidencias por tipo de archivo
    public List<Evidencias> obtenerPorTipo(Evidencias.TipoArchivoEnum tipo) {
        return evidenciasRepository.findByTipoArchivo(tipo);
    }
    
    // READ - Obtener evidencias por momento
    public List<Evidencias> obtenerPorMomento(Evidencias.MomentoEnum momento) {
        return evidenciasRepository.findByMomento(momento);
    }
    
    // UPDATE - Actualizar una evidencia
    public Evidencias actualizarEvidencia(Integer id, Evidencias evidenciaActualizada) {
        Optional<Evidencias> evidenciaExistente = evidenciasRepository.findById(id);
        if (evidenciaExistente.isPresent()) {
            Evidencias evidencia = evidenciaExistente.get();
            
            if (evidenciaActualizada.getUrl_archivo() != null) {
                evidencia.setUrl_archivo(evidenciaActualizada.getUrl_archivo());
            }
            if (evidenciaActualizada.getTipo_archivo() != null) {
                evidencia.setTipo_archivo(evidenciaActualizada.getTipo_archivo());
            }
            if (evidenciaActualizada.getMomento() != null) {
                evidencia.setMomento(evidenciaActualizada.getMomento());
            }
            
            return evidenciasRepository.save(evidencia);
        }
        return null;
    }
    
    // DELETE - Eliminar una evidencia
    public boolean eliminarEvidencia(Integer id) {
        if (evidenciasRepository.existsById(id)) {
            evidenciasRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
