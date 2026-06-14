package PitagoraBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ObraCostoDTO {
    private Integer idObra;
    private String nombreObra;
    private Long montoTotal;
}
