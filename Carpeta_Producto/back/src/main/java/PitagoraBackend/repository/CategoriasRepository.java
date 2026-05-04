package PitagoraBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import PitagoraBackend.model.Categorias;
import java.util.List;

@Repository
public interface CategoriasRepository extends JpaRepository<Categorias, Integer> {
    
    // Buscar categorías por nombre
    List<Categorias> findByNombreCategoria(String nombreCategoria);
    
    // Buscar categorías por subcategoría
    List<Categorias> findBySubcategoria(String subcategoria);
}

