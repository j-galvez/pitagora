package PitagoraBackend.service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import PitagoraBackend.dto.EvidenciaDTO;
import PitagoraBackend.model.Evidencias;
import PitagoraBackend.model.Mensajes;
import PitagoraBackend.model.Observaciones;
import PitagoraBackend.repository.EvidenciasRepository;
import PitagoraBackend.repository.MensajesRepository;
import PitagoraBackend.repository.ObservacionesRepository;
import PitagoraBackend.repository.UsuariosRepository;

@Service
public class EvidenciasService {

    @Autowired
    private EvidenciasRepository evidenciasRepository;

    @Autowired
    private MensajesRepository mensajesRepository;

    @Autowired
    private ObservacionesRepository observacionesRepository;

    @Autowired
    private UsuariosRepository usuariosRepository;

    public List<EvidenciaDTO> obtenerEvidenciasPorObservacion(Integer idObservacion) {
        if (!observacionesRepository.existsById(idObservacion)) {
            throw new IllegalArgumentException("La observación no existe con ID: " + idObservacion);
        }

        return evidenciasRepository.findByIdObservacion(idObservacion).stream()
                .sorted(Comparator.comparing(Evidencias::getFechaSubida,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private EvidenciaDTO toDTO(Evidencias evidencia) {
        EvidenciaDTO dto = new EvidenciaDTO();
        dto.setIdEvidencia(evidencia.getIdEvidencia());
        dto.setIdObservacion(evidencia.getIdObservacion());
        dto.setUrlArchivo(evidencia.getUrlArchivo());
        dto.setFechaSubida(evidencia.getFechaSubida());

        Integer idUsuario = null;
        Optional<Mensajes> mensaje = mensajesRepository.findByIdEvidencia(evidencia.getIdEvidencia());
        if (mensaje.isPresent()) {
            idUsuario = mensaje.get().getIdUsuario();
        } else {
            idUsuario = observacionesRepository.findById(evidencia.getIdObservacion())
                    .map(Observaciones::getIdUsuarioCreador)
                    .orElse(null);
        }

        if (idUsuario != null) {
            usuariosRepository.findById(idUsuario).ifPresent(u -> {
                dto.setNombreUsuario(u.getNombre());
                dto.setApellidoPaterno(u.getApellidoPaterno());
            });
        }

        return dto;
    }
}
