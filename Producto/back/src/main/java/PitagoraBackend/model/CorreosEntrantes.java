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
@Table(name = "correos_entrantes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CorreosEntrantes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_correo_entrante")
    private Integer idCorreoEntrante;

    @Column(name = "id_ticket", nullable = false)
    private Integer idTicket;

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String asunto;

    @Column(name = "asunto_normalizado", nullable = false, length = 500)
    private String asuntoNormalizado;

    @Column(columnDefinition = "LONGTEXT")
    private String cuerpo;

    @Column(name = "fecha_recepcion", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaRecepcion;
}
