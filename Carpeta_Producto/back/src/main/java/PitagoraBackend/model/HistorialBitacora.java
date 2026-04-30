package PitagoraBackend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "historial_bitacora", indexes = {
    @Index(name = "idx_observacion", columnList = "id_observacion"),
    @Index(name = "idx_usuario", columnList = "id_usuario"),
    @Index(name = "idx_sello_tiempo", columnList = "sello_tiempo")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistorialBitacora {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_historial;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_observacion", nullable = false)
    private Observaciones id_observacion; // FK a Observaciones

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuarios id_usuario; // FK a Usuarios (Autor de la acción)

    @Column(nullable = false)
    private LocalDateTime sello_tiempo; // Fecha y hora exacta inmodificable

    @Column(nullable = false, length = 255)
    private String accion; // Ej: "Cambio de estado a Terminado"

    @Column(columnDefinition = "TEXT")
    private String detalles; // Información adicional de la acción

    @Column(columnDefinition = "TEXT")
    private String justificacion; // Obligatorio si estado = "No Aplica"

    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fecha_creacion;
}
