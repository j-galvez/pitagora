package PitagoraBackend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import PitagoraBackend.dto.EvidenciaDTO;
import PitagoraBackend.service.EvidenciasService;

@RestController
@RequestMapping("/api/evidencias")
@CrossOrigin(origins = "*")
public class EvidenciasController {

    @Autowired
    private EvidenciasService evidenciasService;

    @GetMapping("/observacion/{id_observacion}")
    public ResponseEntity<?> listarPorObservacion(@PathVariable("id_observacion") Integer idObservacion) {
        try {
            List<EvidenciaDTO> evidencias = evidenciasService.obtenerEvidenciasPorObservacion(idObservacion);
            return ResponseEntity.ok(evidencias);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
