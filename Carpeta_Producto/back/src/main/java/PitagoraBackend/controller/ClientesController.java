package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.Clientes;
import PitagoraBackend.service.ClientesService;
import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClientesController {

    @Autowired
    private ClientesService clientesService;

    // GET - Listar todos los clientes
    @GetMapping
    public List<Clientes> listar() {
        return clientesService.obtenerClientes();
    }

    // POST - Crear nuevo cliente
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Clientes cliente) {
        try {
            Clientes nuevo = clientesService.crearCliente(cliente);
            return ResponseEntity.ok(nuevo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET - Obtener cliente por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(clientesService.obtenerClienteById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT - Actualizar cliente
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Clientes cliente) {
        try {
            Clientes actualizado = clientesService.actualizarCliente(id, cliente);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE - Eliminar cliente
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            clientesService.eliminarCliente(id);
            return ResponseEntity.ok("Cliente eliminado correctamente");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET - Buscar cliente por RUT
    @GetMapping("/rut/{rut}")
    public ResponseEntity<?> obtenerPorRut(@PathVariable String rut) {
        try {
            return ResponseEntity.ok(clientesService.obtenerClientePorRut(rut));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET - Buscar clientes por nombre de empresa
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorNombre(@RequestParam String nombre) {
        try {
            List<Clientes> clientes = clientesService.buscarClientesPorNombre(nombre);
            return ResponseEntity.ok(clientes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET - Obtener clientes por estado
    @GetMapping("/estado/{estado}")
    public ResponseEntity<?> obtenerPorEstado(@PathVariable String estado) {
        try {
            List<Clientes> clientes = clientesService.obtenerClientesPorEstado(estado);
            return ResponseEntity.ok(clientes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET - Obtener solo clientes activos
    @GetMapping("/activos")
    public List<Clientes> obtenerActivos() {
        return clientesService.obtenerClientesActivos();
    }
}

// Made with Bob
