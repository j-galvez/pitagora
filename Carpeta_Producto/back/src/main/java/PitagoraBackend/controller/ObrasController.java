package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.Obras;
import PitagoraBackend.service.ObrasService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/obras")
@CrossOrigin(origins = "*")
public class ObrasController {
    
    @Autowired
    private ObrasService obrasService;
    
    // CREATE - Crear una nueva obra
    @PostMapping
    public ResponseEntity<?> crearObra(@RequestBody Obras obra) {
        try {
            Obras obraCreada = obrasService.crearObra(obra);
            return new ResponseEntity<>(obraCreada, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear obra: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // READ - Obtener todas las obras
    @GetMapping
    public ResponseEntity<?> obtenerTodas() {
        try {
            List<Obras> obras = obrasService.obtenerTodas();
            return new ResponseEntity<>(obras, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener obras: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener una obra por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        try {
            Optional<Obras> obra = obrasService.obtenerPorId(id);
            if (obra.isPresent()) {
                return new ResponseEntity<>(obra.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Obra no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener obra: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener todas las obras de un cliente
    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<?> obtenerObrasPorCliente(@PathVariable Integer idCliente) {
        try {
            List<Obras> obras = obrasService.obtenerObrasPorCliente(idCliente);
            return new ResponseEntity<>(obras, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener obras del cliente: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Buscar obras por nombre
    @GetMapping("/buscar/{nombre}")
    public ResponseEntity<?> buscarPorNombre(@PathVariable String nombre) {
        try {
            List<Obras> obras = obrasService.buscarPorNombre(nombre);
            return new ResponseEntity<>(obras, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al buscar obras: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // UPDATE - Actualizar una obra
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarObra(@PathVariable Integer id, @RequestBody Obras obraActualizada) {
        try {
            Obras obraUpdated = obrasService.actualizarObra(id, obraActualizada);
            if (obraUpdated != null) {
                return new ResponseEntity<>(obraUpdated, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Obra no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar obra: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // DELETE - Eliminar una obra
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarObra(@PathVariable Integer id) {
        try {
            boolean eliminada = obrasService.eliminarObra(id);
            if (eliminada) {
                return new ResponseEntity<>("Obra eliminada correctamente", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Obra no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar obra: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
