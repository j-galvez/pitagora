package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.Comunas;
import PitagoraBackend.service.ComunasService;
import java.util.List;

@RestController
@RequestMapping("/api/comunas")
@CrossOrigin(origins = "*")
public class ComunasController {

    @Autowired
    private ComunasService comunasService;

    // GET - Listar todas las comunas
    @GetMapping
    public List<Comunas> listar() {
        return comunasService.obtenerComunas();
    }

    // GET - Obtener comuna por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(comunasService.obtenerComunaById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET - Obtener comunas por región
    @GetMapping("/region/{idRegion}")
    public ResponseEntity<?> obtenerPorRegion(@PathVariable Integer idRegion) {
        try {
            List<Comunas> comunas = comunasService.obtenerComunasPorRegion(idRegion);
            return ResponseEntity.ok(comunas);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET - Buscar comunas por nombre
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorNombre(@RequestParam String nombre) {
        try {
            List<Comunas> comunas = comunasService.buscarComunasPorNombre(nombre);
            return ResponseEntity.ok(comunas);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

// Made with Bob
