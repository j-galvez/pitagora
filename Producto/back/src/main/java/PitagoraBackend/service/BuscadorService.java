package PitagoraBackend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import PitagoraBackend.dto.SearchResultDTO;
import PitagoraBackend.model.Mensajes;
import PitagoraBackend.model.Observaciones;
import PitagoraBackend.model.Usuarios;
import PitagoraBackend.repository.MensajesRepository;
import PitagoraBackend.repository.ObservacionesRepository;
import PitagoraBackend.repository.UsuariosRepository;

@Service
public class BuscadorService {

    @Autowired
    private MensajesRepository mensajesRepository;

    @Autowired
    private ObservacionesRepository observacionesRepository;

    @Autowired
    private UsuariosRepository usuariosRepository;

    public List<SearchResultDTO> buscarGeneral(String query) {
        List<SearchResultDTO> resultados = new ArrayList<>();

        // 1. Buscar en Observaciones
        List<Observaciones> observaciones = observacionesRepository.searchObservaciones(query);
        resultados.addAll(observaciones.stream().map(o -> new SearchResultDTO(
            "Observación",
            o.getIdObservacion(),
            o.getFalla(),
            o.getDescripcionProblema(),
            o.getFechaRegistro()
        )).collect(Collectors.toList()));

        // 2. Buscar en Mensajes
        List<Mensajes> mensajes = mensajesRepository.searchMensajes(query);
        resultados.addAll(mensajes.stream().map(m -> {
            String autor = "Sistema";
            Usuarios u = usuariosRepository.findById(m.getIdUsuario()).orElse(null);
            if (u != null) {
                autor = u.getNombre() + " " + u.getApellidoPaterno();
            }
            return new SearchResultDTO(
                "Mensaje",
                m.getIdObservacion(),
                "Mensaje de " + autor,
                m.getMensaje(),
                m.getFechaEnvio()
            );
        }).collect(Collectors.toList()));

        // Ordenar por fecha descendente (lo más nuevo primero)
        resultados.sort((a, b) -> b.getFecha().compareTo(a.getFecha()));

        return resultados;
    }
}
