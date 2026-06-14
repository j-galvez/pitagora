package PitagoraBackend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import PitagoraBackend.model.Observaciones;
import PitagoraBackend.repository.ObservacionesRepository;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
public class NotificationScheduler {

    @Autowired
    private ObservacionesRepository observacionesRepository;

    @Autowired
    private ObservacionesService observacionesService;

    @Autowired
    private NotificationService notificationService;

    private static final int MAX_RECORDATORIOS = 4;
    private static final int DIAS_ENTRE_RECORDATORIOS = 7;

    // Ejecuta checks periódicos para recordatorios y cierre automático
    // Por defecto: cada 7 días (604800000 ms). Puede ajustarse con la propiedad notifications.reminder.delay-ms
    @Scheduled(initialDelayString = "${notifications.reminder.initial-delay-ms:604800000}", fixedDelayString = "${notifications.reminder.delay-ms:604800000}")
    public void runWeeklyReminders() {
        log.info("Ejecutando recordatorio programado para observaciones pendientes de aceptación");
        List<Observaciones> pendientes = observacionesRepository.findByEstadoObservacion("en espera aceptación");

        for (Observaciones obs : pendientes) {
            String confirm = obs.getConfirmacionCliente();
            if (confirm != null && !confirm.equalsIgnoreCase("pendiente")) {
                log.debug("Omitiendo observación {} porque confirmacionCliente={} no está pendiente", obs.getIdObservacion(), confirm);
                continue;
            }

            Integer intentos = obs.getIntentosRecordatorio() == null ? 0 : obs.getIntentosRecordatorio();
            LocalDateTime referencia = obs.getFechaRegistro() != null ? obs.getFechaRegistro() : LocalDateTime.now();
            LocalDateTime siguienteEnvio = referencia.plusDays((long) DIAS_ENTRE_RECORDATORIOS * (intentos + 1));

            if (LocalDateTime.now().isBefore(siguienteEnvio)) {
                log.info("No es hora de recordar aún la observación {}: próxima fecha {} (intentos={})", obs.getIdObservacion(), siguienteEnvio, intentos);
                continue;
            }

            if (intentos < MAX_RECORDATORIOS) {
                try {
                    notificationService.enviarRecordatorioAceptacion(obs, intentos);
                } catch (Exception e) {
                    log.error("Error enviando recordatorio de aceptación para observación {}: {}", obs.getIdObservacion(), e.getMessage(), e);
                }
                obs.setIntentosRecordatorio(intentos + 1);
                observacionesRepository.save(obs);
            } else {
                // Tras 4 recordatorios sin respuesta, cerrar automáticamente
                try {
                    Observaciones update = new Observaciones();
                    update.setEstadoObservacion("terminado");
                    observacionesService.actualizarObservaciones(obs.getIdObservacion(), update);
                    log.info("Observación {} cerrada automáticamente tras {} recordatorios", obs.getIdObservacion(), MAX_RECORDATORIOS);
                } catch (Exception e) {
                    log.error("Error cerrando automáticamente observación {}: {}", obs.getIdObservacion(), e.getMessage(), e);
                }
            }
        }
    }
}
