package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import PitagoraBackend.model.Observaciones;
import PitagoraBackend.service.ObservacionesService;

import java.util.List;

@RestController
@RequestMapping("/api/observaciones")
@CrossOrigin(origins = "*") // Asegura el acceso desde React (localhost:5173)
public class ObservacionesController {
    
    @Autowired
    private ObservacionesService observacionesService;

    // CREATE - Crear observación con soporte multipart/form-data
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> crear(
            @RequestPart("observacion") String observacionJson,
            @RequestPart(value = "fotos", required = false) MultipartFile[] fotos) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Observaciones observacion = objectMapper.readValue(observacionJson, Observaciones.class);
            Observaciones nueva = observacionesService.crearObservacionesConFotos(observacion, fotos);
            return ResponseEntity.ok(nueva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al procesar la observación y las imágenes: " + e.getMessage());
        }
    }

    // READ - Listar todas las observaciones
    @GetMapping
    public List<Observaciones> listar() {
        return observacionesService.obtenerObservaciones();
    }

    // READ - Obtener observación por ID
    @GetMapping("/{id_observacion}")
    public ResponseEntity<?> obtenerPorId(@PathVariable("id_observacion") Integer id_observacion) {
        try {
            return ResponseEntity.ok(observacionesService.obtenerObservacionById(id_observacion));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UPDATE - Actualizar observación
    @PutMapping("/{id_observacion}")
    public ResponseEntity<?> actualizar(@PathVariable("id_observacion") Integer id_observacion, @RequestBody Observaciones observacion) {
        try {
            Observaciones actualizada = observacionesService.actualizarObservaciones(id_observacion, observacion);
            return ResponseEntity.ok(actualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE - Eliminar observación
    @DeleteMapping("/{id_observacion}")
    public ResponseEntity<?> eliminar(@PathVariable("id_observacion") Integer id_observacion) {
        try {
            observacionesService.eliminarObservaciones(id_observacion);
            return ResponseEntity.ok("Observación eliminada correctamente");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Obtener observaciones por ticket
    @GetMapping("/ticket/{id_ticket}")
    public ResponseEntity<?> obtenerPorTicket(@PathVariable("id_ticket") Integer id_ticket) {
        try {
            List<Observaciones> observaciones = observacionesService.obtenerObservacionesPorTicket(id_ticket);
            return ResponseEntity.ok(observaciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Obtener observaciones por categoría
    @GetMapping("/categoria/{id_categoria}")
    public ResponseEntity<?> obtenerPorCategoria(@PathVariable("id_categoria") Integer id_categoria) {
        try {
            List<Observaciones> observaciones = observacionesService.obtenerObservacionesPorCategoria(id_categoria);
            return ResponseEntity.ok(observaciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Obtener observaciones por estado
    @GetMapping("/estado/{estado}")
    public ResponseEntity<?> obtenerPorEstado(@PathVariable("estado") String estado) {
        try {
            List<Observaciones> observaciones = observacionesService.obtenerObservacionesPorEstado(estado);
            return ResponseEntity.ok(observaciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Obtener observaciones por urgencia
    @GetMapping("/urgencia/{urgencia}")
    public ResponseEntity<?> obtenerPorUrgencia(@PathVariable("urgencia") String urgencia) {
        try {
            List<Observaciones> observaciones = observacionesService.obtenerObservacionesPorUrgencia(urgencia);
            return ResponseEntity.ok(observaciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Obtener observaciones por confirmación del cliente
    @GetMapping("/confirmacion/{confirmacion}")
    public ResponseEntity<?> obtenerPorConfirmacion(@PathVariable("confirmacion") String confirmacion) {
        try {
            List<Observaciones> observaciones = observacionesService.obtenerObservacionesPorConfirmacion(confirmacion);
            return ResponseEntity.ok(observaciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}