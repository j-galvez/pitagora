package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.model.Observaciones;
import PitagoraBackend.repository.ObservacionesRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ObservacionesService {
    
    @Autowired
    private ObservacionesRepository observacionesRepository;
    
    // CREATE - Crear una nueva observación
    public Observaciones crearObservacion(Observaciones observacion) {
        observacion.setFecha_registro(LocalDateTime.now());
        if (observacion.getEstado_observacion() == null) {
            observacion.setEstado_observacion(Observaciones.EstadoObservacionEnum.PENDIENTE);
        }
        if (observacion.getConfirmacion_cliente() == null) {
            observacion.setConfirmacion_cliente(Observaciones.ConfirmacionClienteEnum.PENDIENTE);
        }
        if (observacion.getIntentos_recordatorio() == null) {
            observacion.setIntentos_recordatorio(0);
        }
        return observacionesRepository.save(observacion);
    }
    
    // READ - Obtener todas las observaciones
    public List<Observaciones> obtenerTodas() {
        return observacionesRepository.findAll();
    }
    
    // READ - Obtener una observación por ID
    public Optional<Observaciones> obtenerPorId(Integer id) {
        return observacionesRepository.findById(id);
    }
    
    // READ - Obtener observaciones por ticket
    public List<Observaciones> obtenerPorTicket(Integer idTicket) {
        return observacionesRepository.findByIdTicket_IdTicket(idTicket);
    }
    
    // READ - Obtener observaciones por categoría
    public List<Observaciones> obtenerPorCategoria(Integer idCategoria) {
        return observacionesRepository.findByIdCategoria_IdCategoria(idCategoria);
    }
    
    // READ - Obtener observaciones por estado
    public List<Observaciones> obtenerPorEstado(Observaciones.EstadoObservacionEnum estado) {
        return observacionesRepository.findByEstadoObservacion(estado);
    }
    
    // READ - Obtener observaciones por urgencia
    public List<Observaciones> obtenerPorUrgencia(Observaciones.UrgenciaEnum urgencia) {
        return observacionesRepository.findByUrgencia(urgencia);
    }
    
    // READ - Obtener por token
    public Optional<Observaciones> obtenerPorToken(String token) {
        Observaciones observacion = observacionesRepository.findByTokenAceptacion(token);
        return Optional.ofNullable(observacion);
    }
    
    // UPDATE - Actualizar una observación
    public Observaciones actualizarObservacion(Integer id, Observaciones observacionActualizada) {
        Optional<Observaciones> observacionExistente = observacionesRepository.findById(id);
        if (observacionExistente.isPresent()) {
            Observaciones observacion = observacionExistente.get();
            
            if (observacionActualizada.getFalla() != null) {
                observacion.setFalla(observacionActualizada.getFalla());
            }
            if (observacionActualizada.getUbicacion_exacta() != null) {
                observacion.setUbicacion_exacta(observacionActualizada.getUbicacion_exacta());
            }
            if (observacionActualizada.getDescripcion_problema() != null) {
                observacion.setDescripcion_problema(observacionActualizada.getDescripcion_problema());
            }
            if (observacionActualizada.getUrgencia() != null) {
                observacion.setUrgencia(observacionActualizada.getUrgencia());
            }
            if (observacionActualizada.getEstado_observacion() != null) {
                observacion.setEstado_observacion(observacionActualizada.getEstado_observacion());
            }
            if (observacionActualizada.getConfirmacion_cliente() != null) {
                observacion.setConfirmacion_cliente(observacionActualizada.getConfirmacion_cliente());
            }
            if (observacionActualizada.getFecha_confirmacion() != null) {
                observacion.setFecha_confirmacion(observacionActualizada.getFecha_confirmacion());
            }
            if (observacionActualizada.getComentario_cliente() != null) {
                observacion.setComentario_cliente(observacionActualizada.getComentario_cliente());
            }
            if (observacionActualizada.getIntentos_recordatorio() != null) {
                observacion.setIntentos_recordatorio(observacionActualizada.getIntentos_recordatorio());
            }
            if (observacionActualizada.getFecha_termino() != null) {
                observacion.setFecha_termino(observacionActualizada.getFecha_termino());
            }
            
            return observacionesRepository.save(observacion);
        }
        return null;
    }
    
    // DELETE - Eliminar una observación
    public boolean eliminarObservacion(Integer id) {
        if (observacionesRepository.existsById(id)) {
            observacionesRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
