package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import PitagoraBackend.model.Mensajes;
import PitagoraBackend.repository.MensajesRepository;
import PitagoraBackend.repository.UsuariosRepository;
import PitagoraBackend.service.NotificationService;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

@RestController
@RequestMapping("/api/mail")
@CrossOrigin(origins = "*")
public class MailInboundController {

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private MensajesRepository mensajesRepository;

    @Autowired
    private NotificationService notificationService;

    private static final Pattern OBS_REGEX = Pattern.compile("observacion[^0-9]*(\\d+)", Pattern.CASE_INSENSITIVE);

    private String extractFirstString(Map<String, Object> payload, String... keys) {
        for (String k : keys) {
            if (!payload.containsKey(k)) continue;
            Object v = payload.get(k);
            String extracted = extractStringValue(v);
            if (extracted != null && !extracted.isBlank()) return extracted;
        }
        return null;
    }

    private String extractStringValue(Object value) {
        if (value == null) return null;
        if (value instanceof String) {
            String str = (String) value;
            return str.isBlank() ? null : str;
        }
        if (value instanceof Map<?, ?>) {
            @SuppressWarnings("unchecked")
            Map<String, Object> nested = (Map<String, Object>) value;
            // Search nested body/text/plain/html keys recursively
            String result = extractFirstString(nested, "body", "text", "plain", "html", "content", "body-plain", "message", "msg");
            if (result != null) return result;
            return nested.toString();
        }
        if (value instanceof List<?>) {
            for (Object item : (List<?>) value) {
                String extracted = extractStringValue(item);
                if (extracted != null && !extracted.isBlank()) return extracted;
            }
            return null;
        }
        try {
            String text = value.toString();
            return text.isBlank() ? null : text;
        } catch (Exception e) {
            return null;
        }
    }

    private String extractEmail(String raw) {
        if (raw == null) return null;
        // buscar patrón email en el texto
        Pattern emailPat = Pattern.compile("[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,6}");
        Matcher mm = emailPat.matcher(raw);
        if (mm.find()) return mm.group(0).toLowerCase();
        return null;
    }

    @PostMapping("/inbound")
    public ResponseEntity<?> inbound(@RequestBody Map<String, Object> payload) {
        // soportar distintos formatos de webhook: "from", "sender", "from_email"
        String from = extractFirstString(payload, "from", "sender", "from_email", "mail_from");
        String subject = extractFirstString(payload, "subject", "title");
        String body = extractFirstString(payload, "body", "text", "plain", "html", "content", "body-plain");

        if (from == null || subject == null || body == null) {
            return ResponseEntity.badRequest().body("Faltan campos from/subject/body (verificar keys del webhook)");
        }

        Matcher m = OBS_REGEX.matcher(subject);
        if (!m.find()) {
            return ResponseEntity.badRequest().body("Asunto no contiene referencia a observacion");
        }

        Integer idObs = Integer.parseInt(m.group(1));

        // extraer email si "from" contiene nombre y correo
        String email = extractEmail(from);
        if (email == null) email = from;

        Optional<PitagoraBackend.model.Usuarios> userOpt = usuariosRepository.findByCorreo(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Remitente no registrado en la plataforma: " + email);
        }

        Integer idUsuario = userOpt.get().getIdUsuario();

        Mensajes mobj = new Mensajes();
        mobj.setIdObservacion(idObs);
        mobj.setIdUsuario(idUsuario);
        mobj.setMensaje(body);

        Mensajes saved = mensajesRepository.save(mobj);

        try { notificationService.notificarMensajeCreado(saved); } catch (Exception e) {}

        return ResponseEntity.ok("Mensaje ingresado");
    }
}
