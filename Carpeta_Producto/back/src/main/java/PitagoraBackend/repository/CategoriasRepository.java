package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Categorias;
import java.util.List;

@Repository
public interface CategoriasRepository extends JpaRepository<Categorias, Integer> {
    
    // Buscar por nombre de categoría
    List<Categorias> findByNombreCategoriaContainingIgnoreCase(String nombre);
    
    // Buscar por subcategoría
    List<Categorias> findBySubcategoriaContainingIgnoreCase(String subcategoria);
}
