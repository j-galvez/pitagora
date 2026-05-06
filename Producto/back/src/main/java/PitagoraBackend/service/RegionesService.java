package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.repository.RegionesRepository;
import PitagoraBackend.model.Regiones;
import java.util.List;
import java.util.Optional;

@Service
public class RegionesService {
    
    @Autowired
    private RegionesRepository regionesRepository;

    // READ - Obtener todas las regiones
    public List<Regiones> obtenerRegiones() {
        return regionesRepository.findAll();
    }

    // READ - Obtener región por ID
    public Regiones obtenerRegionById(Integer id) {
        Optional<Regiones> region = regionesRepository.findById(id);
        if (!region.isPresent()) {
            throw new IllegalArgumentException("Región no encontrada con ID: " + id);
        }
        return region.get();
    }
}

// Made with Bob
