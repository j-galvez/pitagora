package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.model.ObrasUsuarios;
import PitagoraBackend.model.ObrasUsuariosId;
import PitagoraBackend.repository.ObrasUsuariosRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ObrasUsuariosService {
    
    @Autowired
    private ObrasUsuariosRepository obrasUsuariosRepository;
    
    // CREATE - Asignar un usuario a una obra
    public ObrasUsuarios asignarUsuarioAObra(ObrasUsuarios asignacion) {
        asignacion.setFecha_asignacion(LocalDateTime.now());
        return obrasUsuariosRepository.save(asignacion);
    }
    
    // READ - Obtener todas las asignaciones
    public List<ObrasUsuarios> obtenerTodas() {
        return obrasUsuariosRepository.findAll();
    }
    
    // READ - Obtener asignación por ID (obra y usuario)
    public Optional<ObrasUsuarios> obtenerPorId(ObrasUsuariosId id) {
        return obrasUsuariosRepository.findById(id);
    }
    
    // READ - Obtener todos los usuarios asignados a una obra
    public List<ObrasUsuarios> obtenerUsuariosPorObra(Integer idObra) {
        return obrasUsuariosRepository.findByIdObra_IdObra(idObra);
    }
    
    // READ - Obtener todas las obras asignadas a un usuario
    public List<ObrasUsuarios> obtenerObrasPorUsuario(Integer idUsuario) {
        return obrasUsuariosRepository.findByIdUsuario_IdUsuario(idUsuario);
    }
    
    // UPDATE - NO SE PERMITE ACTUALIZAR
    // Las asignaciones son un registro histórico y no deben modificarse
    
    // DELETE - Desasignar un usuario de una obra
    public boolean desasignarUsuarioDeObra(Integer idObra, Integer idUsuario) {
        ObrasUsuariosId id = new ObrasUsuariosId(idObra, idUsuario);
        if (obrasUsuariosRepository.existsById(id)) {
            obrasUsuariosRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
