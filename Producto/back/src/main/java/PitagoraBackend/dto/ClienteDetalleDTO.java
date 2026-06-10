package PitagoraBackend.dto;

import java.time.LocalDateTime;

public interface ClienteDetalleDTO {
    Integer getIdCliente();
    String getNombreEmpresa();
    String getRut();
    String getCorreoContacto();
    String getTelefono();
    String getDireccionCalle();
    Integer getIdRegion();
    String getNombreRegion();
    Integer getIdComuna();
    String getNombreComuna();
    String getEstado();
    LocalDateTime getFechaCreacion();
}
