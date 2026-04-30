package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.ObrasUsuarios;
import PitagoraBackend.model.ObrasUsuariosId;
import PitagoraBackend.service.ObrasUsuariosService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/obras-usuarios")
@CrossOrigin(origins = "*")
public class ObrasUsuariosController {
    
    @Autowired
    private ObrasUsuariosService obrasUsuariosService;
    
    // CREATE - Asignar un usuario a una obra
    @PostMapping
    public ResponseEntity<?> asignarUsuarioAObra(@RequestBody ObrasUsuarios asignacion) {
        try {
            ObrasUsuarios asignacionCreada = obrasUsuariosService.asignarUsuarioAObra(asignacion);
            return new ResponseEntity<>(asignacionCreada, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al asignar usuario: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // READ - Obtener todas las asignaciones
    @GetMapping
    public ResponseEntity<?> obtenerTodas() {
        try {
            List<ObrasUsuarios> asignaciones = obrasUsuariosService.obtenerTodas();
            return new ResponseEntity<>(asignaciones, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener asignaciones: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener usuarios de una obra
    @GetMapping("/obra/{idObra}")
    public ResponseEntity<?> obtenerUsuariosPorObra(@PathVariable Integer idObra) {
        try {
            List<ObrasUsuarios> asignaciones = obrasUsuariosService.obtenerUsuariosPorObra(idObra);
            return new ResponseEntity<>(asignaciones, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener asignaciones: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener obras de un usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> obtenerObrasPorUsuario(@PathVariable Integer idUsuario) {
        try {
            List<ObrasUsuarios> asignaciones = obrasUsuariosService.obtenerObrasPorUsuario(idUsuario);
            return new ResponseEntity<>(asignaciones, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener asignaciones: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // DELETE - Desasignar un usuario de una obra
    @DeleteMapping("/obra/{idObra}/usuario/{idUsuario}")
    public ResponseEntity<?> desasignarUsuarioDeObra(@PathVariable Integer idObra, @PathVariable Integer idUsuario) {
        try {
            boolean desasignado = obrasUsuariosService.desasignarUsuarioDeObra(idObra, idUsuario);
            if (desasignado) {
                return new ResponseEntity<>("Usuario desasignado correctamente", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Asignación no encontrada", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al desasignar usuario: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
