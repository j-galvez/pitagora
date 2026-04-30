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
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tickets {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_ticket;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_obra", nullable = false)
    private Obras id_obra; // FK a Obras

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_usuario_creador", nullable = false)
    private Usuarios id_usuario_creador; // FK a Usuarios

    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fecha_creacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoTicketEnum estado_general;

    // Enum para estado del ticket
    public enum EstadoTicketEnum {
        ABIERTO("abierto"),
        EN_PROCESO("en proceso"),
        TERMINADO("terminado");

        private final String value;

        EstadoTicketEnum(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
