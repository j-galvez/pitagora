package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.Categorias;
import PitagoraBackend.service.CategoriasService;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriasController {
    
    @Autowired
    private CategoriasService categoriasService;

    // CREATE - Crear categoría
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Categorias categoria) {
        try {
            Categorias nueva = categoriasService.crearCategorias(categoria);
            return ResponseEntity.ok(nueva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // READ - Listar todas las categorías
    @GetMapping
    public List<Categorias> listar() {
        return categoriasService.obtenerCategorias();
    }

    // READ - Obtener categoría por ID
    @GetMapping("/{id_categoria}")
    public ResponseEntity<?> obtenerPorId(@PathVariable("id_categoria") Integer id_categoria) {
        try {
            return ResponseEntity.ok(categoriasService.obtenerCategoriaById(id_categoria));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UPDATE - Actualizar categoría
    @PutMapping("/{id_categoria}")
    public ResponseEntity<?> actualizar(@PathVariable("id_categoria") Integer id_categoria, @RequestBody Categorias categoria) {
        try {
            Categorias actualizada = categoriasService.actualizarCategorias(id_categoria, categoria);
            return ResponseEntity.ok(actualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE - Eliminar categoría
    @DeleteMapping("/{id_categoria}")
    public ResponseEntity<?> eliminar(@PathVariable("id_categoria") Integer id_categoria) {
        try {
            categoriasService.eliminarCategorias(id_categoria);
            return ResponseEntity.ok("Categoría eliminada correctamente");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ENDPOINTS ADICIONALES

    // Obtener categorías por nombre
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<?> obtenerPorNombre(@PathVariable("nombre") String nombre) {
        try {
            List<Categorias> categorias = categoriasService.obtenerCategoriasPorNombre(nombre);
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Obtener categorías por subcategoría
    @GetMapping("/subcategoria/{subcategoria}")
    public ResponseEntity<?> obtenerPorSubcategoria(@PathVariable("subcategoria") String subcategoria) {
        try {
            List<Categorias> categorias = categoriasService.obtenerCategoriasPorSubcategoria(subcategoria);
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
