package PitagoraBackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "comunas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comunas {
    
    @Id
    @Column(name = "id_comuna")
    private Integer idComuna;

    @Column(name = "nombre_comuna", nullable = false, length = 100)
    private String nombreComuna;

    @Column(name = "id_region", nullable = false)
    private Integer idRegion;
}

// Made with Bob
