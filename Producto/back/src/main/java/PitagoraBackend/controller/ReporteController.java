package PitagoraBackend.controller;

import PitagoraBackend.dto.ReporteObraDTO;
import PitagoraBackend.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    @GetMapping("/trazabilidad-obras")
    public ResponseEntity<List<ReporteObraDTO>> getReporteTrazabilidad() {
        try {
            List<ReporteObraDTO> reporte = reporteService.getReporteTrazabilidad();
            return ResponseEntity.ok(reporte);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
