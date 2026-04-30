package PitagoraBackend.model;

import java.io.Serializable;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class ObrasUsuariosId implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    private Integer id_obra;
    private Integer id_usuario;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ObrasUsuariosId that = (ObrasUsuariosId) o;
        return Objects.equals(id_obra, that.id_obra) &&
               Objects.equals(id_usuario, that.id_usuario);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id_obra, id_usuario);
    }
}
