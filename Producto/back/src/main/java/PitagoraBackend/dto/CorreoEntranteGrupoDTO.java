package PitagoraBackend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CorreoEntranteGrupoDTO {
    private Integer idTicket;
    private String nombreObra;
    private String correoRemitente;
    private Integer cantidadCorreos;
    private String asuntoNormalizado;
    private LocalDateTime fechaUltimo;
}
