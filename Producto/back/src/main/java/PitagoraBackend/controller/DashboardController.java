package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.service.DashboardService;
import PitagoraBackend.dto.DashboardStatsDTO;
import PitagoraBackend.dto.TopFallaDTO;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * GET /api/dashboard/stats
     * Obtiene las estadísticas generales del dashboard
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> obtenerEstadisticas() {
        try {
            DashboardStatsDTO stats = dashboardService.obtenerEstadisticas();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * GET /api/dashboard/top-fallas
     * Obtiene el top 5 de fallas más reportadas
     */
    @GetMapping("/top-fallas")
    public ResponseEntity<List<TopFallaDTO>> obtenerTopFallas() {
        try {
            List<TopFallaDTO> topFallas = dashboardService.obtenerTopFallas();
            return ResponseEntity.ok(topFallas);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}

// Made with Bob