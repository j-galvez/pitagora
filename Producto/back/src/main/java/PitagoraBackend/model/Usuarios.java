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
@Table(name="usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuarios {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100, unique = true)
    private String correo;

    @Column(nullable = false, unique = true, length = 15)
    private String run;

    @Column(name = "apellido_paterno", nullable = false, length = 100)
    private String apellidoPaterno;

    @Column(name = "apellido_materno", nullable = false, length = 100)
    private String apellidoMaterno;

    @Column(name = "direccion_calle", nullable = false, length = 255)
    private String direccionCalle;

    @Column(name = "id_region")
    private Integer idRegion;

    @Column(name = "id_comuna")
    private Integer idComuna;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 20)
    private String rol; // 'admin', 'jefe_obra', 'cliente', 'tecnico'

    @Column(name = "id_obra", nullable = true)
    private Integer idObra; // Para perfiles "cliente": restricción a una única obra

    @Column(length = 20)
    private String telefono;

    @Column(name = "fecha_creacion", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaCreacion;

    @Column(nullable = false, length = 10)
    private String estado; // 'Activo', 'Inactivo'

}
