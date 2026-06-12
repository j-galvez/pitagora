package PitagoraBackend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "costos_observacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CostosObservacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_costo")
    private Integer idCosto;

    @Column(name = "id_observacion", nullable = false)
    private Integer idObservacion;

    @Column(nullable = false, columnDefinition = "BIGINT DEFAULT 0")
    private Long monto;

    @Column(nullable = false, length = 255)
    private String descripcion;

    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "fecha_registro", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaRegistro;
}
