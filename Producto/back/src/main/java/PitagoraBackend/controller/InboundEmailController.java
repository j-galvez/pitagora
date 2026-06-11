package PitagoraBackend.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.dto.InboundEmailRequest;
import PitagoraBackend.model.Mensajes;
import PitagoraBackend.service.InboundEmailService;

@RestController
@RequestMapping("/api/webhook/email")
@Slf4j
public class InboundEmailController {

    @Autowired
    private InboundEmailService inboundEmailService;

    @Value("${app.webhook.secret:webhook-secret-key-pitagora-12345}")
    private String webhookSecret;

    @Value("${app.email.inbound.enabled:true}")
    private boolean inboundEnabled;

    /**
     * Endpoint para recibir correos entrantes
     * POST /api/webhook/email/inbound
     * Body: InboundEmailRequest
     */
    @PostMapping("/inbound")
    public ResponseEntity<?> receiveInboundEmail(@RequestBody InboundEmailRequest emailRequest) {
        try {
            if (!inboundEnabled) {
                log.warn("Correos entrantes deshabilitados");
                return ResponseEntity.status(403).body("Inbound emails are disabled");
            }

            // 1. Validar que venga del webhook correcto (basic check)
            // En producción, usar HMAC o JWT
            if (emailRequest == null || emailRequest.getFromEmail() == null) {
                log.warn("Solicitud de correo inválida: from email vacío");
                return ResponseEntity.badRequest().body("Invalid email request: missing from");
            }

            log.info("Recibido correo entrante de: {} asunto: {}", emailRequest.getFromEmail(), emailRequest.getSubject());

            // 2. Procesar el correo
            Mensajes mensaje = inboundEmailService.procesarCorreoEntrante(
                emailRequest.getFromEmail(),
                emailRequest.getSubject(),
                emailRequest.getBodyContent()
            );

            if (mensaje == null) {
                log.warn("No se pudo procesar el correo: metadata inválida o usuario no encontrado");
                return ResponseEntity.ok()
                    .body("Email processed but not stored (invalid metadata or user not found)");
            }

            log.info("Correo entrante guardado como mensaje {}", mensaje.getIdMensaje());
            return ResponseEntity.ok()
                .body("Email received and stored as message " + mensaje.getIdMensaje());

        } catch (Exception e) {
            log.error("Error procesando correo entrante", e);
            return ResponseEntity.status(500)
                .body("Error processing inbound email: " + e.getMessage());
        }
    }

    /**
     * Health check para el webhook
     */
    @GetMapping("/health")
    public ResponseEntity<?> webhookHealth() {
        return ResponseEntity.ok("Inbound email webhook is operational");
    }
}
