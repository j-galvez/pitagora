package PitagoraBackend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "obras")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Obras {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_obra;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Clientes id_cliente; // FK a Clientes

    @Column(nullable = false, length = 150)
    private String nombre_obra;

    @Column(columnDefinition = "TEXT")
    private String descripcion_obra;

    @Column(columnDefinition = "TEXT")
    private String direccion;

    @Column(length = 500)
    private String planos_presupuestos; // URL a Cloud Storage

    @Column
    private LocalDate fecha_entrega;

    @Column
    private LocalDate garantia_expira; // 3 años para terminaciones

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoObraEnum estado_obra;

    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fecha_creacion;

    // Enum para estado de la obra
    public enum EstadoObraEnum {
        ACTIVA("Activa"),
        GARANTIA_VENCIDA("Garantía Vencida"),
        CERRADA("Cerrada");

        private final String value;

        EstadoObraEnum(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
