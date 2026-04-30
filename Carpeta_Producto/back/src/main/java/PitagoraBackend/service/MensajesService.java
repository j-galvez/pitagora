package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.model.Mensajes;
import PitagoraBackend.repository.MensajesRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MensajesService {
    
    @Autowired
    private MensajesRepository mensajesRepository;
    
    // CREATE - Crear un nuevo mensaje
    public Mensajes crearMensaje(Mensajes mensaje) {
        mensaje.setFecha_envio(LocalDateTime.now());
        return mensajesRepository.save(mensaje);
    }
    
    // READ - Obtener todos los mensajes
    public List<Mensajes> obtenerTodos() {
        return mensajesRepository.findAll();
    }
    
    // READ - Obtener un mensaje por ID
    public Optional<Mensajes> obtenerPorId(Integer id) {
        return mensajesRepository.findById(id);
    }
    
    // READ - Obtener mensajes por observación
    public List<Mensajes> obtenerPorObservacion(Integer idObservacion) {
        return mensajesRepository.findByIdObservacion_IdObservacion(idObservacion);
    }
    
    // READ - Obtener mensajes por usuario
    public List<Mensajes> obtenerPorUsuario(Integer idUsuario) {
        return mensajesRepository.findByIdUsuario_IdUsuario(idUsuario);
    }
    
    // UPDATE - Actualizar un mensaje
    public Mensajes actualizarMensaje(Integer id, Mensajes mensajeActualizado) {
        Optional<Mensajes> mensajeExistente = mensajesRepository.findById(id);
        if (mensajeExistente.isPresent()) {
            Mensajes mensaje = mensajeExistente.get();
            
            if (mensajeActualizado.getMensaje() != null) {
                mensaje.setMensaje(mensajeActualizado.getMensaje());
            }
            
            return mensajesRepository.save(mensaje);
        }
        return null;
    }
    
    // DELETE - Eliminar un mensaje
    public boolean eliminarMensaje(Integer id) {
        if (mensajesRepository.existsById(id)) {
            mensajesRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
