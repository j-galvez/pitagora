package PitagoraBackend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import PitagoraBackend.model.Mensajes;
import PitagoraBackend.model.Observaciones;
import PitagoraBackend.model.Usuarios;
import PitagoraBackend.repository.MensajesRepository;
import PitagoraBackend.repository.ObservacionesRepository;
import PitagoraBackend.repository.UsuariosRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class InboundEmailService {

    @Autowired
    private MensajesRepository mensajesRepository;

    @Autowired
    private ObservacionesRepository observacionesRepository;

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Value("${app.email.subject.format:[PITAGORA-OBR-{idObra}-TKT-{idTicket}-OBS-{idObservacion}]}")
    private String subjectFormat;

    /**
     * Estructura esperada del asunto:
     * [PITAGORA-OBR-123-TKT-456-OBS-789]
     * Extrae idObra, idTicket, idObservacion
     */
    public EmailMetadata parseEmailSubject(String subject) {
        if (subject == null || subject.trim().isEmpty()) {
            log.warn("Asunto de correo vacío");
            return null;
        }

        try {
            // Patrón: [PITAGORA-OBR-{idObra}-TKT-{idTicket}-OBS-{idObservacion}]
            Pattern pattern = Pattern.compile("\\[PITAGORA-OBR-(\\d+)-TKT-(\\d+)-OBS-(\\d+)\\]");
            Matcher matcher = pattern.matcher(subject);

            if (matcher.find()) {
                Integer idObra = Integer.parseInt(matcher.group(1));
                Integer idTicket = Integer.parseInt(matcher.group(2));
                Integer idObservacion = Integer.parseInt(matcher.group(3));
                return new EmailMetadata(idObra, idTicket, idObservacion);
            } else {
                log.warn("Asunto no contiene formato válido: {}", subject);
                return null;
            }
        } catch (Exception e) {
            log.error("Error al parsear asunto del correo: {}", subject, e);
            return null;
        }
    }

    /**
     * Guarda un correo entrante como mensaje vinculado a la observación
     */
    public Mensajes procesarCorreoEntrante(String senderEmail, String subject, String body) {
        log.info("Procesando correo entrante de {} con asunto: {}", senderEmail, subject);

        // 1. Parsear asunto
        EmailMetadata metadata = parseEmailSubject(subject);
        if (metadata == null) {
            log.warn("No se pudo extraer metadata del asunto, ignorando correo");
            return null;
        }

        // 2. Validar que la observación existe
        Optional<Observaciones> obsOpt = observacionesRepository.findById(metadata.idObservacion);
        if (obsOpt.isEmpty()) {
            log.warn("Observación no encontrada: {}", metadata.idObservacion);
            return null;
        }
        Observaciones obs = obsOpt.get();

        // 3. Buscar usuario por email del remitente
        // Suposición: existe un método que busca usuario por correo (email)
        // Si no existe, crear un registro genérico o rechazar
        Optional<Usuarios> usuarioOpt = findUsuarioByEmail(senderEmail);
        if (usuarioOpt.isEmpty()) {
            log.warn("Usuario no encontrado con email: {}", senderEmail);
            return null;
        }
        Usuarios usuario = usuarioOpt.get();

        // 4. Crear mensaje
        Mensajes mensaje = new Mensajes();
        mensaje.setIdObservacion(metadata.idObservacion);
        mensaje.setIdUsuario(usuario.getIdUsuario());
        mensaje.setMensaje(body);
        mensaje.setFechaEnvio(LocalDateTime.now());
        // Opcionalmente, marcar que es un correo entrante (inbound)

        // 5. Guardar
        Mensajes saved = mensajesRepository.save(mensaje);
        log.info("Correo guardado como mensaje {} vinculado a observación {}", saved.getIdMensaje(), metadata.idObservacion);

        return saved;
    }

    /**
     * Buscar usuario por correo electrónico
     * Implementar según estructura real (buscar en tabla usuarios por email/correo)
     */
    private Optional<Usuarios> findUsuarioByEmail(String email) {
        // TODO: Implementar query en UsuariosRepository: findByCorreo(String correo)
        // Por ahora, asumir que existe
        try {
            return usuariosRepository.findByCorreo(email);
        } catch (Exception e) {
            log.error("Error buscando usuario por email: {}", email, e);
            return Optional.empty();
        }
    }

    /**
     * Genera el asunto estandarizado para un correo saliente
     */
    public String generateStandardSubject(Integer idObra, Integer idTicket, Integer idObservacion) {
        return String.format("[PITAGORA-OBR-%d-TKT-%d-OBS-%d]", idObra, idTicket, idObservacion);
    }

    /**
     * DTO para almacenar metadata extraída del asunto
     */
    public static class EmailMetadata {
        public final Integer idObra;
        public final Integer idTicket;
        public final Integer idObservacion;

        public EmailMetadata(Integer idObra, Integer idTicket, Integer idObservacion) {
            this.idObra = idObra;
            this.idTicket = idTicket;
            this.idObservacion = idObservacion;
        }

        @Override
        public String toString() {
            return String.format("EmailMetadata{obra=%d, ticket=%d, observacion=%d}", idObra, idTicket, idObservacion);
        }
    }
}
