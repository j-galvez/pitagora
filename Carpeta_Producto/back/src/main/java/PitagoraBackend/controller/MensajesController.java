package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.Mensajes;
import PitagoraBackend.service.MensajesService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/mensajes")
@CrossOrigin(origins = "*")
public class MensajesController {
    
    @Autowired
    private MensajesService mensajesService;
    
    // CREATE - Crear un nuevo mensaje
    @PostMapping
    public ResponseEntity<?> crearMensaje(@RequestBody Mensajes mensaje) {
        try {
            Mensajes mensajeCreado = mensajesService.crearMensaje(mensaje);
            return new ResponseEntity<>(mensajeCreado, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear mensaje: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // READ - Obtener todos los mensajes
    @GetMapping
    public ResponseEntity<?> obtenerTodos() {
        try {
            List<Mensajes> mensajes = mensajesService.obtenerTodos();
            return new ResponseEntity<>(mensajes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener mensajes: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener un mensaje por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        try {
            Optional<Mensajes> mensaje = mensajesService.obtenerPorId(id);
            if (mensaje.isPresent()) {
                return new ResponseEntity<>(mensaje.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Mensaje no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener mensaje: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener mensajes por observación
    @GetMapping("/observacion/{idObservacion}")
    public ResponseEntity<?> obtenerPorObservacion(@PathVariable Integer idObservacion) {
        try {
            List<Mensajes> mensajes = mensajesService.obtenerPorObservacion(idObservacion);
            return new ResponseEntity<>(mensajes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener mensajes: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener mensajes por usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> obtenerPorUsuario(@PathVariable Integer idUsuario) {
        try {
            List<Mensajes> mensajes = mensajesService.obtenerPorUsuario(idUsuario);
            return new ResponseEntity<>(mensajes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener mensajes: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // UPDATE - Actualizar un mensaje
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarMensaje(@PathVariable Integer id, @RequestBody Mensajes mensajeActualizado) {
        try {
            Mensajes mensajeUpdated = mensajesService.actualizarMensaje(id, mensajeActualizado);
            if (mensajeUpdated != null) {
                return new ResponseEntity<>(mensajeUpdated, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Mensaje no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar mensaje: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // DELETE - Eliminar un mensaje
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarMensaje(@PathVariable Integer id) {
        try {
            boolean eliminado = mensajesService.eliminarMensaje(id);
            if (eliminado) {
                return new ResponseEntity<>("Mensaje eliminado correctamente", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Mensaje no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar mensaje: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
