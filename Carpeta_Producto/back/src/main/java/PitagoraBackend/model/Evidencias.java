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
@Table(name = "evidencias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Evidencias {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_evidencia;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_observacion", nullable = false)
    private Observaciones id_observacion; // FK a Observaciones

    @Column(nullable = false, length = 500)
    private String url_archivo; // URL en Google Cloud Storage

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TipoArchivoEnum tipo_archivo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private MomentoEnum momento;

    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fecha_subida;

    // Enums
    public enum TipoArchivoEnum {
        IMAGEN("imagen"),
        VIDEO("video");

        private final String value;

        TipoArchivoEnum(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public enum MomentoEnum {
        ANTES("antes"),
        DESPUES("despues");

        private final String value;

        MomentoEnum(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
