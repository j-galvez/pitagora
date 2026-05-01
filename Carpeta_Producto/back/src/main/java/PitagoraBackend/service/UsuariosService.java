package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.repository.UsuariosRepository;
import PitagoraBackend.model.Usuarios;
import java.util.List;
import java.util.Optional;

@Service
public class UsuariosService {

    @Autowired
    private UsuariosRepository usuariosRepository;

    // CREATE
    public Usuarios crearUsuarios(Usuarios usuarios) {
        // Validaciones básicas

        if (usuarios.getNombre() == null || usuarios.getNombre().isEmpty()) {
            throw new IllegalArgumentException("El nombre es requerido");
        }

        if (usuarios.getCorreo() == null || usuarios.getCorreo().isEmpty()) {
            throw new IllegalArgumentException("El correo es requerido");
        }

        // Verificar que el correo no exista
        if (usuariosRepository.existsByCorreo(usuarios.getCorreo())) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        // Guardar el usuario
        return usuariosRepository.save(usuarios);
    }

    // READ - Obtener todos los usuarios
    public List<Usuarios> obtenerUsuarios() {
        return usuariosRepository.findAll();
    }

    // READ - Obtener usuario por ID
    public Usuarios obtenerUsuarioById(Integer id) {
        Optional<Usuarios> usuario = usuariosRepository.findById(id);
        if (!usuario.isPresent()) {
            throw new IllegalArgumentException("Usuario no encontrado con ID: " + id);
        }
        return usuario.get();
    }

    // UPDATE
    public Usuarios actualizarUsuarios(Integer id, Usuarios usuariosActualizado) {
        // Verificar que el usuario exista
        Usuarios usuarioExistente = obtenerUsuarioById(id);

        // Validar campos
        if (usuariosActualizado.getNombre() != null && !usuariosActualizado.getNombre().isEmpty()) {
            usuarioExistente.setNombre(usuariosActualizado.getNombre());
        }

        if (usuariosActualizado.getCorreo() != null && !usuariosActualizado.getCorreo().isEmpty()) {
            // Verificar que el nuevo correo no esté en uso por otro usuario
            if (!usuarioExistente.getCorreo().equals(usuariosActualizado.getCorreo()) && 
                usuariosRepository.existsByCorreo(usuariosActualizado.getCorreo())) {
                throw new IllegalArgumentException("El correo ya está registrado");
            }
            usuarioExistente.setCorreo(usuariosActualizado.getCorreo());
        }

        if (usuariosActualizado.getTelefono() != null && !usuariosActualizado.getTelefono().isEmpty()) {
            usuarioExistente.setTelefono(usuariosActualizado.getTelefono());
        }

        if (usuariosActualizado.getRol() != null && !usuariosActualizado.getRol().isEmpty()) {
            usuarioExistente.setRol(usuariosActualizado.getRol());
        }

        if (usuariosActualizado.getEstado() != null && !usuariosActualizado.getEstado().isEmpty()) {
            usuarioExistente.setEstado(usuariosActualizado.getEstado());
        }

        return usuariosRepository.save(usuarioExistente);
    }

    // DELETE
    public void eliminarUsuarios(Integer id) {
        // Verificar que el usuario exista
        if (!usuariosRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuario no encontrado con ID: " + id);
        }
        usuariosRepository.deleteById(id);
    }

    // Nuevo método para autenticar usuario
    public Usuarios validarCredenciales(String correo, String password) {
        Usuarios usuario = usuariosRepository.findByCorreo(correo)
                .orElseThrow(() -> new IllegalArgumentException("Correo o contraseña incorrectos"));

        // Ojo: Si en el futuro usas encriptación (como BCrypt), debes comparar el hash aquí.
        // Por ahora comparamos texto plano:
        if (!usuario.getPassword().equals(password)) {
            throw new IllegalArgumentException("Correo o contraseña incorrectos");
        }

        return usuario;
    }
}


