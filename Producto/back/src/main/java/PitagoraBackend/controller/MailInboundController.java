package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import PitagoraBackend.model.CorreosEntrantes;
import PitagoraBackend.service.InboundEmailService;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/mail")
@CrossOrigin(origins = "*")
public class MailInboundController {

    @Autowired
    private InboundEmailService inboundEmailService;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,6}");

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
        Matcher mm = EMAIL_PATTERN.matcher(raw);
        if (mm.find()) return mm.group(0).toLowerCase();
        return raw.trim().toLowerCase();
    }

    @PostMapping("/inbound")
    public ResponseEntity<?> inbound(@RequestBody Map<String, Object> payload) {
        String from = extractFirstString(payload, "from", "sender", "from_email", "mail_from");
        String subject = extractFirstString(payload, "subject", "title");
        String body = extractFirstString(payload, "body", "text", "plain", "html", "content", "body-plain");

        if (from == null || subject == null || body == null) {
            return ResponseEntity.badRequest().body("Faltan campos from/subject/body (verificar keys del webhook)");
        }

        String email = extractEmail(from);
        CorreosEntrantes saved = inboundEmailService.procesarCorreoEntrante(email, subject, body);

        if (saved == null) {
            return ResponseEntity.badRequest().body("No se pudo procesar el correo (asunto inválido, ticket/obra no encontrados o remitente no registrado)");
        }

        return ResponseEntity.ok("Correo ingresado: " + saved.getIdCorreoEntrante());
    }
}
