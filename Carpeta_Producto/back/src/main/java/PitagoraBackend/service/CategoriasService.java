package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.model.Categorias;
import PitagoraBackend.repository.CategoriasRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriasService {
    
    @Autowired
    private CategoriasRepository categoriasRepository;
    
    // CREATE - Crear una nueva categoría
    public Categorias crearCategoria(Categorias categoria) {
        categoria.setFecha_creacion(LocalDateTime.now());
        return categoriasRepository.save(categoria);
    }
    
    // READ - Obtener todas las categorías
    public List<Categorias> obtenerTodas() {
        return categoriasRepository.findAll();
    }
    
    // READ - Obtener una categoría por ID
    public Optional<Categorias> obtenerPorId(Integer id) {
        return categoriasRepository.findById(id);
    }
    
    // READ - Buscar categorías por nombre
    public List<Categorias> buscarPorNombre(String nombre) {
        return categoriasRepository.findByNombreCategoriaContainingIgnoreCase(nombre);
    }
    
    // READ - Buscar por subcategoría
    public List<Categorias> buscarPorSubcategoria(String subcategoria) {
        return categoriasRepository.findBySubcategoriaContainingIgnoreCase(subcategoria);
    }
    
    // UPDATE - Actualizar una categoría
    public Categorias actualizarCategoria(Integer id, Categorias categoriaActualizada) {
        Optional<Categorias> categoriaExistente = categoriasRepository.findById(id);
        if (categoriaExistente.isPresent()) {
            Categorias categoria = categoriaExistente.get();
            
            if (categoriaActualizada.getNombre_categoria() != null) {
                categoria.setNombre_categoria(categoriaActualizada.getNombre_categoria());
            }
            if (categoriaActualizada.getSubcategoria() != null) {
                categoria.setSubcategoria(categoriaActualizada.getSubcategoria());
            }
            if (categoriaActualizada.getDescripcion() != null) {
                categoria.setDescripcion(categoriaActualizada.getDescripcion());
            }
            
            return categoriasRepository.save(categoria);
        }
        return null;
    }
    
    // DELETE - Eliminar una categoría
    public boolean eliminarCategoria(Integer id) {
        if (categoriasRepository.existsById(id)) {
            categoriasRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
