package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.model.Obras;
import PitagoraBackend.repository.ObrasRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ObrasService {
    
    @Autowired
    private ObrasRepository obrasRepository;
    
    // CREATE - Crear una nueva obra
    public Obras crearObra(Obras obra) {
        obra.setFecha_creacion(LocalDateTime.now());
        if (obra.getEstado_obra() == null) {
            obra.setEstado_obra(Obras.EstadoObraEnum.ACTIVA);
        }
        return obrasRepository.save(obra);
    }
    
    // READ - Obtener todas las obras
    public List<Obras> obtenerTodas() {
        return obrasRepository.findAll();
    }
    
    // READ - Obtener una obra por ID
    public Optional<Obras> obtenerPorId(Integer id) {
        return obrasRepository.findById(id);
    }
    
    // READ - Obtener todas las obras de un cliente
    public List<Obras> obtenerObrasPorCliente(Integer idCliente) {
        return obrasRepository.findByIdCliente_IdCliente(idCliente);
    }
    
    // READ - Buscar obras por nombre
    public List<Obras> buscarPorNombre(String nombre) {
        return obrasRepository.findByNombreObraContainingIgnoreCase(nombre);
    }
    
    // UPDATE - Actualizar una obra
    public Obras actualizarObra(Integer id, Obras obraActualizada) {
        Optional<Obras> obraExistente = obrasRepository.findById(id);
        if (obraExistente.isPresent()) {
            Obras obra = obraExistente.get();
            
            if (obraActualizada.getNombre_obra() != null) {
                obra.setNombre_obra(obraActualizada.getNombre_obra());
            }
            if (obraActualizada.getDescripcion_obra() != null) {
                obra.setDescripcion_obra(obraActualizada.getDescripcion_obra());
            }
            if (obraActualizada.getDireccion() != null) {
                obra.setDireccion(obraActualizada.getDireccion());
            }
            if (obraActualizada.getPlanos_presupuestos() != null) {
                obra.setPlanos_presupuestos(obraActualizada.getPlanos_presupuestos());
            }
            if (obraActualizada.getFecha_entrega() != null) {
                obra.setFecha_entrega(obraActualizada.getFecha_entrega());
            }
            if (obraActualizada.getGarantia_expira() != null) {
                obra.setGarantia_expira(obraActualizada.getGarantia_expira());
            }
            if (obraActualizada.getEstado_obra() != null) {
                obra.setEstado_obra(obraActualizada.getEstado_obra());
            }
            if (obraActualizada.getId_cliente() != null) {
                obra.setId_cliente(obraActualizada.getId_cliente());
            }
            
            return obrasRepository.save(obra);
        }
        return null;
    }
    
    // DELETE - Eliminar una obra
    public boolean eliminarObra(Integer id) {
        if (obrasRepository.existsById(id)) {
            obrasRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
