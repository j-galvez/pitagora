package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.repository.TicketsRepository;
import PitagoraBackend.repository.UsuariosRepository;
import PitagoraBackend.repository.ObrasRepository;
import PitagoraBackend.model.Tickets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TicketsService {
    
    @Autowired
    private TicketsRepository ticketsRepository;
    
    @Autowired
    private UsuariosRepository usuariosRepository;
    
    @Autowired
    private ObrasRepository obrasRepository;

    // CREATE - Crear ticket (contenedor vacío para observaciones)
    public Tickets crearTickets(Tickets tickets) {
        // Validación 1: id_obra es requerido
        if (tickets.getIdObra() == null) {
            throw new IllegalArgumentException("El ID de obra es requerido");
        }
        
        // Validación 2: id_usuario_creador es requerido
        if (tickets.getIdUsuarioCreador() == null) {
            throw new IllegalArgumentException("El ID del usuario creador es requerido");
        }
        
        // Validación 3: Verificar que la obra existe
        if (!obrasRepository.existsById(tickets.getIdObra())) {
            throw new IllegalArgumentException("La obra no existe con ID: " + tickets.getIdObra());
        }
        
        // Validación 4: Verificar que el usuario creador existe
        if (!usuariosRepository.existsById(tickets.getIdUsuarioCreador())) {
            throw new IllegalArgumentException("El usuario creador no existe con ID: " + tickets.getIdUsuarioCreador());
        }
        
        // Establecer valores por defecto
        if (tickets.getEstadoGeneral() == null || tickets.getEstadoGeneral().isEmpty()) {
            tickets.setEstadoGeneral("abierto");
        }
        
        // Validar que el estado sea válido
        if (!tickets.getEstadoGeneral().equals("abierto") &&
            !tickets.getEstadoGeneral().equals("en proceso") &&
            !tickets.getEstadoGeneral().equals("terminado")) {
            throw new IllegalArgumentException("Estado inválido. Debe ser: 'abierto', 'en proceso' o 'terminado'");
        }
        
        // La fecha_creacion se establece automáticamente por la BD
        if (tickets.getFechaCreacion() == null) {
            tickets.setFechaCreacion(LocalDateTime.now());
        }
        
        // Guardar el ticket
        return ticketsRepository.save(tickets);
    }

    // READ - Obtener todos los tickets
    public List<Tickets> obtenerTickets() {
        return ticketsRepository.findAll();
    }

    // READ - Obtener ticket por ID
    public Tickets obtenerTicketById(Integer id) {
        Optional<Tickets> ticket = ticketsRepository.findById(id);
        if (!ticket.isPresent()) {
            throw new IllegalArgumentException("Ticket no encontrado con ID: " + id);
        }
        return ticket.get();
    }

    // UPDATE - Actualizar ticket (principalmente el estado)
    public Tickets actualizarTickets(Integer id, Tickets ticketsActualizado) {
        // Verificar que el ticket exista
        Tickets ticketExistente = obtenerTicketById(id);

        // Actualizar estado_general si se proporciona
        if (ticketsActualizado.getEstadoGeneral() != null && !ticketsActualizado.getEstadoGeneral().isEmpty()) {
            // Validar que el estado sea válido
            if (!ticketsActualizado.getEstadoGeneral().equals("abierto") &&
                !ticketsActualizado.getEstadoGeneral().equals("en proceso") &&
                !ticketsActualizado.getEstadoGeneral().equals("terminado")) {
                throw new IllegalArgumentException("Estado inválido. Debe ser: 'abierto', 'en proceso' o 'terminado'");
            }
            ticketExistente.setEstadoGeneral(ticketsActualizado.getEstadoGeneral());
        }

        // Nota: id_obra e id_usuario_creador NO deberían cambiar después de crear el ticket
        // Si necesitas cambiarlos, descomenta y valida:
        // if (ticketsActualizado.getIdObra() != null) {
        //     if (!obrasRepository.existsById(ticketsActualizado.getIdObra())) {
        //         throw new IllegalArgumentException("La obra no existe");
        //     }
        //     ticketExistente.setId_obra(ticketsActualizado.getIdObra());
        // }

        return ticketsRepository.save(ticketExistente);
    }

    // DELETE - Eliminar ticket
    public void eliminarTickets(Integer id) {
        // Verificar que el ticket exista
        if (!ticketsRepository.existsById(id)) {
            throw new IllegalArgumentException("Ticket no encontrado con ID: " + id);
        }
        
        // Nota: Al eliminar un ticket, se eliminarán en cascada todas sus observaciones
        // según la FK definida en la BD (ON DELETE CASCADE)
        ticketsRepository.deleteById(id);
    }

    // MÉTODOS ADICIONALES ÚTILES

    // Obtener tickets por obra
    public List<Tickets> obtenerTicketsPorObra(Integer idObra) {
        // Necesitarás agregar este método en TicketsRepository:
        // List<Tickets> findByIdObra(Integer idObra);
        // return ticketsRepository.findByIdObra(idObra);
        throw new UnsupportedOperationException("Implementar método findByIdObra en TicketsRepository");
    }

    // Obtener tickets por usuario creador
    public List<Tickets> obtenerTicketsPorUsuario(Integer idUsuario) {
        // Necesitarás agregar este método en TicketsRepository:
        // List<Tickets> findByIdUsuarioCreador(Integer idUsuarioCreador);
        // return ticketsRepository.findByIdUsuarioCreador(idUsuario);
        throw new UnsupportedOperationException("Implementar método findByIdUsuarioCreador en TicketsRepository");
    }

    // Obtener tickets por estado
    public List<Tickets> obtenerTicketsPorEstado(String estado) {
        // Validar estado
        if (!estado.equals("abierto") && !estado.equals("en proceso") && !estado.equals("terminado")) {
            throw new IllegalArgumentException("Estado inválido");
        }
        // Necesitarás agregar este método en TicketsRepository:
        // List<Tickets> findByEstadoGeneral(String estadoGeneral);
        // return ticketsRepository.findByEstadoGeneral(estado);
        throw new UnsupportedOperationException("Implementar método findByEstadoGeneral en TicketsRepository");
    }
}
