package PitagoraBackend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
    private Integer id_cliente;

    @Column(nullable = false, length = 150)
    private String nombre_empresa;

    @Column(nullable = false, length = 20, unique = true)
    private String rut;

    @Column(length = 100)
    private String correo_contacto;

    @Column(length = 20)
    private String telefono;

    @Column(columnDefinition = "TEXT")
    private String direccion;

    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fecha_creacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private EstadoEnum estado;

    // Enum para estado del cliente
    public enum EstadoEnum {
        ACTIVO("Activo"),
        INACTIVO("Inactivo");

        private final String value;

        EstadoEnum(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
