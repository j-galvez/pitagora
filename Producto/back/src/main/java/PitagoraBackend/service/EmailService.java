package PitagoraBackend.service;

import PitagoraBackend.model.Usuarios;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Random;

@Service
@Slf4j
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@pitagora.com}")
    private String mailFrom;

    @Value("${app.mail.subject.bienvenida:Bienvenido a Pitagora - Credenciales de Acceso}")
    private String subjectBienvenida;

    @Value("${app.site.url:http://localhost:5173}")
    private String siteUrl;

    private static final int MAX_INTENTOS = 3;
    private static final int DELAY_BASE_MS = 2000;

    public void enviarCorreoBienvenida(Usuarios usuario, String password) {
        reintentarEnvio(usuario, password, 1);
    }

    private void reintentarEnvio(Usuarios usuario, String password, int intento) {
        try {
            if (intento <= MAX_INTENTOS) {
                enviarCorreoInterno(usuario, password);
                log.info("Correo de bienvenida enviado exitosamente a: {}", usuario.getCorreo());
            }
        } catch (MessagingException | org.springframework.mail.MailException e) {
            if (intento < MAX_INTENTOS) {
                long delayMs = DELAY_BASE_MS * (long) Math.pow(2, intento - 1);
                log.warn("Intento {} de envío a {} falló. Reintentando en {}ms",
                    intento, usuario.getCorreo(), delayMs, e);

                try {
                    Thread.sleep(delayMs);
                    reintentarEnvio(usuario, password, intento + 1);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    log.error("Interrupción al esperar reintentos para {}", usuario.getCorreo(), ie);
                }
            } else {
                log.error("Falló el envío de correo a {} después de {} intentos",
                    usuario.getCorreo(), MAX_INTENTOS, e);
            }
        }
    }

    private void enviarCorreoInterno(Usuarios usuario, String password) throws MessagingException {
        MimeMessage mensaje = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

        helper.setFrom(mailFrom);
        helper.setTo(usuario.getCorreo());
        helper.setSubject(subjectBienvenida);

        String htmlContent = construirHtmlCorreo(usuario, password);
        helper.setText(htmlContent, true);

        mailSender.send(mensaje);
    }

    private String construirHtmlCorreo(Usuarios usuario, String password) {
        String instruccionesDinamicas = "";
        String mensajeBienvenidaRol = "";

        // NOTA: Ajusta "admin" y "usuario" según cómo guardes los roles en tu base de datos (Ej: "ROLE_ADMIN", "ADMIN", etc.)
        if (usuario.getRol() != null && usuario.getRol().equalsIgnoreCase("admin")) {
            mensajeBienvenidaRol = "Tu cuenta de <strong>Administrador</strong> ha sido creada exitosamente. A continuación encontrarás tus credenciales de acceso y un resumen de las funcionalidades de la plataforma.";
            
            instruccionesDinamicas = """
                <div class="section-title">🛠️ Funcionalidades del Administrador</div>
                <p>Como administrador, tienes acceso global a los siguientes módulos del sistema:</p>
                <ul class="workflow-list">
                    <li><strong>1. Dashboard:</strong> Visualiza las estadísticas generales del sistema de postventa en tiempo real.</li>
                    <li><strong>2. Tickets:</strong> Listado completo de tickets con opciones para filtrar, crear nuevos tickets y visualizar las observaciones asociadas a cada uno.</li>
                    <li><strong>3. Clientes:</strong> Gestión y listado de clientes junto con sus obras asociadas, incluyendo la opción de registrar nuevos clientes.</li>
                    <li><strong>4. Obras:</strong> Listado de obras del sistema, visualización de sus observaciones asociadas y creación de nuevas obras.</li>
                    <li><strong>5. Usuarios:</strong> Panel de control de personal con opciones para la creación y edición de usuarios.</li>
                </ul>
                """;
        } else {
            // Rol estándar / Usuario
            mensajeBienvenidaRol = "Tu cuenta de <strong>Usuario</strong> ha sido creada exitosamente. A continuación encontrarás tus credenciales de acceso y los pasos iniciales para interactuar con la plataforma.";
            
            instruccionesDinamicas = """
                <div class="section-title">📋 Flujo de Trabajo: Tickets y Observaciones</div>
                <p>En Pitagora, el flujo para reportar requerimientos y hacerles seguimiento es el siguiente:</p>
                <ul class="workflow-list">
                    <li><strong>1. Ticket:</strong> Creación y apertura de un nuevo ticket de soporte o postventa.</li>
                    <li><strong>2. Observación:</strong> Creación de observaciones detalladas adjuntando y cargando la evidencia correspondiente.</li>
                    <li><strong>3. Seguimiento:</strong> Consulta el historial completo de la observación para conocer en qué estado se encuentra en tiempo real.</li>
                </ul>
                """;
        }

        return """
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; }
                    .header { background-color: #0B3B60; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
                    .header h1 { margin: 0; font-size: 28px; }
                    .content { background-color: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
                    .section-title { color: #0B3B60; font-size: 18px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid #0B3B60; padding-bottom: 8px; }
                    .credentials-box { background-color: #f0f8ff; border-left: 4px solid #0B3B60; padding: 15px; margin: 15px 0; border-radius: 4px; font-family: 'Courier New', monospace; }
                    .credential-item { margin: 10px 0; }
                    .credential-label { font-weight: bold; color: #0B3B60; }
                    .credential-value { background-color: white; padding: 8px; border-radius: 3px; margin-top: 3px; word-break: break-all; }
                    .workflow-list { list-style-type: none; padding-left: 0; }
                    .workflow-list li { padding: 8px; background-color: #f9f9f9; margin: 5px 0; border-left: 3px solid #0B3B60; padding-left: 12px; }
                    .cta-button { display: inline-block; background-color: #0B3B60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; font-weight: bold; }
                    .footer { background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; margin-top: 20px; }
                    .warning-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; border-radius: 4px; font-size: 13px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>¡Bienvenido a Pitagora!</h1>
                    </div>
                    <div class="content">
                        <p>Hola <strong>%s %s</strong>,</p>

                        <p>%s</p>

                        <div class="section-title">🔐 Tus Credenciales de Acceso</div>
                        <div class="credentials-box">
                            <div class="credential-item">
                                <div class="credential-label">👤 Usuario (Correo):</div>
                                <div class="credential-value">%s</div>
                            </div>
                            <div class="credential-item">
                                <div class="credential-label">🔑 Contraseña:</div>
                                <div class="credential-value">%s</div>
                            </div>
                        </div>

                        <div class="warning-box">
                            <strong>⚠️ Importante:</strong> Guarda estas credenciales en un lugar seguro. Te recomendamos cambiar tu contraseña después del primer acceso.
                        </div>

                        %s

                        <p>Para obtener más información sobre el uso de la plataforma, puedes consultar nuestra <a href="%s" target="_blank" style="color: #0B3B60; text-decoration: none; font-weight: bold;">documentación completa</a>.</p>

                        <div style="text-align: center; margin: 25px 0;">
                            <a href="%s" class="cta-button">Inicia Sesión Ahora</a>
                        </div>

                        <div class="section-title">¿Necesitas Ayuda?</div>
                        <p>Si tienes preguntas o necesitas soporte, no dudes en contactar a nuestro equipo:</p>
                        <ul style="padding-left: 20px;">
                            <li>📧 Email: postventa@pitagora.com</li>
                            <li>📱 Teléfono: +56 9 XXXX XXXX</li>
                            <li>🌐 Sitio web: <a href="%s" style="color: #0B3B60;">%s</a></li>
                        </ul>

                        <p style="margin-top: 30px; color: #999; font-size: 12px;">Este es un correo automático, por favor no respondas a esta dirección.</p>
                    </div>

                    <div class="footer">
                        <p>&copy; 2026 Pitagora. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            .formatted(
                usuario.getNombre(),
                usuario.getApellidoPaterno(),
                mensajeBienvenidaRol,
                usuario.getCorreo(),
                password,
                instruccionesDinamicas,
                siteUrl + "/documentacion",
                siteUrl,
                siteUrl,
                siteUrl
            );
    }

    public String generarContrasenaAleatoria() {
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&%#@!";
        StringBuilder contrasena = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < 12; i++) {
            contrasena.append(caracteres.charAt(random.nextInt(caracteres.length())));
        }

        return contrasena.toString();
    }
}