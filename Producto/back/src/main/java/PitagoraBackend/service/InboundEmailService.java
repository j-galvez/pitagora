package PitagoraBackend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.model.CorreosEntrantes;
import PitagoraBackend.model.Obras;
import PitagoraBackend.model.Tickets;
import PitagoraBackend.model.Usuarios;
import PitagoraBackend.repository.CorreosEntrantesRepository;
import PitagoraBackend.repository.ObrasRepository;
import PitagoraBackend.repository.TicketsRepository;
import PitagoraBackend.repository.UsuariosRepository;
import PitagoraBackend.util.EmailSubjectParser;
import PitagoraBackend.util.EmailSubjectParser.ParsedSubject;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class InboundEmailService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,6}");

    @Autowired
    private CorreosEntrantesRepository correosEntrantesRepository;

    @Autowired
    private TicketsRepository ticketsRepository;

    @Autowired
    private ObrasRepository obrasRepository;

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Procesa un correo entrante y lo guarda en correos_entrantes vinculado al ticket.
     */
    public CorreosEntrantes procesarCorreoEntrante(String senderEmail, String subject, String body) {
        log.info("Procesando correo entrante de {} con asunto: {}", senderEmail, subject);

        String email = extractEmail(senderEmail);
        if (email == null) {
            log.warn("No se pudo extraer email del remitente: {}", senderEmail);
            return null;
        }

        ParsedSubject parsed = EmailSubjectParser.parse(subject);
        if (parsed == null) {
            log.warn("Asunto no contiene formato válido: {}", subject);
            return null;
        }

        Optional<Tickets> ticketOpt = ticketsRepository.findById(parsed.idTicket);
        if (ticketOpt.isEmpty()) {
            log.warn("Ticket no encontrado: {}", parsed.idTicket);
            return null;
        }
        Tickets ticket = ticketOpt.get();

        Optional<Obras> obraOpt = obrasRepository.findById(ticket.getIdObra());
        if (obraOpt.isEmpty()) {
            log.warn("Obra no encontrada para ticket {}: idObra={}", parsed.idTicket, ticket.getIdObra());
            return null;
        }
        Obras obra = obraOpt.get();

        if (!EmailSubjectParser.obraCoincide(parsed.nombreObra, obra.getNombreObra())) {
            log.warn("Nombre de obra no coincide. Asunto: '{}', BD: '{}'", parsed.nombreObra, obra.getNombreObra());
            return null;
        }

        Optional<Usuarios> usuarioOpt = usuariosRepository.findByCorreo(email);
        if (usuarioOpt.isEmpty()) {
            log.warn("Usuario no encontrado con email: {}", email);
            return null;
        }
        Usuarios usuario = usuarioOpt.get();

        CorreosEntrantes correo = new CorreosEntrantes();
        correo.setIdTicket(parsed.idTicket);
        correo.setIdUsuario(usuario.getIdUsuario());
        correo.setAsunto(subject);
        correo.setAsuntoNormalizado(parsed.asuntoNormalizado);
        correo.setCuerpo(body);
        correo.setFechaRecepcion(LocalDateTime.now());

        CorreosEntrantes saved = correosEntrantesRepository.save(correo);
        log.info("Correo guardado como correo_entrante {} vinculado a ticket {}", saved.getIdCorreoEntrante(), parsed.idTicket);

        try {
            notificationService.notificarCorreoEntrante(saved);
        } catch (Exception e) {
            log.warn("Error notificando correo entrante: {}", e.getMessage());
        }

        return saved;
    }

    private String extractEmail(String raw) {
        if (raw == null) return null;
        Matcher m = EMAIL_PATTERN.matcher(raw);
        if (m.find()) return m.group(0).toLowerCase();
        return raw.trim().toLowerCase();
    }
}
