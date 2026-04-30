package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.model.Tickets;
import PitagoraBackend.repository.TicketsRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TicketsService {
    
    @Autowired
    private TicketsRepository ticketsRepository;
    
    // CREATE - Crear un nuevo ticket
    public Tickets crearTicket(Tickets ticket) {
        ticket.setFecha_creacion(LocalDateTime.now());
        ticket.setEstado_general(Tickets.EstadoTicketEnum.ABIERTO);
        return ticketsRepository.save(ticket);
    }
    
    // READ - Obtener todos los tickets
    public List<Tickets> obtenerTodos() {
        return ticketsRepository.findAll();
    }
    
    // READ - Obtener un ticket por ID
    public Optional<Tickets> obtenerPorId(Integer id) {
        return ticketsRepository.findById(id);
    }
    
    // READ - Obtener todos los tickets de una obra
    public List<Tickets> obtenerTicketsPorObra(Integer idObra) {
        return ticketsRepository.findByIdObra_IdObra(idObra);
    }
    
    // READ - Obtener todos los tickets creados por un usuario
    public List<Tickets> obtenerTicketsPorUsuario(Integer idUsuario) {
        return ticketsRepository.findByIdUsuarioCreador_IdUsuario(idUsuario);
    }
    
    // UPDATE - Actualizar un ticket
    public Tickets actualizarTicket(Integer id, Tickets ticketActualizado) {
        Optional<Tickets> ticketExistente = ticketsRepository.findById(id);
        if (ticketExistente.isPresent()) {
            Tickets ticket = ticketExistente.get();
            
            if (ticketActualizado.getEstado_general() != null) {
                ticket.setEstado_general(ticketActualizado.getEstado_general());
            }
            if (ticketActualizado.getId_obra() != null) {
                ticket.setId_obra(ticketActualizado.getId_obra());
            }
            if (ticketActualizado.getId_usuario_creador() != null) {
                ticket.setId_usuario_creador(ticketActualizado.getId_usuario_creador());
            }
            
            return ticketsRepository.save(ticket);
        }
        return null;
    }
    
    // DELETE - Eliminar un ticket
    public boolean eliminarTicket(Integer id) {
        if (ticketsRepository.existsById(id)) {
            ticketsRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
