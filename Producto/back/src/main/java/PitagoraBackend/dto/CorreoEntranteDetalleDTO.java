package PitagoraBackend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CorreoEntranteDetalleDTO {
    private Integer idMensaje;
    private String asunto;
    private String mensaje;
    private LocalDateTime fechaEnvio;
    private String correoRemitente;
    private String nombreRemitente;
    private Integer idTicket;
    private String nombreObra;
}
