package PitagoraBackend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "obras_usuarios")
@IdClass(ObrasUsuariosId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ObrasUsuarios {
    
    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_obra", nullable = false)
    private Obras id_obra; // FK a Obras

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuarios id_usuario; // FK a Usuarios

    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fecha_asignacion;
}
