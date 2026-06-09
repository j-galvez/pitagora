package PitagoraBackend.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDTO {
    private String tipo;           // "Mensaje" o "Observación"
    private Integer idRelacionado; // id de la Observación (para abrir el modal)
    private String titulo;         // Falla (si es observación) o Autor (si es mensaje)
    private String descripcion;    // Problema (si es observación) o Contenido (si es mensaje)
    private LocalDateTime fecha;   // Fecha de registro o envío
}
