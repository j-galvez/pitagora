package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.Usuarios;
import PitagoraBackend.service.UsuariosService;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuariosController {

    @Autowired
    private UsuariosService usuariosService;

    @GetMapping
    public List<Usuarios> listar() {
        return usuariosService.obtenerUsuarios();
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Usuarios usuario) {
        try {
            Usuarios nuevo = usuariosService.crearUsuarios(usuario);
            return ResponseEntity.ok(nuevo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Cambiamos @PathVariable para que coincida con {id_usuario}
    @GetMapping("/{id_usuario}")
    public ResponseEntity<?> obtenerPorId(@PathVariable("id_usuario") Integer id_usuario) {
        try {
            return ResponseEntity.ok(usuariosService.obtenerUsuarioById(id_usuario));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id_usuario}")
    public ResponseEntity<?> actualizar(@PathVariable("id_usuario") Integer id_usuario, @RequestBody Usuarios usuario) {
        try {
            Usuarios actualizado = usuariosService.actualizarUsuarios(id_usuario, usuario);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id_usuario}")
    public ResponseEntity<?> eliminar(@PathVariable("id_usuario") Integer id_usuario) {
        try {
            usuariosService.eliminarUsuarios(id_usuario);
            return ResponseEntity.ok("Usuario eliminado correctamente");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}