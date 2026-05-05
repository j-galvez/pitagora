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
@Table(name = "observaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Observaciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_observacion")
    private Integer idObservacion;

    @Column(name = "id_ticket", nullable = false)
    private Integer idTicket;

    @Column(name = "id_categoria", nullable = false)
    private Integer idCategoria;

    @Column(nullable = false, length = 200)
    private String falla;

    @Column(name = "ubicacion_exacta", nullable = false, length = 255)
    private String ubicacionExacta;

    @Column(name = "descripcion_problema", nullable = false, columnDefinition = "TEXT")
    private String descripcionProblema;

    @Column(length = 10)
    private String urgencia; // 'baja', 'media', 'alta'

    @Column(name = "estado_observacion", length = 30)
    private String estadoObservacion; // 'pendiente', 'en observación', 'aplica', 'en proceso', 'en espera aceptación', 'terminado', 'no aplica'

    @Column(name = "confirmacion_cliente", length = 20)
    private String confirmacionCliente; // 'pendiente', 'aceptado', 'rechazado'

    @Column(name = "fecha_confirmacion")
    private LocalDateTime fechaConfirmacion;

    @Column(name = "comentario_cliente", columnDefinition = "TEXT")
    private String comentarioCliente;

    @Column(name = "token_aceptacion", length = 100, unique = true)
    private String tokenAceptacion;

    @Column(name = "intentos_recordatorio")
    private Integer intentosRecordatorio;

    @Column(name = "fecha_registro", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaRegistro;

    @Column(name = "fecha_termino")
    private LocalDateTime fechaTermino;
}
