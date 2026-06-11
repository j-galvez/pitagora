package PitagoraBackend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CostoObservacionDTO {

    private Integer idCosto;
    private Integer idObservacion;
    private Long monto;
    private String descripcion;
    private Integer idUsuario;
    private LocalDateTime fechaRegistro;
    private String nombreUsuario;
    private String apellidoPaterno;
}
