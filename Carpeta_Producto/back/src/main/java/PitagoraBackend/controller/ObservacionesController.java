package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.Observaciones;
import PitagoraBackend.service.ObservacionesService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/observaciones")
@CrossOrigin(origins = "*")
public class ObservacionesController {
    
    @Autowired
    private ObservacionesService observacionesService;
    
    // CREATE - Crear una nueva observación
    @PostMapping
    public ResponseEntity<?> crearObservacion(@RequestBody Observaciones observacion) {
        try {
            Observaciones observacionCreada = observacionesService.crearObservacion(observacion);
            return new ResponseEntity<>(observacionCreada, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear observación: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // READ - Obtener todas las observaciones
    @GetMapping
    public ResponseEntity<?> obtenerTodas() {
        try {
            List<Observaciones> observaciones = observacionesService.obtenerTodas();
            return new ResponseEntity<>(observaciones, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener observaciones: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener una observación por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        try {
            Optional<Observaciones> observacion = observacionesService.obtenerPorId(id);
            if (observacion.isPresent()) {
                return new ResponseEntity<>(observacion.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Observación no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener observación: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener observaciones por ticket
    @GetMapping("/ticket/{idTicket}")
    public ResponseEntity<?> obtenerPorTicket(@PathVariable Integer idTicket) {
        try {
            List<Observaciones> observaciones = observacionesService.obtenerPorTicket(idTicket);
            return new ResponseEntity<>(observaciones, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener observaciones: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener observaciones por categoría
    @GetMapping("/categoria/{idCategoria}")
    public ResponseEntity<?> obtenerPorCategoria(@PathVariable Integer idCategoria) {
        try {
            List<Observaciones> observaciones = observacionesService.obtenerPorCategoria(idCategoria);
            return new ResponseEntity<>(observaciones, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener observaciones: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener por token
    @GetMapping("/token/{token}")
    public ResponseEntity<?> obtenerPorToken(@PathVariable String token) {
        try {
            Optional<Observaciones> observacion = observacionesService.obtenerPorToken(token);
            if (observacion.isPresent()) {
                return new ResponseEntity<>(observacion.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Token inválido", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener observación: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // UPDATE - Actualizar una observación
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarObservacion(@PathVariable Integer id, @RequestBody Observaciones observacionActualizada) {
        try {
            Observaciones observacionUpdated = observacionesService.actualizarObservacion(id, observacionActualizada);
            if (observacionUpdated != null) {
                return new ResponseEntity<>(observacionUpdated, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Observación no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar observación: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // DELETE - Eliminar una observación
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarObservacion(@PathVariable Integer id) {
        try {
            boolean eliminada = observacionesService.eliminarObservacion(id);
            if (eliminada) {
                return new ResponseEntity<>("Observación eliminada correctamente", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Observación no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar observación: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
