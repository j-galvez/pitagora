package PitagoraBackend.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteObraDTO {
    private String obra;
    private String cliente;
    private String responsable;
    private LocalDateTime fechaRegistro;
    private LocalDateTime fechaResolucion;
    private String fallaDetectada;
    private String ubicacionExacta;
    private String estadoActual;
    private String solucionAplicada;
    private Long costo;
}
