package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.repository.TicketsRepository;
import PitagoraBackend.repository.ObservacionesRepository;
import PitagoraBackend.repository.CategoriasRepository;
import PitagoraBackend.repository.ClientesRepository;
import PitagoraBackend.repository.ObrasRepository;
import PitagoraBackend.dto.DashboardStatsDTO;
import PitagoraBackend.dto.TopFallaDTO;
import PitagoraBackend.dto.ObraConIncidenciasDTO;
import PitagoraBackend.dto.ObraCostoDTO;
import PitagoraBackend.model.Categorias;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    
    @Autowired
    private TicketsRepository ticketsRepository;
    
    @Autowired
    private ObservacionesRepository observacionesRepository;
    
    @Autowired
    private CategoriasRepository categoriasRepository;

    @Autowired
    private ClientesRepository clientesRepository;

    @Autowired
    private ObrasRepository obrasRepository;
    
    /**
     * Obtiene las estadísticas generales del dashboard
     */
    public DashboardStatsDTO obtenerEstadisticas() {
        Long totalTickets = ticketsRepository.count();
        Long ticketsAbiertos = ticketsRepository.countTicketsAbiertos();
        Long observacionesAbiertas = observacionesRepository.countObservacionesAbiertas();
        Long observacionesTerminadas = observacionesRepository.countObservacionesTerminadas();
        Long observacionesAltaUrgencia = observacionesRepository.countObservacionesAltaUrgencia();
        Long clientesActivos = clientesRepository.countByEstado("Activo");
        Long obrasActivas = obrasRepository.countByEstadoObra("Activa");
        
        return new DashboardStatsDTO(
            totalTickets,
            ticketsAbiertos,
            observacionesAbiertas,
            observacionesTerminadas,
            observacionesAltaUrgencia,
            clientesActivos,
            obrasActivas
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

    /**
     * Obtiene el top 5 de obras con mayor costo acumulado
     */
    public List<ObraCostoDTO> obtenerTopObrasPorCosto() {
        return observacionesRepository.findObrasPorCosto()
            .stream()
            .filter(o -> o.getMontoTotal() != null && o.getMontoTotal() > 0)
            .limit(5)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtiene las obras asociadas a una categoría (drill-down)
     */
    public List<ObraConIncidenciasDTO> obtenerObrasPorCategoria(String nombreCategoria) {
        // Buscar la categoría por nombre
        List<Categorias> categorias = categoriasRepository.findByNombreCategoria(nombreCategoria);
        
        if (categorias.isEmpty()) {
            return List.of(); // Retorna lista vacía si no existe la categoría
        }
        
        Integer idCategoria = categorias.get(0).getIdCategoria();
        
        // Obtener obras asociadas a esta categoría
        return observacionesRepository.findObrasByCategoria(idCategoria);
    }
}

// Made with Bob