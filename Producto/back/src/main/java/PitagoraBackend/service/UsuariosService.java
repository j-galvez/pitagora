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
        if (usuarios.getRun() == null || usuarios.getRun().isEmpty()) {
            throw new IllegalArgumentException("El RUN es requerido");
        }
        String runLimpio = usuarios.getRun().replaceAll("[^0-9kK]", "").toUpperCase();
        if (!runLimpio.matches("^[0-9]+[0-9K]$")) {
            throw new IllegalArgumentException("El RUN es inválido");
        }
        usuarios.setRun(runLimpio);

        if (usuarios.getNombre() == null || usuarios.getNombre().isEmpty()) {
            throw new IllegalArgumentException("El nombre es requerido");
        }

        if (usuarios.getApellidoPaterno() == null || usuarios.getApellidoPaterno().isEmpty()) {
            throw new IllegalArgumentException("El apellido paterno es requerido");
        }

        if (usuarios.getApellidoMaterno() == null || usuarios.getApellidoMaterno().isEmpty()) {
            throw new IllegalArgumentException("El apellido materno es requerido");
        }

        if (usuarios.getCorreo() == null || usuarios.getCorreo().isEmpty()) {
            throw new IllegalArgumentException("El correo es requerido");
        }
        if (!validarCorreo(usuarios.getCorreo())) {
            throw new IllegalArgumentException("El correo es inválido");
        }

        // Verificar que el correo no exista
        if (usuariosRepository.existsByCorreo(usuarios.getCorreo())) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        // Verificar que el RUN no exista
        if (usuariosRepository.existsByRun(usuarios.getRun())) {
            throw new IllegalArgumentException("El RUN ya está registrado");
        }

        if (usuarios.getPassword() == null || usuarios.getPassword().isEmpty()) {
            throw new IllegalArgumentException("La contraseña es requerida");
        }

        if (usuarios.getRol() == null || usuarios.getRol().isEmpty()) {
            throw new IllegalArgumentException("El rol es requerido");
        }
        if (!usuarios.getRol().equals("admin") && !usuarios.getRol().equals("usuario")) {
            throw new IllegalArgumentException("Rol inválido. Debe ser: 'admin' o 'usuario'");
        }

        if (usuarios.getRol().equals("usuario") && usuarios.getIdObra() == null) {
            throw new IllegalArgumentException("Para el rol usuario debe asignarse una obra");
        }

        if (usuarios.getTelefono() != null && !usuarios.getTelefono().isEmpty() && !validarTelefono(usuarios.getTelefono())) {
            throw new IllegalArgumentException("El teléfono debe tener exactamente 9 dígitos");
        }

        if (usuarios.getDireccionCalle() == null || usuarios.getDireccionCalle().isEmpty()) {
            throw new IllegalArgumentException("La calle es requerida");
        }

        if (usuarios.getIdRegion() == null) {
            throw new IllegalArgumentException("La región es requerida");
        }

        if (usuarios.getIdComuna() == null) {
            throw new IllegalArgumentException("La comuna es requerida");
        }

        if (usuarios.getEstado() == null || usuarios.getEstado().isEmpty()) {
            usuarios.setEstado("Activo");
        }

        // Establecer fecha de creación si no está definida
        if (usuarios.getFechaCreacion() == null) {
            usuarios.setFechaCreacion(java.time.LocalDateTime.now());
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
        if (usuariosActualizado.getRun() != null && !usuariosActualizado.getRun().isEmpty()) {
            String runLimpio = usuariosActualizado.getRun().replaceAll("[^0-9kK]", "").toUpperCase();
            if (!runLimpio.matches("^[0-9]+[0-9K]$")) {
                throw new IllegalArgumentException("El RUN es inválido");
            }
            if (!usuarioExistente.getRun().equals(runLimpio) && usuariosRepository.existsByRun(runLimpio)) {
                throw new IllegalArgumentException("El RUN ya está registrado");
            }
            usuarioExistente.setRun(runLimpio);
        }

        if (usuariosActualizado.getNombre() != null && !usuariosActualizado.getNombre().isEmpty()) {
            usuarioExistente.setNombre(usuariosActualizado.getNombre());
        }

        if (usuariosActualizado.getApellidoPaterno() != null && !usuariosActualizado.getApellidoPaterno().isEmpty()) {
            usuarioExistente.setApellidoPaterno(usuariosActualizado.getApellidoPaterno());
        }

        if (usuariosActualizado.getApellidoMaterno() != null && !usuariosActualizado.getApellidoMaterno().isEmpty()) {
            usuarioExistente.setApellidoMaterno(usuariosActualizado.getApellidoMaterno());
        }

        if (usuariosActualizado.getCorreo() != null && !usuariosActualizado.getCorreo().isEmpty()) {
            if (!usuarioExistente.getCorreo().equals(usuariosActualizado.getCorreo()) && 
                usuariosRepository.existsByCorreo(usuariosActualizado.getCorreo())) {
                throw new IllegalArgumentException("El correo ya está registrado");
            }
            if (!validarCorreo(usuariosActualizado.getCorreo())) {
                throw new IllegalArgumentException("El correo es inválido");
            }
            usuarioExistente.setCorreo(usuariosActualizado.getCorreo());
        }

        if (usuariosActualizado.getTelefono() != null && !usuariosActualizado.getTelefono().isEmpty()) {
            if (!validarTelefono(usuariosActualizado.getTelefono())) {
                throw new IllegalArgumentException("El teléfono debe tener exactamente 9 dígitos");
            }
            usuarioExistente.setTelefono(usuariosActualizado.getTelefono());
        }

        if (usuariosActualizado.getDireccionCalle() != null && !usuariosActualizado.getDireccionCalle().isEmpty()) {
            usuarioExistente.setDireccionCalle(usuariosActualizado.getDireccionCalle());
        }

        if (usuariosActualizado.getIdRegion() != null) {
            usuarioExistente.setIdRegion(usuariosActualizado.getIdRegion());
        }

        if (usuariosActualizado.getIdComuna() != null) {
            usuarioExistente.setIdComuna(usuariosActualizado.getIdComuna());
        }

        if (usuariosActualizado.getRol() != null && !usuariosActualizado.getRol().isEmpty()) {
            usuarioExistente.setRol(usuariosActualizado.getRol());
        }

        if (usuariosActualizado.getIdObra() != null) {
            usuarioExistente.setIdObra(usuariosActualizado.getIdObra());
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

    private boolean validarCorreo(String correo) {
        return correo != null && correo.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    }

    private boolean validarTelefono(String telefono) {
        return telefono != null && telefono.matches("^\\d{9}$");
    }
}


