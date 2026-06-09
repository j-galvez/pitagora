package PitagoraBackend.service;

import PitagoraBackend.dto.ReporteObraDTO;
import PitagoraBackend.repository.ObservacionesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReporteService {

    @Autowired
    private ObservacionesRepository observacionesRepository;

    public List<ReporteObraDTO> getReporteTrazabilidad() {
        return observacionesRepository.findReporteTrazabilidad();
    }
}
