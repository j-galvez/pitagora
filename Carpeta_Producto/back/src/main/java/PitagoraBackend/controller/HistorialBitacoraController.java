package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.HistorialBitacora;
import PitagoraBackend.service.HistorialBitacoraService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/historial")
@CrossOrigin(origins = "*")
public class HistorialBitacoraController {
    
    @Autowired
    private HistorialBitacoraService historialService;
    
    // CREATE - Registrar una acción en el historial
    @PostMapping
    public ResponseEntity<?> registrarAccion(@RequestBody HistorialBitacora historial) {
        try {
            HistorialBitacora historialCreado = historialService.registrarAccion(historial);
            return new ResponseEntity<>(historialCreado, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al registrar acción: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // READ - Obtener todo el historial
    @GetMapping
    public ResponseEntity<?> obtenerTodos() {
        try {
            List<HistorialBitacora> historial = historialService.obtenerTodos();
            return new ResponseEntity<>(historial, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener historial: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener un registro por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        try {
            Optional<HistorialBitacora> historial = historialService.obtenerPorId(id);
            if (historial.isPresent()) {
                return new ResponseEntity<>(historial.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Registro no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener registro: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener historial por observación
    @GetMapping("/observacion/{idObservacion}")
    public ResponseEntity<?> obtenerPorObservacion(@PathVariable Integer idObservacion) {
        try {
            List<HistorialBitacora> historial = historialService.obtenerPorObservacion(idObservacion);
            return new ResponseEntity<>(historial, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener historial: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener historial por usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> obtenerPorUsuario(@PathVariable Integer idUsuario) {
        try {
            List<HistorialBitacora> historial = historialService.obtenerPorUsuario(idUsuario);
            return new ResponseEntity<>(historial, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener historial: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener historial ordenado por fecha descendente
    @GetMapping("/ordenado")
    public ResponseEntity<?> obtenerOrdenado() {
        try {
            List<HistorialBitacora> historial = historialService.obtenerOrdenado();
            return new ResponseEntity<>(historial, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener historial: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // NOTA: El historial es INMUTABLE (solo lectura) para garantizar auditoría legal
    // NO se permite actualizar ni eliminar registros
}
