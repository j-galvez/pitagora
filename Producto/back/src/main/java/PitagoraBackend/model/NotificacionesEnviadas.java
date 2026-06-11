package PitagoraBackend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones_enviadas")
public class NotificacionesEnviadas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notificacion")
    private Integer idNotificacion;

    @Column(name = "id_observacion", nullable = false)
    private Integer idObservacion;

    @Column(name = "destinatario", nullable = false)
    private String destinatario;

    @Column(name = "asunto", nullable = false, columnDefinition = "TEXT")
    private String asunto;

    @Column(name = "cuerpo", columnDefinition = "LONGTEXT")
    private String cuerpo;

    @Column(name = "tipo_notificacion", nullable = false)
    private String tipoNotificacion; // 'nueva_observacion', 'cambio_estado', 'recordatorio', 'rechazo_aceptacion'

    @Column(name = "fecha_envio", nullable = false)
    private LocalDateTime fechaEnvio;

    @Column(name = "estado_envio", nullable = false)
    private String estadoEnvio; // 'enviado', 'error', 'pending'

    // Constructores
    public NotificacionesEnviadas() {}

    public NotificacionesEnviadas(Integer idObservacion, String destinatario, String asunto, String cuerpo, String tipoNotificacion) {
        this.idObservacion = idObservacion;
        this.destinatario = destinatario;
        this.asunto = asunto;
        this.cuerpo = cuerpo;
        this.tipoNotificacion = tipoNotificacion;
        this.fechaEnvio = LocalDateTime.now();
        this.estadoEnvio = "enviado";
    }

    // Getters y Setters
    public Integer getIdNotificacion() {
        return idNotificacion;
    }

    public void setIdNotificacion(Integer idNotificacion) {
        this.idNotificacion = idNotificacion;
    }

    public Integer getIdObservacion() {
        return idObservacion;
    }

    public void setIdObservacion(Integer idObservacion) {
        this.idObservacion = idObservacion;
    }

    public String getDestinatario() {
        return destinatario;
    }

    public void setDestinatario(String destinatario) {
        this.destinatario = destinatario;
    }

    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }

    public String getCuerpo() {
        return cuerpo;
    }

    public void setCuerpo(String cuerpo) {
        this.cuerpo = cuerpo;
    }

    public String getTipoNotificacion() {
        return tipoNotificacion;
    }

    public void setTipoNotificacion(String tipoNotificacion) {
        this.tipoNotificacion = tipoNotificacion;
    }

    public LocalDateTime getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(LocalDateTime fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    public String getEstadoEnvio() {
        return estadoEnvio;
    }

    public void setEstadoEnvio(String estadoEnvio) {
        this.estadoEnvio = estadoEnvio;
    }
}
