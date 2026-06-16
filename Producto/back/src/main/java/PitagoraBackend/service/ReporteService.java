package PitagoraBackend.service;

import PitagoraBackend.dto.ObraCostoDTO;
import PitagoraBackend.dto.ReporteObraDTO;
import PitagoraBackend.dto.ReporteObraProjection;
import PitagoraBackend.repository.ObservacionesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReporteService {

    @Autowired
    private ObservacionesRepository observacionesRepository;

    public List<ReporteObraDTO> getReporteTrazabilidad() {
        List<ReporteObraProjection> projection = observacionesRepository.findReporteTrazabilidad();
        
        return projection.stream().map(p -> new ReporteObraDTO(
            p.getObra(),
            p.getCliente(),
            p.getResponsable(),
            p.getFechaRegistro(),
            p.getFechaResolucion(),
            p.getFallaDetectada(),
            p.getUbicacionExacta(),
            p.getEstadoActual(),
            p.getSolucionAplicada(),
            p.getCosto()
        )).collect(Collectors.toList());
    }

    public List<ObraCostoDTO> getCostosPorObra() {
        return observacionesRepository.findObrasPorCosto();
    }
}
