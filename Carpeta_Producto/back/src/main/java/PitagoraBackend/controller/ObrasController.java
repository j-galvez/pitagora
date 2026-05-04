package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.Obras;
import PitagoraBackend.service.ObrasService;
import java.util.List;

@RestController
@RequestMapping("/api/obras")
@CrossOrigin(origins = "*")
public class ObrasController {
    
    @Autowired
    private ObrasService obrasService;

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
    public List<Obras> listar() {
        return obrasService.obtenerObras();
    }

    // READ - Obtener obra por ID
    @GetMapping("/{id_obra}")
    public ResponseEntity<?> obtenerPorId(@PathVariable("id_obra") Integer id_obra) {
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
}
