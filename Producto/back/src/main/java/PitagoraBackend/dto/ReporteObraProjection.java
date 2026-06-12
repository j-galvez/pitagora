package PitagoraBackend.dto;

import java.time.LocalDateTime;

public interface ReporteObraProjection {
    String getObra();
    String getCliente();
    String getResponsable();
    LocalDateTime getFechaRegistro();
    LocalDateTime getFechaResolucion();
    String getFallaDetectada();
    String getUbicacionExacta();
    String getEstadoActual();
    String getSolucionAplicada();
    Long getCosto();
}
