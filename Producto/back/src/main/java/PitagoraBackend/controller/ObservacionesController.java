package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import PitagoraBackend.model.Observaciones;
import PitagoraBackend.service.ObservacionesService;
import PitagoraBackend.service.ImageStorageService; // Tu servicio de Google Storage
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/observaciones")
@CrossOrigin(origins = "*") // Asegura el acceso desde React (localhost:5173)
public class ObservacionesController {
    
    @Autowired
    private ObservacionesService observacionesService;

    @Autowired
    private ImageStorageService storageService; // Inyectamos el servicio de Google Storage

    // CREATE - Crear observación (Modificado para soportar multipart/form-data)
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> crear(
            @RequestPart("observacion") String observacionJson,
            @RequestPart(value = "fotos", required = false) MultipartFile[] fotos) {
        try {
            // 1. Convertir el String JSON que viene de React al modelo de Java
            ObjectMapper objectMapper = new ObjectMapper();
            Observaciones observacion = objectMapper.readValue(observacionJson, Observaciones.class);

            // 2. Subir las imágenes a Google Cloud Storage si es que vienen en la petición
            List<String> urlsImagenes = new ArrayList<>();
            if (fotos != null && fotos.length > 0) {
                for (MultipartFile foto : fotos) {
                    if (!foto.isEmpty()) {
                        String urlPublica = storageService.subirImagen(foto);
                        urlsImagenes.add(urlPublica);
                    }
                }
            }

            // 3. Guardar las URLs en el objeto de la observación antes de persistir
            // Nota: Aquí debes concatenar la lista o guardarla según la estructura de tu modelo.
            // Si tu entidad usa un String separado por comas para guardar múltiples enlaces:
            // if (!urlsImagenes.isEmpty()) {
            //    String fotosConcatenadas = String.join(",", urlsImagenes);
            //    observacion.setFotos(fotosConcatenadas); // Asegúrate de que el setter coincida con tu atributo en el modelo
            //}

            // 4. Guardar en Cloud SQL usando tu Service existente
            Observaciones nueva = observacionesService.crearObservaciones(observacion);
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