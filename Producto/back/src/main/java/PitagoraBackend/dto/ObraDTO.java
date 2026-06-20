package PitagoraBackend.dto;

import java.time.LocalDateTime;

public interface ObraDTO {
    Integer getIdObra();
    String getNombreObra();
    String getDescripcionObra();
    String getDireccion();
    String getPlanosPresupuestos();
    String getFechaEntrega();
    String getGarantiaExpira();
    String getEstadoObra();
    LocalDateTime getFechaCreacion();
    
    // Los campos cruzados con otras tablas
    Integer getIdCliente();
    String getNombreEmpresa();
    String getEstadoCliente();
    
    Integer getIdRegion();
    String getNombreRegion();
    
    Integer getIdComuna();
    String getNombreComuna();
    
    // Conteo de observaciones abiertas
    Long getNumeroObservacionesAbiertas();
}