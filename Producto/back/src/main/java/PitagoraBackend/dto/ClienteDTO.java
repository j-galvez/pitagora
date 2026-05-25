package PitagoraBackend.dto;

public interface ClienteDTO {
    Integer getIdCliente();
    String getNombreEmpresa();
    String getRut();
    String getCorreoContacto();
    String getTelefono();
    // Conteo de observaciones abiertas
    Long getNumeroObservacionesAbiertas();
    // Conteo de obras
    Long getNumeroObras();
}