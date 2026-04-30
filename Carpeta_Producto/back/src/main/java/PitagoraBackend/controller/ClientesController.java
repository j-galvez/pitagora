package PitagoraBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import PitagoraBackend.model.Clientes;
import PitagoraBackend.service.ClientesService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClientesController {
    
    @Autowired
    private ClientesService clientesService;
    
    // CREATE - Crear un nuevo cliente
    @PostMapping
    public ResponseEntity<?> crearCliente(@RequestBody Clientes cliente) {
        try {
            Clientes clienteCreado = clientesService.crearCliente(cliente);
            return new ResponseEntity<>(clienteCreado, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear cliente: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // READ - Obtener todos los clientes
    @GetMapping
    public ResponseEntity<?> obtenerTodos() {
        try {
            List<Clientes> clientes = clientesService.obtenerTodos();
            return new ResponseEntity<>(clientes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener clientes: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener un cliente por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        try {
            Optional<Clientes> cliente = clientesService.obtenerPorId(id);
            if (cliente.isPresent()) {
                return new ResponseEntity<>(cliente.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Cliente no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener cliente: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Obtener cliente por RUT
    @GetMapping("/rut/{rut}")
    public ResponseEntity<?> obtenerPorRut(@PathVariable String rut) {
        try {
            Optional<Clientes> cliente = clientesService.obtenerPorRut(rut);
            if (cliente.isPresent()) {
                return new ResponseEntity<>(cliente.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Cliente no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener cliente: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // READ - Buscar clientes por nombre
    @GetMapping("/buscar/{nombre}")
    public ResponseEntity<?> buscarPorNombre(@PathVariable String nombre) {
        try {
            List<Clientes> clientes = clientesService.buscarPorNombre(nombre);
            return new ResponseEntity<>(clientes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al buscar clientes: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // UPDATE - Actualizar un cliente
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCliente(@PathVariable Integer id, @RequestBody Clientes clienteActualizado) {
        try {
            Clientes clienteUpdated = clientesService.actualizarCliente(id, clienteActualizado);
            if (clienteUpdated != null) {
                return new ResponseEntity<>(clienteUpdated, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Cliente no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar cliente: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // DELETE - Eliminar un cliente
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCliente(@PathVariable Integer id) {
        try {
            boolean eliminado = clientesService.eliminarCliente(id);
            if (eliminado) {
                return new ResponseEntity<>("Cliente eliminado correctamente", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Cliente no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar cliente: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
