package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.repository.TicketsRepository;
import PitagoraBackend.repository.ObservacionesRepository;
import PitagoraBackend.dto.DashboardStatsDTO;
import PitagoraBackend.dto.TopFallaDTO;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    
    @Autowired
    private TicketsRepository ticketsRepository;
    
    @Autowired
    private ObservacionesRepository observacionesRepository;
    
    /**
     * Obtiene las estadísticas generales del dashboard
     */
    public DashboardStatsDTO obtenerEstadisticas() {
        Long totalTickets = ticketsRepository.count();
        Long ticketsAbiertos = ticketsRepository.countTicketsAbiertos();
        Long observacionesAbiertas = observacionesRepository.countObservacionesAbiertas();
        Long observacionesAltaUrgencia = observacionesRepository.countObservacionesAltaUrgencia();
        
        return new DashboardStatsDTO(
            totalTickets,
            ticketsAbiertos,
            observacionesAbiertas,
            observacionesAltaUrgencia
        );
    }
    
    /**
     * Obtiene el top 5 de fallas más reportadas
     */
    public List<TopFallaDTO> obtenerTopFallas() {
        return observacionesRepository.findTop5Fallas()
            .stream()
            .limit(5)
            .collect(Collectors.toList());
    }
}

// Made with Bob