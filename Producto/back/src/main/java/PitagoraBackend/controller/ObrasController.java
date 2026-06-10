package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.Obras;
import PitagoraBackend.model.Observaciones;
import PitagoraBackend.dto.ObraDTO;
import PitagoraBackend.service.ObrasService;
import PitagoraBackend.service.ObservacionesService;
import java.util.List;

@RestController
@RequestMapping("/api/obras")
public class ObrasController {
    
    @Autowired
    private ObrasService obrasService;

    @Autowired
    private ObservacionesService observacionesService;

    // CREATE - Crear obra
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Obras obra) {
        try {
            Obras nueva = obrasService.crearObras(obra);
            return ResponseEntity.ok(nueva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // READ - Listar todas las obras
    @GetMapping
    public ResponseEntity<List<ObraDTO>> listar() {
        List<ObraDTO> obras = obrasService.obtenerObrasConDetalles();
        return ResponseEntity.ok(obras);
    }

    // READ - Obtener obra por ID con detalles completos (DTO)
    @GetMapping("/{id_obra}")
    public ResponseEntity<?> obtenerPorId(@PathVariable("id_obra") Integer id_obra) {
        try {
            return ResponseEntity.ok(obrasService.obtenerObraConDetallesById(id_obra));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // READ - Obtener obra por ID (entidad básica) - para operaciones internas
    @GetMapping("/{id_obra}/basico")
    public ResponseEntity<?> obtenerPorIdBasico(@PathVariable("id_obra") Integer id_obra) {
        try {
            return ResponseEntity.ok(obrasService.obtenerObraById(id_obra));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UPDATE - Actualizar obra
    @PutMapping("/{id_obra}")
    public ResponseEntity<?> actualizar(@PathVariable("id_obra") Integer id_obra, @RequestBody Obras obra) {
        try {
            Obras actualizada = obrasService.actualizarObras(id_obra, obra);
            return ResponseEntity.ok(actualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE - Eliminar obra
    @DeleteMapping("/{id_obra}")
    public ResponseEntity<?> eliminar(@PathVariable("id_obra") Integer id_obra) {
        try {
            obrasService.eliminarObras(id_obra);
            return ResponseEntity.ok("Obra eliminada correctamente");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Obtener observaciones de una obra específica
    @GetMapping("/{id_obra}/observaciones")
    public ResponseEntity<?> obtenerObservacionesPorObra(@PathVariable("id_obra") Integer id_obra) {
        try {
            List<Observaciones> observaciones = observacionesService.obtenerObservacionesPorObra(id_obra);
            return ResponseEntity.ok(observaciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Obtener obras de un cliente específico
    @GetMapping("/cliente/{id_cliente}")
    public ResponseEntity<?> obtenerObrasPorCliente(@PathVariable("id_cliente") Integer id_cliente) {
        try {
            List<ObraDTO> obras = obrasService.obtenerObrasPorCliente(id_cliente);
            return ResponseEntity.ok(obras);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
