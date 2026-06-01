package PitagoraBackend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvidenciaDTO {

    private Integer idEvidencia;
    private Integer idObservacion;
    private String urlArchivo;
    private LocalDateTime fechaSubida;
    private String nombreUsuario;
    private String apellidoPaterno;
}
