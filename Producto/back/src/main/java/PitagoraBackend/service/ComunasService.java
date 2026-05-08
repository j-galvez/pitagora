package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.repository.ComunasRepository;
import PitagoraBackend.model.Comunas;
import java.util.List;
import java.util.Optional;

@Service
public class ComunasService {
    
    @Autowired
    private ComunasRepository comunasRepository;

    // READ - Obtener todas las comunas
    public List<Comunas> obtenerComunas() {
        return comunasRepository.findAll();
    }

    // READ - Obtener comuna por ID
    public Comunas obtenerComunaById(Integer id) {
        Optional<Comunas> comuna = comunasRepository.findById(id);
        if (!comuna.isPresent()) {
            throw new IllegalArgumentException("Comuna no encontrada con ID: " + id);
        }
        return comuna.get();
    }

    // READ - Obtener comunas por región
    public List<Comunas> obtenerComunasPorRegion(Integer idRegion) {
        List<Comunas> comunas = comunasRepository.findByIdRegion(idRegion);
        if (comunas.isEmpty()) {
            throw new IllegalArgumentException("No hay comunas para la región: " + idRegion);
        }
        return comunas;
    }

    // READ - Buscar comunas por nombre
    public List<Comunas> buscarComunasPorNombre(String nombreComuna) {
        return comunasRepository.findByNombreComunaContainingIgnoreCase(nombreComuna);
    }
}

// Made with Bob
