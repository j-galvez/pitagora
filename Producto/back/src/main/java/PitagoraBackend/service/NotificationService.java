package PitagoraBackend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import PitagoraBackend.model.Evidencias;
import PitagoraBackend.model.Mensajes;
import PitagoraBackend.model.Observaciones;
import PitagoraBackend.model.NotificacionesEnviadas;
import PitagoraBackend.model.Usuarios;
import PitagoraBackend.repository.EvidenciasRepository;
import PitagoraBackend.repository.MensajesRepository;
import PitagoraBackend.repository.NotificacionesEnviadasRepository;
import PitagoraBackend.repository.ObservacionesRepository;
import PitagoraBackend.repository.TicketsRepository;
import PitagoraBackend.repository.UsuariosRepository;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class NotificationService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private ObservacionesRepository observacionesRepository;

    @Autowired
    private TicketsRepository ticketsRepository;

    @Autowired
    private MensajesRepository mensajesRepository;

    @Autowired
    private EvidenciasRepository evidenciasRepository;

    @Autowired
    private NotificacionesEnviadasRepository notificacionesEnviadasRepository;

    @Autowired
    private InboundEmailService inboundEmailService;

    @Value("${app.site.url:http://localhost:5173}")
    private String siteUrl;
    @Value("${app.backend.url:http://localhost:8080}")
    private String backendUrl;

    private String buildSubject(Observaciones obs) {
        Integer ticketId = obs.getIdTicket();
        Integer obsId = obs.getIdObservacion();
        
        // Obtener idObra desde el ticket
        Integer idObra = null;
        if (ticketId != null) {
            idObra = ticketsRepository.findById(ticketId)
                .map(t -> t.getIdObra())
                .orElse(null);
        }

        // Formato estándar: [PITAGORA-OBR-{idObra}-TKT-{idTicket}-OBS-{idObservacion}]
        if (idObra != null && ticketId != null) {
            return String.format("[PITAGORA-OBR-%d-TKT-%d-OBS-%d] ticket de postventa número %d, observación %d", 
                idObra, ticketId, obsId, ticketId, obsId);
        }
        return String.format("observación %d", obsId);
    }

    private String buildHtml(Observaciones obs, String title, String bodyHtml) {
        return buildHtml(obs, title, bodyHtml, null);
    }

    private String buildHtml(Observaciones obs, String title, String bodyHtml, String destinatario) {
        String nombre = destinatario != null && !destinatario.isEmpty() ? destinatario : "";
        if (nombre.isEmpty() && obs.getIdUsuarioCreador() != null) {
            Optional<Usuarios> u = usuariosRepository.findById(obs.getIdUsuarioCreador());
            nombre = u.map(Usuarios::getNombre).orElse("");
        }

        String html = """
                <!DOCTYPE html>
                <html lang=\"es\"> 
                <head>
                  <meta charset=\"UTF-8\"> 
                  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
                  <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 22px; border-radius: 10px; }
                    .header { background-color: #0B3B60; color: white; padding: 14px; border-radius: 10px 10px 0 0; text-align: left; }
                    .header h2 { margin: 0; font-size: 18px; }
                    .content { background-color: white; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #ddd; }
                    .note { color: #555; font-size: 14px; margin-top: 10px; }
                    .footer { color: #777; font-size: 12px; margin-top: 16px; text-align: center; }
                    .button { display: inline-block; padding: 10px 18px; background-color: #0B3B60; color: #fff; text-decoration: none; border-radius: 6px; }
                  </style>
                </head>
                <body>
                  <div class=\"container\">
                    <div class=\"header\">
                      <h2>%s</h2>
                    </div>
                    <div class=\"content\">
                      <p>Hola <strong>%s</strong>,</p>
                      %s
                    </div>
                    <div class=\"footer\">
                      <p>Postventa Pitagora</p>
                      <p><a href=\"%s\" style=\"color:#0B3B60;text-decoration:none\">%s</a></p>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(title, nombre.isEmpty() ? "usuario" : nombre, bodyHtml, siteUrl, siteUrl);

        return html;
    }

    private boolean esAdmin(Usuarios u) {
        if (u == null || u.getRol() == null) return false;
        String rol = u.getRol().trim().toLowerCase();
        return rol.equals("admin") || rol.equals("administrador") || rol.equals("role_admin") || rol.equals("rol_admin") || rol.equals("administrator");
    }

    public void notificarNuevaObservacion(Observaciones obs) {
        String subject = buildSubject(obs);
        String title = "Nueva observación registrada";
        String body = String.format("<p>Se ha creado una nueva observación (ID: <strong>%d</strong>) en el ticket <strong>%d</strong>.</p><p>Falla: %s</p>", obs.getIdObservacion(), obs.getIdTicket(), obs.getFalla());

        log.info("Notificando nueva observación {} (ticket {})", obs.getIdObservacion(), obs.getIdTicket());

        // Enviar al creador
        if (obs.getIdUsuarioCreador() != null) {
            usuariosRepository.findById(obs.getIdUsuarioCreador()).ifPresentOrElse(u -> {
                try {
                    log.info("Enviando correo de nueva observación al creador {}", u.getCorreo());
                    emailService.enviarCorreoHtml(u.getCorreo(), subject, buildHtml(obs, title, body));
                    guardarNotificacionEnviada(obs.getIdObservacion(), u.getCorreo(), subject, "nueva_observacion");
                } catch (Exception e) {
                    log.error("Error enviando correo de nueva observación al creador {}: {}", u.getCorreo(), e.getMessage(), e);
                }
            }, () -> log.warn("No se encontró usuario creador con id {} para notificar", obs.getIdUsuarioCreador()));
        } else {
            log.warn("No se notificó al creador porque idUsuarioCreador es nulo en la observación {}", obs.getIdObservacion());
        }

        // Enviar a administradores
        List<Usuarios> admins = usuariosRepository.findAll().stream().filter(this::esAdmin).toList();
        if (admins.isEmpty()) {
            log.warn("No se encontró ningún administrador para notificar la observación {}", obs.getIdObservacion());
        }
        for (Usuarios admin : admins) {
            try {
                log.info("Enviando correo de nueva observación al administrador {}", admin.getCorreo());
                String adminName = admin.getNombre() != null && !admin.getNombre().isEmpty() ? admin.getNombre() : "administrador";
                emailService.enviarCorreoHtml(admin.getCorreo(), subject, buildHtml(obs, title, body, adminName));
                guardarNotificacionEnviada(obs.getIdObservacion(), admin.getCorreo(), subject, "nueva_observacion");
            } catch (Exception e) {
                log.error("Error enviando correo de nueva observación al administrador {}: {}", admin.getCorreo(), e.getMessage(), e);
            }
        }
    }

    public void notificarCambioEstado(Observaciones obs, String anteriorEstado) {
        String subject = buildSubject(obs);
        String title = "Cambio de estado de observación";
        StringBuilder bodyBuilder = new StringBuilder();
        bodyBuilder.append(String.format("<p>La observación <strong>%d</strong> ha cambiado de estado: <strong>%s</strong> → <strong>%s</strong>.</p>", obs.getIdObservacion(), anteriorEstado, obs.getEstadoObservacion()));

        if (obs.getComentarioAdmin() != null && !obs.getComentarioAdmin().isEmpty()) {
            bodyBuilder.append(String.format("<p><strong>Comentario del administrador:</strong></p><p>%s</p>", obs.getComentarioAdmin()));
        }

        // Si requiere confirmación (en espera aceptación), construir cuerpo de usuario con botones
        String userBody = bodyBuilder.toString();
        if ("en espera aceptación".equalsIgnoreCase(obs.getEstadoObservacion())) {
            String aceptar = backendUrl + "/api/observaciones/" + obs.getIdObservacion() + "/aceptar?token=" + obs.getTokenAceptacion();
            String rechazar = backendUrl + "/api/observaciones/" + obs.getIdObservacion() + "/rechazar?token=" + obs.getTokenAceptacion();
            userBody = bodyBuilder.toString() + String.format("<p style=\"text-align:center;margin-top:12px\"><a href=\"%s\" class=\"button\">Sí, acepto</a> &nbsp; <a href=\"%s\" style=\"color:#d9534f;text-decoration:none\">No, no acepto</a></p>", aceptar, rechazar);
        }
        final String finalUserBody = userBody;

        // Enviar a creador
        if (obs.getIdUsuarioCreador() != null) {
            usuariosRepository.findById(obs.getIdUsuarioCreador()).ifPresent(u -> {
                try {
                    emailService.enviarCorreoHtml(u.getCorreo(), subject, buildHtml(obs, title, finalUserBody));
                    guardarNotificacionEnviada(obs.getIdObservacion(), u.getCorreo(), subject, "cambio_estado");
                } catch (Exception e) {
                    log.error("Error enviando correo de cambio de estado al creador {}: {}", u.getCorreo(), e.getMessage(), e);
                }
            });
        }

        // Enviar a administradores sin opciones de aceptación
        String adminBody = String.format("<p>La observación <strong>%d</strong> del ticket <strong>%d</strong> ha cambiado de estado: <strong>%s</strong> → <strong>%s</strong>.</p>", obs.getIdObservacion(), obs.getIdTicket(), anteriorEstado, obs.getEstadoObservacion());
        if (obs.getComentarioAdmin() != null && !obs.getComentarioAdmin().isEmpty()) {
            adminBody += String.format("<p><strong>Comentario del administrador:</strong></p><p>%s</p>", obs.getComentarioAdmin());
        }
        if ("en espera aceptación".equalsIgnoreCase(obs.getEstadoObservacion())) {
            adminBody += "<p>Esta observación se encuentra en estado <strong>en espera aceptación</strong> y está pendiente de la respuesta del usuario.</p>";
        }

        List<Usuarios> admins = usuariosRepository.findAll().stream().filter(this::esAdmin).toList();
        if (admins.isEmpty()) {
            log.warn("No se encontró ningún administrador para notificar el cambio de estado de observación {}", obs.getIdObservacion());
        }
        for (Usuarios admin : admins) {
            try {
                log.info("Enviando correo de cambio de estado al administrador {}", admin.getCorreo());
                String adminName = admin.getNombre() != null && !admin.getNombre().isEmpty() ? admin.getNombre() : "administrador";
                emailService.enviarCorreoHtml(admin.getCorreo(), subject, buildHtml(obs, title, adminBody, adminName));
                guardarNotificacionEnviada(obs.getIdObservacion(), admin.getCorreo(), subject, "cambio_estado");
            } catch (Exception e) {
                log.error("Error enviando correo de cambio de estado al administrador {}: {}", admin.getCorreo(), e.getMessage(), e);
            }
        }
    }

    public void notificarMensajeCreado(Mensajes mensaje) {
        // Obtener observación
        Optional<Observaciones> opt = observacionesRepository.findById(mensaje.getIdObservacion());
        if (opt.isEmpty()) return;
        Observaciones obs = opt.get();

        String subject = buildSubject(obs);
        String title = "Nuevo mensaje en la observación";
        StringBuilder bodyBuilder = new StringBuilder();
        bodyBuilder.append(String.format("<p>Se ha añadido un mensaje en la observación <strong>%d</strong>:</p>", obs.getIdObservacion()));
        if (mensaje.getMensaje() != null && !mensaje.getMensaje().isBlank()) {
            bodyBuilder.append(String.format("<blockquote>%s</blockquote>", mensaje.getMensaje()));
        }

        if (mensaje.getIdEvidencia() != null) {
            Optional<Evidencias> evidenciaOpt = evidenciasRepository.findById(mensaje.getIdEvidencia());
            evidenciaOpt.ifPresent(e -> {
                String urlArchivo = e.getUrlArchivo();
                if (urlArchivo != null && !urlArchivo.isBlank()) {
                    bodyBuilder.append(String.format("<p><strong>Imagen adjunta:</strong></p><p><a href=\"%s\">Ver imagen</a></p>", urlArchivo));
                    bodyBuilder.append(String.format("<p><img src=\"%s\" alt=\"Imagen adjunta\" style=\"max-width:100%%;height:auto;margin-top:10px;\"/></p>", urlArchivo));
                }
            });
        }

        String body = bodyBuilder.toString();

        // enviar al creador (si el autor no es el creador)
        if (obs.getIdUsuarioCreador() != null && !obs.getIdUsuarioCreador().equals(mensaje.getIdUsuario())) {
            usuariosRepository.findById(obs.getIdUsuarioCreador()).ifPresentOrElse(u -> {
                try {
                    log.info("Enviando correo de nuevo mensaje en observación al creador {}", u.getCorreo());
                    emailService.enviarCorreoHtml(u.getCorreo(), subject, buildHtml(obs, title, body));
                    guardarNotificacionEnviada(obs.getIdObservacion(), u.getCorreo(), subject, "nuevo_mensaje");
                } catch (Exception e) {
                    log.error("Error enviando correo de nuevo mensaje al creador {}: {}", u.getCorreo(), e.getMessage(), e);
                }
            }, () -> log.warn("No se encontró usuario creador con id {} para notificar mensaje", obs.getIdUsuarioCreador()));
        }

        // enviar a administradores
        List<Usuarios> admins = usuariosRepository.findAll().stream().filter(this::esAdmin).toList();
        if (admins.isEmpty()) {
            log.warn("No se encontró ningún administrador para notificar mensaje en observación {}", obs.getIdObservacion());
        }
        for (Usuarios admin : admins) {
            try {
                log.info("Enviando correo de nuevo mensaje en observación al administrador {}", admin.getCorreo());
                String adminName = admin.getNombre() != null && !admin.getNombre().isEmpty() ? admin.getNombre() : "administrador";
                emailService.enviarCorreoHtml(admin.getCorreo(), subject, buildHtml(obs, title, body, adminName));
                guardarNotificacionEnviada(obs.getIdObservacion(), admin.getCorreo(), subject, "nuevo_mensaje");
            } catch (Exception e) {
                log.error("Error enviando correo de nuevo mensaje al administrador {}: {}", admin.getCorreo(), e.getMessage(), e);
            }
        }
    }

    public void notificarRechazoAceptacion(Observaciones obs) {
        String subject = buildSubject(obs);
        String title = "Usuario rechazó la solución propuesta";
        StringBuilder bodyBuilder = new StringBuilder();
        bodyBuilder.append(String.format("<p>El usuario ha rechazado la solución para la observación <strong>%d</strong> del ticket <strong>%d</strong>.</p>", obs.getIdObservacion(), obs.getIdTicket()));
        if (obs.getComentarioAdmin() != null && !obs.getComentarioAdmin().isEmpty()) {
            bodyBuilder.append(String.format("<p><strong>Comentario del administrador (previo):</strong></p><p>%s</p>", obs.getComentarioAdmin()));
        }
        bodyBuilder.append("<p>Por favor coordinar con el cliente y asignar una nueva solución.</p>");
        // Link to admin console (frontend)
        bodyBuilder.append(String.format("<p><a href=\"%s\">Abrir en la consola de administración</a></p>", siteUrl));

        final String body = bodyBuilder.toString();

        List<Usuarios> admins = usuariosRepository.findAll().stream().filter(this::esAdmin).toList();
        if (admins.isEmpty()) {
            log.warn("No se encontró ningún administrador para notificar el rechazo de aceptación de la observación {}", obs.getIdObservacion());
        }
        for (Usuarios admin : admins) {
            try {
                log.info("Enviando correo de rechazo de aceptación al administrador {}", admin.getCorreo());
                String adminName = admin.getNombre() != null && !admin.getNombre().isEmpty() ? admin.getNombre() : "administrador";
                emailService.enviarCorreoHtml(admin.getCorreo(), subject, buildHtml(obs, title, body, adminName));
                guardarNotificacionEnviada(obs.getIdObservacion(), admin.getCorreo(), subject, "rechazo_aceptacion");
            } catch (Exception e) {
                log.error("Error enviando correo de rechazo de aceptación al administrador {}: {}", admin.getCorreo(), e.getMessage(), e);
            }
        }
    }

    public void enviarRecordatorioAceptacion(Observaciones obs, int intentoActual) {
        String subject = buildSubject(obs);
        String title = "Recordatorio: confirmar solución";
        StringBuilder bodyBuilder = new StringBuilder();
        bodyBuilder.append(String.format("<p>Le recordamos que existe una solución pendiente de aceptación para la observación <strong>%d</strong>.</p><p>Intento de recordatorio: %d de 4.</p>", obs.getIdObservacion(), intentoActual + 1));
        String aceptar = backendUrl + "/api/observaciones/" + obs.getIdObservacion() + "/aceptar?token=" + obs.getTokenAceptacion();
        String rechazar = backendUrl + "/api/observaciones/" + obs.getIdObservacion() + "/rechazar?token=" + obs.getTokenAceptacion();
        bodyBuilder.append(String.format("<p style=\"text-align:center;margin-top:12px\"><a href=\"%s\" class=\"button\">Sí, acepto</a> &nbsp; <a href=\"%s\" style=\"color:#d9534f;text-decoration:none\">No, no acepto</a></p>", aceptar, rechazar));

        final String body = bodyBuilder.toString();

        // enviar al usuario creador
        if (obs.getIdUsuarioCreador() != null) {
            usuariosRepository.findById(obs.getIdUsuarioCreador()).ifPresentOrElse(u -> {
                try {
                    log.info("Enviando correo de recordatorio al creador {}", u.getCorreo());
                    emailService.enviarCorreoHtml(u.getCorreo(), subject, buildHtml(obs, title, body));
                    guardarNotificacionEnviada(obs.getIdObservacion(), u.getCorreo(), subject, "recordatorio");
                } catch (Exception e) {
                    log.error("Error enviando correo de recordatorio al creador {}: {}", u.getCorreo(), e.getMessage(), e);
                }
            }, () -> log.warn("No se encontró usuario creador con id {} para recordatorio", obs.getIdUsuarioCreador()));
        }

        // No enviar recordatorio de aceptación a administradores; solo al creador
    }

    // Método auxiliar para guardar las notificaciones enviadas
    private void guardarNotificacionEnviada(Integer idObservacion, String destinatario, String asunto, String tipoNotificacion) {
        try {
            NotificacionesEnviadas notif = new NotificacionesEnviadas(idObservacion, destinatario, asunto, "", tipoNotificacion);
            notificacionesEnviadasRepository.save(notif);
            log.debug("Notificación guardada: obs={}, destinatario={}, tipo={}", idObservacion, destinatario, tipoNotificacion);
        } catch (Exception e) {
            log.warn("Error guardando registro de notificación: {}", e.getMessage());
        }
    }

}
