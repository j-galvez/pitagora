package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.model.HistorialBitacora;
import PitagoraBackend.repository.HistorialBitacoraRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HistorialBitacoraService {
    
    @Autowired
    private HistorialBitacoraRepository historialRepository;
    
    // CREATE - Crear un nuevo registro en el historial (Registra automáticamente la acción)
    public HistorialBitacora registrarAccion(HistorialBitacora historial) {
        historial.setSello_tiempo(LocalDateTime.now());
        historial.setFecha_creacion(LocalDateTime.now());
        return historialRepository.save(historial);
    }
    
    // READ - Obtener todos los registros
    public List<HistorialBitacora> obtenerTodos() {
        return historialRepository.findAll();
    }
    
    // READ - Obtener un registro por ID
    public Optional<HistorialBitacora> obtenerPorId(Integer id) {
        return historialRepository.findById(id);
    }
    
    // READ - Obtener historial por observación
    public List<HistorialBitacora> obtenerPorObservacion(Integer idObservacion) {
        return historialRepository.findByIdObservacion_IdObservacion(idObservacion);
    }
    
    // READ - Obtener historial por usuario
    public List<HistorialBitacora> obtenerPorUsuario(Integer idUsuario) {
        return historialRepository.findByIdUsuario_IdUsuario(idUsuario);
    }
    
    // READ - Obtener todo el historial ordenado por fecha descendente
    public List<HistorialBitacora> obtenerOrdenado() {
        return historialRepository.findAllByOrderBySelloTiempoDesc();
    }
    
    // UPDATE - NO SE PERMITE ACTUALIZAR (Historial es inmutable)
    // El historial debe ser de solo lectura para garantizar auditoría legal
    
    // DELETE - NO SE PERMITE ELIMINAR (Historial es inmutable)
    // El historial debe ser de solo lectura para garantizar auditoría legal
    
    // Método auxiliar para registrar acciones comunes
    public HistorialBitacora registrarCambioEstado(Integer idObservacion, Integer idUsuario, 
                                                    String estadoAnterior, String estadoNuevo) {
        HistorialBitacora historial = new HistorialBitacora();
        historial.setAccion("Cambio de estado de " + estadoAnterior + " a " + estadoNuevo);
        historial.setDetalles("Cambio de estado automatizado");
        return registrarAccion(historial);
    }
}
