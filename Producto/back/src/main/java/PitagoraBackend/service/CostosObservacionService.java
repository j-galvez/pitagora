package PitagoraBackend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import PitagoraBackend.dto.CostoObservacionDTO;
import PitagoraBackend.model.CostosObservacion;
import PitagoraBackend.model.Observaciones;
import PitagoraBackend.model.Usuarios;
import PitagoraBackend.repository.CostosObservacionRepository;
import PitagoraBackend.repository.ObservacionesRepository;
import PitagoraBackend.repository.UsuariosRepository;

@Service
public class CostosObservacionService {

    @Autowired
    private CostosObservacionRepository costosObservacionRepository;

    @Autowired
    private ObservacionesRepository observacionesRepository;

    @Autowired
    private UsuariosRepository usuariosRepository;

    public CostoObservacionDTO crearCosto(CostosObservacion costo) {
        validarCosto(costo, true);

        if (!observacionesRepository.existsById(costo.getIdObservacion())) {
            throw new IllegalArgumentException("La observación no existe con ID: " + costo.getIdObservacion());
        }

        if (costo.getIdUsuario() != null && !usuariosRepository.existsById(costo.getIdUsuario())) {
            throw new IllegalArgumentException("El usuario no existe con ID: " + costo.getIdUsuario());
        }

        if (costo.getFechaRegistro() == null) {
            costo.setFechaRegistro(LocalDateTime.now());
        }

        CostosObservacion guardado = costosObservacionRepository.save(costo);
        sincronizarCostoObservacion(guardado.getIdObservacion());
        return toDTO(guardado);
    }

    public List<CostoObservacionDTO> obtenerCostosPorObservacion(Integer idObservacion) {
        if (!observacionesRepository.existsById(idObservacion)) {
            throw new IllegalArgumentException("La observación no existe con ID: " + idObservacion);
        }

        return costosObservacionRepository.findByIdObservacionOrderByFechaRegistroDesc(idObservacion).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CostoObservacionDTO obtenerCostoById(Integer idCosto) {
        CostosObservacion costo = costosObservacionRepository.findById(idCosto)
                .orElseThrow(() -> new IllegalArgumentException("El costo no existe con ID: " + idCosto));
        return toDTO(costo);
    }

    public CostoObservacionDTO actualizarCosto(Integer idCosto, CostosObservacion costoActualizado) {
        CostosObservacion costoExistente = costosObservacionRepository.findById(idCosto)
                .orElseThrow(() -> new IllegalArgumentException("El costo no existe con ID: " + idCosto));

        if (costoActualizado.getMonto() != null) {
            if (costoActualizado.getMonto() < 0) {
                throw new IllegalArgumentException("El monto no puede ser negativo");
            }
            costoExistente.setMonto(costoActualizado.getMonto());
        }

        if (costoActualizado.getDescripcion() != null) {
            if (costoActualizado.getDescripcion().trim().isEmpty()) {
                throw new IllegalArgumentException("La descripción es requerida");
            }
            costoExistente.setDescripcion(costoActualizado.getDescripcion().trim());
        }

        CostosObservacion guardado = costosObservacionRepository.save(costoExistente);
        sincronizarCostoObservacion(guardado.getIdObservacion());
        return toDTO(guardado);
    }

    public void eliminarCosto(Integer idCosto) {
        CostosObservacion costo = costosObservacionRepository.findById(idCosto)
                .orElseThrow(() -> new IllegalArgumentException("El costo no existe con ID: " + idCosto));

        Integer idObservacion = costo.getIdObservacion();
        costosObservacionRepository.deleteById(idCosto);
        sincronizarCostoObservacion(idObservacion);
    }

    public Long obtenerTotalPorObservacion(Integer idObservacion) {
        if (!observacionesRepository.existsById(idObservacion)) {
            throw new IllegalArgumentException("La observación no existe con ID: " + idObservacion);
        }
        return costosObservacionRepository.sumMontoByIdObservacion(idObservacion);
    }

    private void sincronizarCostoObservacion(Integer idObservacion) {
        Observaciones observacion = observacionesRepository.findById(idObservacion)
                .orElseThrow(() -> new IllegalArgumentException("La observación no existe con ID: " + idObservacion));

        Long total = costosObservacionRepository.sumMontoByIdObservacion(idObservacion);
        observacion.setCosto(total != null ? total : 0L);
        observacionesRepository.save(observacion);
    }

    private void validarCosto(CostosObservacion costo, boolean esCreacion) {
        if (esCreacion && costo.getIdObservacion() == null) {
            throw new IllegalArgumentException("El ID de la observación es requerido");
        }

        if (costo.getMonto() == null) {
            throw new IllegalArgumentException("El monto es requerido");
        }

        if (costo.getMonto() < 0) {
            throw new IllegalArgumentException("El monto no puede ser negativo");
        }

        if (costo.getDescripcion() == null || costo.getDescripcion().trim().isEmpty()) {
            throw new IllegalArgumentException("La descripción es requerida");
        }

        costo.setDescripcion(costo.getDescripcion().trim());
    }

    private CostoObservacionDTO toDTO(CostosObservacion costo) {
        CostoObservacionDTO dto = new CostoObservacionDTO();
        dto.setIdCosto(costo.getIdCosto());
        dto.setIdObservacion(costo.getIdObservacion());
        dto.setMonto(costo.getMonto());
        dto.setDescripcion(costo.getDescripcion());
        dto.setIdUsuario(costo.getIdUsuario());
        dto.setFechaRegistro(costo.getFechaRegistro());

        if (costo.getIdUsuario() != null) {
            Optional<Usuarios> usuario = usuariosRepository.findById(costo.getIdUsuario());
            usuario.ifPresent(u -> {
                dto.setNombreUsuario(u.getNombre());
                dto.setApellidoPaterno(u.getApellidoPaterno());
            });
        }

        return dto;
    }
}
