package PitagoraBackend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.dto.CorreoEntranteDetalleDTO;
import PitagoraBackend.dto.CorreoEntranteGrupoDTO;
import PitagoraBackend.model.CorreosEntrantes;
import PitagoraBackend.model.Obras;
import PitagoraBackend.model.Tickets;
import PitagoraBackend.model.Usuarios;
import PitagoraBackend.repository.CorreosEntrantesRepository;
import PitagoraBackend.repository.ObrasRepository;
import PitagoraBackend.repository.TicketsRepository;
import PitagoraBackend.repository.UsuariosRepository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CorreosEntrantesService {

    @Autowired
    private CorreosEntrantesRepository correosEntrantesRepository;

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private TicketsRepository ticketsRepository;

    @Autowired
    private ObrasRepository obrasRepository;

    public List<CorreoEntranteGrupoDTO> listarGrupos(Integer idUsuario, String rol) {
        List<CorreosEntrantes> correos = correosEntrantesRepository.findAllByOrderByFechaRecepcionDesc();
        correos = filtrarPorRol(correos, idUsuario, rol);

        Map<String, List<CorreosEntrantes>> grupos = new HashMap<>();
        for (CorreosEntrantes c : correos) {
            String clave = claveGrupo(c);
            grupos.computeIfAbsent(clave, k -> new ArrayList<>()).add(c);
        }

        List<CorreoEntranteGrupoDTO> resultado = new ArrayList<>();
        for (List<CorreosEntrantes> grupo : grupos.values()) {
            CorreosEntrantes ultimo = grupo.stream()
                    .max(Comparator.comparing(CorreosEntrantes::getFechaRecepcion, Comparator.nullsLast(Comparator.naturalOrder())))
                    .orElse(grupo.get(0));
            CorreosEntrantes primero = grupo.get(0);

            CorreoEntranteGrupoDTO dto = new CorreoEntranteGrupoDTO();
            dto.setIdTicket(primero.getIdTicket());
            dto.setNombreObra(obtenerNombreObra(primero.getIdTicket()));
            dto.setCorreoRemitente(obtenerCorreoUsuario(primero.getIdUsuario()));
            dto.setCantidadCorreos(grupo.size());
            dto.setAsuntoNormalizado(primero.getAsuntoNormalizado());
            dto.setFechaUltimo(ultimo.getFechaRecepcion());
            resultado.add(dto);
        }

        resultado.sort(Comparator.comparing(CorreoEntranteGrupoDTO::getFechaUltimo,
                Comparator.nullsLast(Comparator.reverseOrder())));
        return resultado;
    }

    public List<CorreoEntranteDetalleDTO> listarDetalleGrupo(
            String asuntoNormalizado, String correo, Integer idUsuario, String rol) {
        if (asuntoNormalizado == null || asuntoNormalizado.isBlank() || correo == null || correo.isBlank()) {
            throw new IllegalArgumentException("Asunto y correo son requeridos");
        }

        Optional<Usuarios> remitenteOpt = usuariosRepository.findByCorreo(correo.trim().toLowerCase());
        if (remitenteOpt.isEmpty()) {
            throw new IllegalArgumentException("Remitente no encontrado: " + correo);
        }
        Integer idRemitente = remitenteOpt.get().getIdUsuario();

        List<CorreosEntrantes> correos = correosEntrantesRepository
                .findByAsuntoNormalizadoAndIdUsuarioOrderByFechaRecepcionAsc(
                        asuntoNormalizado.trim(), idRemitente);

        correos = filtrarPorRol(correos, idUsuario, rol);

        return correos.stream().map(this::toDetalleDTO).collect(Collectors.toList());
    }

    private List<CorreosEntrantes> filtrarPorRol(List<CorreosEntrantes> correos, Integer idUsuario, String rol) {
        if (rol == null || esAdmin(rol) || idUsuario == null) {
            return correos;
        }

        Optional<Usuarios> usuarioOpt = usuariosRepository.findById(idUsuario);
        if (usuarioOpt.isEmpty() || usuarioOpt.get().getIdObra() == null) {
            return List.of();
        }
        Integer idObra = usuarioOpt.get().getIdObra();

        return correos.stream()
                .filter(c -> ticketsRepository.findById(c.getIdTicket())
                        .map(Tickets::getIdObra)
                        .map(idObra::equals)
                        .orElse(false))
                .collect(Collectors.toList());
    }

    private boolean esAdmin(String rol) {
        if (rol == null) return false;
        String r = rol.trim().toLowerCase();
        return r.equals("admin") || r.equals("administrador") || r.equals("administrator");
    }

    private String claveGrupo(CorreosEntrantes c) {
        return (c.getAsuntoNormalizado() != null ? c.getAsuntoNormalizado() : "") + "|" + c.getIdUsuario();
    }

    private String obtenerCorreoUsuario(Integer idUsuario) {
        return usuariosRepository.findById(idUsuario)
                .map(Usuarios::getCorreo)
                .orElse("");
    }

    private String obtenerNombreObra(Integer idTicket) {
        if (idTicket == null) return "";
        return ticketsRepository.findById(idTicket)
                .flatMap(t -> obrasRepository.findById(t.getIdObra()))
                .map(Obras::getNombreObra)
                .orElse("");
    }

    private CorreoEntranteDetalleDTO toDetalleDTO(CorreosEntrantes c) {
        CorreoEntranteDetalleDTO dto = new CorreoEntranteDetalleDTO();
        dto.setIdMensaje(c.getIdCorreoEntrante());
        dto.setAsunto(c.getAsunto());
        dto.setMensaje(c.getCuerpo());
        dto.setFechaEnvio(c.getFechaRecepcion());
        dto.setIdTicket(c.getIdTicket());
        dto.setNombreObra(obtenerNombreObra(c.getIdTicket()));

        Optional<Usuarios> u = usuariosRepository.findById(c.getIdUsuario());
        u.ifPresent(usuario -> {
            dto.setCorreoRemitente(usuario.getCorreo());
            String nombre = (usuario.getNombre() != null ? usuario.getNombre() : "")
                    + " " + (usuario.getApellidoPaterno() != null ? usuario.getApellidoPaterno() : "");
            dto.setNombreRemitente(nombre.trim());
        });
        return dto;
    }
}
