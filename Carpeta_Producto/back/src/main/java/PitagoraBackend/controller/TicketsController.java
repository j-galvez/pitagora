package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.Tickets;
import PitagoraBackend.service.TicketsService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketsController {
    
    @Autowired
    private TicketsService ticketsService;
    
    // CREATE - Crear un nuevo ticket
    @PostMapping
    public ResponseEntity<?> crearTicket(@RequestBody Tickets ticket) {
        try {
            Tickets ticketCreado = ticketsService.crearTicket(ticket);
            return new ResponseEntity<>(ticketCreado, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear ticket: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // READ - Obtener todos los tickets
    @GetMapping
    public ResponseEntity<?> obtenerTodos() {
        try {
            List<Tickets> tickets = ticketsService.obtenerTodos();
            return new ResponseEntity<>(tickets, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener tickets: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener un ticket por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        try {
            Optional<Tickets> ticket = ticketsService.obtenerPorId(id);
            if (ticket.isPresent()) {
                return new ResponseEntity<>(ticket.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Ticket no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener ticket: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener todos los tickets de una obra
    @GetMapping("/obra/{idObra}")
    public ResponseEntity<?> obtenerTicketsPorObra(@PathVariable Integer idObra) {
        try {
            List<Tickets> tickets = ticketsService.obtenerTicketsPorObra(idObra);
            return new ResponseEntity<>(tickets, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener tickets de la obra: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener todos los tickets creados por un usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> obtenerTicketsPorUsuario(@PathVariable Integer idUsuario) {
        try {
            List<Tickets> tickets = ticketsService.obtenerTicketsPorUsuario(idUsuario);
            return new ResponseEntity<>(tickets, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener tickets del usuario: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // UPDATE - Actualizar un ticket
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarTicket(@PathVariable Integer id, @RequestBody Tickets ticketActualizado) {
        try {
            Tickets ticketUpdated = ticketsService.actualizarTicket(id, ticketActualizado);
            if (ticketUpdated != null) {
                return new ResponseEntity<>(ticketUpdated, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Ticket no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar ticket: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // DELETE - Eliminar un ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTicket(@PathVariable Integer id) {
        try {
            boolean eliminado = ticketsService.eliminarTicket(id);
            if (eliminado) {
                return new ResponseEntity<>("Ticket eliminado correctamente", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Ticket no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar ticket: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
