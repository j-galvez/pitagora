package PitagoraBackend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name="tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tickets {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ticket")
    private Integer idTicket;

    @Column(name = "id_obra", nullable = false)
    private Integer idObra;

    @ManyToOne
    @JoinColumn(name = "id_obra", insertable = false, updatable = false)
    private Obras obra;

    @Column(name = "id_usuario_creador", nullable = false)
    private Integer idUsuarioCreador;

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario;

    @ManyToOne
    @JoinColumn(name = "id_usuario", insertable = false, updatable = false)
    private Usuarios usuarioAsignado;

    @Column(name = "fecha_creacion", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaCreacion;

    @Column(name = "estado_general", nullable = false, length = 20)
    private String estadoGeneral; // 'abierto', 'en proceso', 'terminado'

    @Column(name = "costo_total", columnDefinition = "BIGINT DEFAULT 0")
    private Long costoTotal;
}
