package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import PitagoraBackend.dto.CorreoEntranteDetalleDTO;
import PitagoraBackend.dto.CorreoEntranteGrupoDTO;
import PitagoraBackend.service.CorreosEntrantesService;

import java.util.List;

@RestController
@RequestMapping("/api/correos-entrantes")
@CrossOrigin(origins = "*")
public class CorreosEntrantesController {

    @Autowired
    private CorreosEntrantesService correosEntrantesService;

    @GetMapping
    public ResponseEntity<?> listarGrupos(
            @RequestParam(value = "id_usuario", required = false) Integer idUsuario,
            @RequestParam(value = "rol", required = false) String rol) {
        try {
            List<CorreoEntranteGrupoDTO> grupos = correosEntrantesService.listarGrupos(idUsuario, rol);
            return ResponseEntity.ok(grupos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error obteniendo correos entrantes: " + e.getMessage());
        }
    }

    @GetMapping("/detalle")
    public ResponseEntity<?> listarDetalle(
            @RequestParam("asunto") String asuntoNormalizado,
            @RequestParam("correo") String correo,
            @RequestParam(value = "id_usuario", required = false) Integer idUsuario,
            @RequestParam(value = "rol", required = false) String rol) {
        try {
            List<CorreoEntranteDetalleDTO> detalle = correosEntrantesService.listarDetalleGrupo(
                    asuntoNormalizado, correo, idUsuario, rol);
            return ResponseEntity.ok(detalle);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error obteniendo detalle: " + e.getMessage());
        }
    }
}
