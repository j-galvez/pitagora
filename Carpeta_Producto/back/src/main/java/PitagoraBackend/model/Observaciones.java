package PitagoraBackend.model;

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
@Table(name = "observaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Observaciones {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_observacion;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_ticket", nullable = false)
    private Tickets id_ticket; // FK a Tickets

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categorias id_categoria; // FK a Categorias

    @Column(nullable = false, length = 200)
    private String falla; // Título: "Grieta en muro"

    @Column(nullable = false, length = 255)
    private String ubicacion_exacta; // Ej: "Baño N°4, Fachada Oriente"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion_problema;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private UrgenciaEnum urgencia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 25)
    private EstadoObservacionEnum estado_observacion;

    // Flujo de Confirmación Digital del Cliente
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private ConfirmacionClienteEnum confirmacion_cliente;

    @Column
    private LocalDateTime fecha_confirmacion;

    @Column(columnDefinition = "TEXT")
    private String comentario_cliente;

    @Column(length = 100, unique = true)
    private String token_aceptacion; // Token único para link de confirmación

    @Column
    private Integer intentos_recordatorio; // Máximo 4 semanales

    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fecha_registro;

    @Column
    private LocalDateTime fecha_termino;

    // Enums
    public enum UrgenciaEnum {
        BAJA("baja"),
        MEDIA("media"),
        ALTA("alta");

        private final String value;

        UrgenciaEnum(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public enum EstadoObservacionEnum {
        PENDIENTE("pendiente"),
        EN_OBSERVACION("en observación"),
        APLICA("aplica"),
        EN_PROCESO("en proceso"),
        EN_ESPERA_ACEPTACION("en espera aceptación"),
        TERMINADO("terminado"),
        NO_APLICA("no aplica");

        private final String value;

        EstadoObservacionEnum(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public enum ConfirmacionClienteEnum {
        PENDIENTE("pendiente"),
        ACEPTADO("aceptado"),
        RECHAZADO("rechazado");

        private final String value;

        ConfirmacionClienteEnum(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
