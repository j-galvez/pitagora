package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.Tickets;
import PitagoraBackend.service.TicketsService;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketsController {
    
    @Autowired
    private TicketsService ticketsService;

    // CREATE - Crear ticket (contenedor vacío para observaciones)
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Tickets ticket) {
        try {
            Tickets nuevo = ticketsService.crearTickets(ticket);
            return ResponseEntity.ok(nuevo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // READ - Listar todos los tickets
    @GetMapping
    public List<Tickets> listar() {
        return ticketsService.obtenerTickets();
    }

    // READ - Obtener ticket por ID
    @GetMapping("/{id_ticket}")
    public ResponseEntity<?> obtenerPorId(@PathVariable("id_ticket") Integer id_ticket) {
        try {
            return ResponseEntity.ok(ticketsService.obtenerTicketById(id_ticket));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UPDATE - Actualizar ticket (principalmente estado)
    @PutMapping("/{id_ticket}")
    public ResponseEntity<?> actualizar(@PathVariable("id_ticket") Integer id_ticket, @RequestBody Tickets ticket) {
        try {
            Tickets actualizado = ticketsService.actualizarTickets(id_ticket, ticket);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE - Eliminar ticket
    @DeleteMapping("/{id_ticket}")
    public ResponseEntity<?> eliminar(@PathVariable("id_ticket") Integer id_ticket) {
        try {
            ticketsService.eliminarTickets(id_ticket);
            return ResponseEntity.ok("Ticket eliminado correctamente");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
