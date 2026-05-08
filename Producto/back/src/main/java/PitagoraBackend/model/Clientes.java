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
@Table(name = "clientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Clientes {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Integer idCliente;

    @Column(name = "nombre_empresa", nullable = false, length = 150)
    private String nombreEmpresa;

    @Column(nullable = false, unique = true, length = 20)
    private String rut;

    @Column(name = "correo_contacto", length = 100)
    private String correoContacto;

    @Column(length = 20)
    private String telefono;

    @Column(name = "direccion_calle", length = 255)
    private String direccion;

    @Column(name = "id_region")
    private Integer idRegion;

    @Column(name = "id_comuna")
    private Integer idComuna;

    @Column(name = "fecha_creacion", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaCreacion;

    @Column(nullable = false, length = 10)
    private String estado; // 'Activo', 'Inactivo'
}

// Made with Bob
