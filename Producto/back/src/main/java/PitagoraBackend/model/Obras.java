package PitagoraBackend.model;

import java.time.LocalDate;
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
@Table(name="obras")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Obras {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_obra")
    private Integer idObra;

    @Column(name = "id_cliente", nullable = false)
    private Integer idCliente;

    @Column(name = "nombre_obra", nullable = false, length = 150)
    private String nombreObra;

    @Column(name = "descripcion_obra", columnDefinition = "TEXT")
    private String descripcionObra;

    @Column(columnDefinition = "TEXT")
    private String direccion;

    @Column(name = "id_region", nullable = false)
    private Integer idRegion;

    @Column(name = "id_comuna", nullable = false)
    private Integer idComuna;

    @Column(name = "planos_presupuestos", length = 500)
    private String planosPresupuestos;

    @Column(name = "fecha_entrega")
    private LocalDate fechaEntrega;

    @Column(name = "garantia_expira")
    private LocalDate garantiaExpira;

    @Column(name = "estado_obra", nullable = false, length = 20)
    private String estadoObra; // 'Activa', 'Garantía Vencida', 'Cerrada'

    @Column(name = "fecha_creacion", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaCreacion;
}
