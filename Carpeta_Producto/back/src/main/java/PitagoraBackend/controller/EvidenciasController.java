package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.Evidencias;
import PitagoraBackend.service.EvidenciasService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/evidencias")
@CrossOrigin(origins = "*")
public class EvidenciasController {
    
    @Autowired
    private EvidenciasService evidenciasService;
    
    // CREATE - Crear una nueva evidencia
    @PostMapping
    public ResponseEntity<?> crearEvidencia(@RequestBody Evidencias evidencia) {
        try {
            Evidencias evidenciaCreada = evidenciasService.crearEvidencia(evidencia);
            return new ResponseEntity<>(evidenciaCreada, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear evidencia: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // READ - Obtener todas las evidencias
    @GetMapping
    public ResponseEntity<?> obtenerTodas() {
        try {
            List<Evidencias> evidencias = evidenciasService.obtenerTodas();
            return new ResponseEntity<>(evidencias, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener evidencias: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener una evidencia por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        try {
            Optional<Evidencias> evidencia = evidenciasService.obtenerPorId(id);
            if (evidencia.isPresent()) {
                return new ResponseEntity<>(evidencia.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Evidencia no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener evidencia: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener evidencias por observación
    @GetMapping("/observacion/{idObservacion}")
    public ResponseEntity<?> obtenerPorObservacion(@PathVariable Integer idObservacion) {
        try {
            List<Evidencias> evidencias = evidenciasService.obtenerPorObservacion(idObservacion);
            return new ResponseEntity<>(evidencias, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener evidencias: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener evidencias por tipo
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<?> obtenerPorTipo(@PathVariable String tipo) {
        try {
            Evidencias.TipoArchivoEnum tipoEnum = Evidencias.TipoArchivoEnum.valueOf(tipo.toUpperCase());
            List<Evidencias> evidencias = evidenciasService.obtenerPorTipo(tipoEnum);
            return new ResponseEntity<>(evidencias, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener evidencias: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener evidencias por momento
    @GetMapping("/momento/{momento}")
    public ResponseEntity<?> obtenerPorMomento(@PathVariable String momento) {
        try {
            Evidencias.MomentoEnum momentoEnum = Evidencias.MomentoEnum.valueOf(momento.toUpperCase());
            List<Evidencias> evidencias = evidenciasService.obtenerPorMomento(momentoEnum);
            return new ResponseEntity<>(evidencias, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener evidencias: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // UPDATE - Actualizar una evidencia
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarEvidencia(@PathVariable Integer id, @RequestBody Evidencias evidenciaActualizada) {
        try {
            Evidencias evidenciaUpdated = evidenciasService.actualizarEvidencia(id, evidenciaActualizada);
            if (evidenciaUpdated != null) {
                return new ResponseEntity<>(evidenciaUpdated, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Evidencia no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar evidencia: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // DELETE - Eliminar una evidencia
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEvidencia(@PathVariable Integer id) {
        try {
            boolean eliminada = evidenciasService.eliminarEvidencia(id);
            if (eliminada) {
                return new ResponseEntity<>("Evidencia eliminada correctamente", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Evidencia no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar evidencia: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
