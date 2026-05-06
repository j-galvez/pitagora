package PitagoraBackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "regiones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Regiones {
    
    @Id
    @Column(name = "id_region")
    private Integer idRegion;

    @Column(name = "nombre_region", nullable = false, length = 100)
    private String nombreRegion;
}

// Made with Bob
