package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.Categorias;
import PitagoraBackend.service.CategoriasService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriasController {
    
    @Autowired
    private CategoriasService categoriasService;
    
    // CREATE - Crear una nueva categoría
    @PostMapping
    public ResponseEntity<?> crearCategoria(@RequestBody Categorias categoria) {
        try {
            Categorias categoriaCreada = categoriasService.crearCategoria(categoria);
            return new ResponseEntity<>(categoriaCreada, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear categoría: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // READ - Obtener todas las categorías
    @GetMapping
    public ResponseEntity<?> obtenerTodas() {
        try {
            List<Categorias> categorias = categoriasService.obtenerTodas();
            return new ResponseEntity<>(categorias, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener categorías: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener una categoría por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        try {
            Optional<Categorias> categoria = categoriasService.obtenerPorId(id);
            if (categoria.isPresent()) {
                return new ResponseEntity<>(categoria.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Categoría no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener categoría: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Buscar por nombre de categoría
    @GetMapping("/buscar/nombre/{nombre}")
    public ResponseEntity<?> buscarPorNombre(@PathVariable String nombre) {
        try {
            List<Categorias> categorias = categoriasService.buscarPorNombre(nombre);
            return new ResponseEntity<>(categorias, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al buscar categorías: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Buscar por subcategoría
    @GetMapping("/buscar/subcategoria/{subcategoria}")
    public ResponseEntity<?> buscarPorSubcategoria(@PathVariable String subcategoria) {
        try {
            List<Categorias> categorias = categoriasService.buscarPorSubcategoria(subcategoria);
            return new ResponseEntity<>(categorias, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al buscar subcategorías: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // UPDATE - Actualizar una categoría
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCategoria(@PathVariable Integer id, @RequestBody Categorias categoriaActualizada) {
        try {
            Categorias categoriaUpdated = categoriasService.actualizarCategoria(id, categoriaActualizada);
            if (categoriaUpdated != null) {
                return new ResponseEntity<>(categoriaUpdated, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Categoría no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar categoría: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // DELETE - Eliminar una categoría
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCategoria(@PathVariable Integer id) {
        try {
            boolean eliminada = categoriasService.eliminarCategoria(id);
            if (eliminada) {
                return new ResponseEntity<>("Categoría eliminada correctamente", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Categoría no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar categoría: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
