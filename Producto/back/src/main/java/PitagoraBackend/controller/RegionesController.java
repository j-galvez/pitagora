package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.Regiones;
import PitagoraBackend.service.RegionesService;
import java.util.List;

@RestController
@RequestMapping("/api/regiones")
@CrossOrigin(origins = "*")
public class RegionesController {

    @Autowired
    private RegionesService regionesService;

    // GET - Listar todas las regiones
    @GetMapping
    public List<Regiones> listar() {
        return regionesService.obtenerRegiones();
    }

    // GET - Obtener región por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(regionesService.obtenerRegionById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

// Made with Bob
