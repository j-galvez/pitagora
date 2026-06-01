package PitagoraBackend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import PitagoraBackend.dto.MensajeDTO;
import PitagoraBackend.model.Mensajes;
import PitagoraBackend.service.MensajesService;

@RestController
@RequestMapping("/api/mensajes")
@CrossOrigin(origins = "*")
public class MensajesController {

    @Autowired
    private MensajesService mensajesService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> crear(
            @RequestPart("mensaje") String mensajeJson,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Mensajes mensaje = objectMapper.readValue(mensajeJson, Mensajes.class);
            MensajeDTO creado = mensajesService.crearMensaje(mensaje, imagen);
            return ResponseEntity.ok(creado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al crear el mensaje: " + e.getMessage());
        }
    }

    @GetMapping
    public List<MensajeDTO> listar() {
        return mensajesService.obtenerMensajes();
    }

    @GetMapping("/{id_mensaje}")
    public ResponseEntity<?> obtenerPorId(@PathVariable("id_mensaje") Integer idMensaje) {
        try {
            return ResponseEntity.ok(mensajesService.obtenerMensajeById(idMensaje));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/observacion/{id_observacion}")
    public ResponseEntity<?> listarPorObservacion(@PathVariable("id_observacion") Integer idObservacion) {
        try {
            return ResponseEntity.ok(mensajesService.obtenerMensajesPorObservacion(idObservacion));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/usuario/{id_usuario}")
    public ResponseEntity<?> listarPorUsuario(@PathVariable("id_usuario") Integer idUsuario) {
        try {
            return ResponseEntity.ok(mensajesService.obtenerMensajesPorUsuario(idUsuario));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id_mensaje}")
    public ResponseEntity<?> eliminar(@PathVariable("id_mensaje") Integer idMensaje) {
        try {
            mensajesService.eliminarMensaje(idMensaje);
            return ResponseEntity.ok("Mensaje eliminado correctamente");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
