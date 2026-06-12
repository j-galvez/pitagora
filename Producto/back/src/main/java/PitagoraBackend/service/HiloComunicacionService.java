package PitagoraBackend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import PitagoraBackend.dto.HiloComunicacionDTO;
import PitagoraBackend.model.Mensajes;
import PitagoraBackend.model.NotificacionesEnviadas;
import PitagoraBackend.model.Observaciones;
import PitagoraBackend.model.Usuarios;
import PitagoraBackend.repository.MensajesRepository;
import PitagoraBackend.repository.NotificacionesEnviadasRepository;
import PitagoraBackend.repository.ObservacionesRepository;
import PitagoraBackend.repository.UsuariosRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class HiloComunicacionService {

    @Autowired
    private MensajesRepository mensajesRepository;

    @Autowired
    private NotificacionesEnviadasRepository notificacionesEnviadasRepository;

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private ObservacionesRepository observacionesRepository;

    /**
     * Obtiene el hilo completo de comunicación de una observación, combinando:
     * - Mensajes manuales (entrada de usuarios)
     * - Notificaciones enviadas (salida del sistema)
     * 
     * Todo ordenado cronológicamente.
     */
    public List<HiloComunicacionDTO> obtenerHiloComunicacion(Integer idObservacion) {
        List<HiloComunicacionDTO> hilo = new ArrayList<>();

        // Obtener observación para validación
        Optional<Observaciones> obsOpt = observacionesRepository.findById(idObservacion);
        if (obsOpt.isEmpty()) {
            log.warn("Observación no encontrada: {}", idObservacion);
            return hilo;
        }
        Observaciones obs = obsOpt.get();

        // 1. Obtener mensajes manuales (ordenados por fecha)
        List<Mensajes> mensajes = mensajesRepository.findByIdObservacionOrderByFechaEnvioAsc(idObservacion);
        for (Mensajes msg : mensajes) {
            String nombreUsuario = "Usuario";
            String rol = "cliente";
            
            if (msg.getIdUsuario() != null) {
                Optional<Usuarios> usuarioOpt = usuariosRepository.findById(msg.getIdUsuario());
                if (usuarioOpt.isPresent()) {
                    Usuarios u = usuarioOpt.get();
                    nombreUsuario = (u.getNombre() != null ? u.getNombre() : "") + " " + (u.getApellidoPaterno() != null ? u.getApellidoPaterno() : "");
                    nombreUsuario = nombreUsuario.trim();
                    
                    if (u.getRol() != null && (u.getRol().toLowerCase().contains("admin") || u.getRol().toLowerCase().contains("administrator"))) {
                        rol = "admin";
                    }
                }
            }

            HiloComunicacionDTO dto = new HiloComunicacionDTO(
                "mensaje_manual",
                msg.getFechaEnvio(),
                nombreUsuario,
                msg.getMensaje(),
                rol
            );
            hilo.add(dto);
        }

        // 2. Obtener notificaciones enviadas (ordenadas por fecha)
        List<NotificacionesEnviadas> notificaciones = notificacionesEnviadasRepository.findByIdObservacionOrderByFechaEnvioAsc(idObservacion);
        for (NotificacionesEnviadas notif : notificaciones) {
            HiloComunicacionDTO dto = new HiloComunicacionDTO(
                "notificacion",
                notif.getFechaEnvio(),
                notif.getDestinatario(), // email del destinatario
                notif.getAsunto(),
                notif.getTipoNotificacion() + " (" + notif.getEstadoEnvio() + ")",
                "sistema"
            );
            
            // Marcar si fue aceptado o rechazado
            if ("aceptado".equalsIgnoreCase(obs.getConfirmacionCliente())) {
                dto.setAceptado(true);
            } else if ("rechazado".equalsIgnoreCase(obs.getConfirmacionCliente())) {
                dto.setRechazado(true);
            }
            
            hilo.add(dto);
        }

        // 3. Ordenar todo cronológicamente
        hilo.sort((a, b) -> a.getFecha().compareTo(b.getFecha()));

        log.info("Hilo de comunicación para observación {}: {} elementos", idObservacion, hilo.size());
        return hilo;
    }
}
