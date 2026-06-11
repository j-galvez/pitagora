package PitagoraBackend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import PitagoraBackend.dto.CostoObservacionDTO;
import PitagoraBackend.model.CostosObservacion;
import PitagoraBackend.service.CostosObservacionService;

@RestController
@RequestMapping("/api/costos-observacion")
@CrossOrigin(origins = "*")
public class CostosObservacionController {

    @Autowired
    private CostosObservacionService costosObservacionService;

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody CostosObservacion costo) {
        try {
            CostoObservacionDTO creado = costosObservacionService.crearCosto(costo);
            return ResponseEntity.ok(creado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/observacion/{id_observacion}")
    public ResponseEntity<?> listarPorObservacion(@PathVariable("id_observacion") Integer idObservacion) {
        try {
            List<CostoObservacionDTO> costos = costosObservacionService.obtenerCostosPorObservacion(idObservacion);
            Long total = costosObservacionService.obtenerTotalPorObservacion(idObservacion);
            return ResponseEntity.ok(Map.of("costos", costos, "total", total));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id_costo}")
    public ResponseEntity<?> obtenerPorId(@PathVariable("id_costo") Integer idCosto) {
        try {
            return ResponseEntity.ok(costosObservacionService.obtenerCostoById(idCosto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id_costo}")
    public ResponseEntity<?> actualizar(
            @PathVariable("id_costo") Integer idCosto,
            @RequestBody CostosObservacion costo) {
        try {
            CostoObservacionDTO actualizado = costosObservacionService.actualizarCosto(idCosto, costo);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id_costo}")
    public ResponseEntity<?> eliminar(@PathVariable("id_costo") Integer idCosto) {
        try {
            costosObservacionService.eliminarCosto(idCosto);
            return ResponseEntity.ok("Costo eliminado correctamente");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
