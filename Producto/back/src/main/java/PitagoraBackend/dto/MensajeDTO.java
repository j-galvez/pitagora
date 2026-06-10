package PitagoraBackend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MensajeDTO {

    private Integer idMensaje;
    private Integer idObservacion;
    private Integer idUsuario;
    private Integer idEvidencia;
    private String mensaje;
    private LocalDateTime fechaEnvio;
    private String urlArchivo;
    private String nombreUsuario;
    private String apellidoPaterno;
}
