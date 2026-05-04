package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.repository.CategoriasRepository;
import PitagoraBackend.model.Categorias;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriasService {
    
    @Autowired
    private CategoriasRepository categoriasRepository;

    // CREATE - Crear categoría
    public Categorias crearCategorias(Categorias categorias) {
        // Validación: nombreCategoria es requerido
        if (categorias.getNombreCategoria() == null || categorias.getNombreCategoria().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la categoría es requerido");
        }
        
        // La fechaCreacion se establece automáticamente
        if (categorias.getFechaCreacion() == null) {
            categorias.setFechaCreacion(LocalDateTime.now());
        }
        
        // Guardar la categoría
        return categoriasRepository.save(categorias);
    }

    // READ - Obtener todas las categorías
    public List<Categorias> obtenerCategorias() {
        return categoriasRepository.findAll();
    }

    // READ - Obtener categoría por ID
    public Categorias obtenerCategoriaById(Integer id) {
        Optional<Categorias> categoria = categoriasRepository.findById(id);
        if (!categoria.isPresent()) {
            throw new IllegalArgumentException("Categoría no encontrada con ID: " + id);
        }
        return categoria.get();
    }

    // UPDATE - Actualizar categoría
    public Categorias actualizarCategorias(Integer id, Categorias categoriasActualizado) {
        // Verificar que la categoría exista
        Categorias categoriaExistente = obtenerCategoriaById(id);

        // Actualizar campos si se proporcionan
        if (categoriasActualizado.getNombreCategoria() != null && !categoriasActualizado.getNombreCategoria().isEmpty()) {
            categoriaExistente.setNombreCategoria(categoriasActualizado.getNombreCategoria());
        }

        if (categoriasActualizado.getSubcategoria() != null) {
            categoriaExistente.setSubcategoria(categoriasActualizado.getSubcategoria());
        }

        if (categoriasActualizado.getDescripcion() != null) {
            categoriaExistente.setDescripcion(categoriasActualizado.getDescripcion());
        }

        return categoriasRepository.save(categoriaExistente);
    }

    // DELETE - Eliminar categoría
    public void eliminarCategorias(Integer id) {
        // Verificar que la categoría exista
        if (!categoriasRepository.existsById(id)) {
            throw new IllegalArgumentException("Categoría no encontrada con ID: " + id);
        }
        
        // Nota: Si hay observaciones asociadas a esta categoría, la eliminación fallará
        // debido a la FK con ON DELETE RESTRICT en la BD
        categoriasRepository.deleteById(id);
    }

    // MÉTODOS ADICIONALES ÚTILES

    // Obtener categorías por nombre
    public List<Categorias> obtenerCategoriasPorNombre(String nombre) {
        return categoriasRepository.findByNombreCategoria(nombre);
    }

    // Obtener categorías por subcategoría
    public List<Categorias> obtenerCategoriasPorSubcategoria(String subcategoria) {
        return categoriasRepository.findBySubcategoria(subcategoria);
    }
}


