package PitagoraBackend.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import PitagoraBackend.dto.MensajeDTO;
import PitagoraBackend.model.Evidencias;
import PitagoraBackend.model.Mensajes;
import PitagoraBackend.model.Usuarios;
import PitagoraBackend.repository.EvidenciasRepository;
import PitagoraBackend.repository.MensajesRepository;
import PitagoraBackend.repository.ObservacionesRepository;
import PitagoraBackend.repository.UsuariosRepository;
import PitagoraBackend.service.NotificationService;

@Service
public class MensajesService {

    @Autowired
    private MensajesRepository mensajesRepository;

    @Autowired
    private EvidenciasRepository evidenciasRepository;

    @Autowired
    private ObservacionesRepository observacionesRepository;

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ImageStorageService imageStorageService;

    public MensajeDTO crearMensaje(Mensajes mensaje, MultipartFile imagen) throws IOException {
        if (mensaje.getIdObservacion() == null) {
            throw new IllegalArgumentException("El ID de la observación es requerido");
        }

        if (mensaje.getIdUsuario() == null) {
            throw new IllegalArgumentException("El ID del usuario es requerido");
        }

        if (!observacionesRepository.existsById(mensaje.getIdObservacion())) {
            throw new IllegalArgumentException("La observación no existe con ID: " + mensaje.getIdObservacion());
        }

        if (!usuariosRepository.existsById(mensaje.getIdUsuario())) {
            throw new IllegalArgumentException("El usuario no existe con ID: " + mensaje.getIdUsuario());
        }

        boolean tieneTexto = mensaje.getMensaje() != null && !mensaje.getMensaje().trim().isEmpty();
        boolean tieneImagen = imagen != null && !imagen.isEmpty();

        if (!tieneTexto && !tieneImagen) {
            throw new IllegalArgumentException("El mensaje debe contener texto o una imagen");
        }

        if (tieneImagen) {
            String urlPublica = imageStorageService.subirImagen(imagen);

            Evidencias evidencia = new Evidencias();
            evidencia.setIdObservacion(mensaje.getIdObservacion());
            evidencia.setUrlArchivo(urlPublica);
            evidencia.setFechaSubida(LocalDateTime.now());

            Evidencias evidenciaGuardada = evidenciasRepository.save(evidencia);
            mensaje.setIdEvidencia(evidenciaGuardada.getIdEvidencia());
        }

        if (mensaje.getFechaEnvio() == null) {
            mensaje.setFechaEnvio(LocalDateTime.now());
        }

        Mensajes guardado = mensajesRepository.save(mensaje);
        // Enviar notificación por correo a las partes involucradas
        try {
            notificationService.notificarMensajeCreado(guardado);
        } catch (Exception e) {
            // no bloquear la operación en caso de fallo en el envío
        }
        return toDTO(guardado);
    }

    public List<MensajeDTO> obtenerMensajes() {
        return mensajesRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MensajeDTO obtenerMensajeById(Integer idMensaje) {
        Mensajes mensaje = mensajesRepository.findById(idMensaje)
                .orElseThrow(() -> new IllegalArgumentException("El mensaje no existe con ID: " + idMensaje));
        return toDTO(mensaje);
    }

    public List<MensajeDTO> obtenerMensajesPorObservacion(Integer idObservacion) {
        if (!observacionesRepository.existsById(idObservacion)) {
            throw new IllegalArgumentException("La observación no existe con ID: " + idObservacion);
        }

        return mensajesRepository.findByIdObservacionOrderByFechaEnvioAsc(idObservacion).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<MensajeDTO> obtenerMensajesPorUsuario(Integer idUsuario) {
        if (!usuariosRepository.existsById(idUsuario)) {
            throw new IllegalArgumentException("El usuario no existe con ID: " + idUsuario);
        }

        return mensajesRepository.findByIdUsuario(idUsuario).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public void eliminarMensaje(Integer idMensaje) {
        Mensajes mensaje = mensajesRepository.findById(idMensaje)
                .orElseThrow(() -> new IllegalArgumentException("El mensaje no existe con ID: " + idMensaje));

        Integer idEvidencia = mensaje.getIdEvidencia();
        mensajesRepository.deleteById(idMensaje);

        if (idEvidencia != null) {
            evidenciasRepository.deleteById(idEvidencia);
        }
    }

    private MensajeDTO toDTO(Mensajes mensaje) {
        MensajeDTO dto = new MensajeDTO();
        dto.setIdMensaje(mensaje.getIdMensaje());
        dto.setIdObservacion(mensaje.getIdObservacion());
        dto.setIdUsuario(mensaje.getIdUsuario());
        dto.setIdEvidencia(mensaje.getIdEvidencia());
        dto.setMensaje(mensaje.getMensaje());
        dto.setFechaEnvio(mensaje.getFechaEnvio());

        if (mensaje.getIdEvidencia() != null) {
            Optional<Evidencias> evidencia = evidenciasRepository.findById(mensaje.getIdEvidencia());
            evidencia.ifPresent(e -> dto.setUrlArchivo(e.getUrlArchivo()));
        }

        Optional<Usuarios> usuario = usuariosRepository.findById(mensaje.getIdUsuario());
        usuario.ifPresent(u -> {
            dto.setNombreUsuario(u.getNombre());
            dto.setApellidoPaterno(u.getApellidoPaterno());
        });

        return dto;
    }
}
