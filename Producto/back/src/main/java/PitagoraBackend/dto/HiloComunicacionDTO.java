package PitagoraBackend.dto;

import java.time.LocalDateTime;

/**
 * DTO que representa un elemento del hilo de comunicación de una observación.
 * Puede ser:
 * - Un mensaje manual (mensaje_manual)
 * - Una notificación enviada por el sistema (notificacion)
 */
public class HiloComunicacionDTO {
    
    private String tipo; // "mensaje_manual" o "notificacion"
    private LocalDateTime fecha;
    private String remitente; // nombre/email del remitente
    private String asunto;
    private String contenido;
    private String rol; // "cliente", "admin", "sistema"
    private boolean aceptado; // si fue aceptado (solo para notificaciones "en espera aceptación")
    private boolean rechazado; // si fue rechazado

    public HiloComunicacionDTO() {}

    // Usado para mensajes manuales
    public HiloComunicacionDTO(String tipo, LocalDateTime fecha, String remitente, String contenido, String rol) {
        this.tipo = tipo;
        this.fecha = fecha;
        this.remitente = remitente;
        this.contenido = contenido;
        this.rol = rol;
    }

    // Usado para notificaciones
    public HiloComunicacionDTO(String tipo, LocalDateTime fecha, String remitente, String asunto, String contenido, String rol) {
        this.tipo = tipo;
        this.fecha = fecha;
        this.remitente = remitente;
        this.asunto = asunto;
        this.contenido = contenido;
        this.rol = rol;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getRemitente() {
        return remitente;
    }

    public void setRemitente(String remitente) {
        this.remitente = remitente;
    }

    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public boolean isAceptado() {
        return aceptado;
    }

    public void setAceptado(boolean aceptado) {
        this.aceptado = aceptado;
    }

    public boolean isRechazado() {
        return rechazado;
    }

    public void setRechazado(boolean rechazado) {
        this.rechazado = rechazado;
    }
}
