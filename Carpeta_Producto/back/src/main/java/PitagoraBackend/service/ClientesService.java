package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.model.Clientes;
import PitagoraBackend.repository.ClientesRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ClientesService {
    
    @Autowired
    private ClientesRepository clientesRepository;
    
    // CREATE - Crear un nuevo cliente
    public Clientes crearCliente(Clientes cliente) {
        cliente.setFecha_creacion(LocalDateTime.now());
        if (cliente.getEstado() == null) {
            cliente.setEstado(Clientes.EstadoEnum.ACTIVO);
        }
        return clientesRepository.save(cliente);
    }
    
    // READ - Obtener todos los clientes
    public List<Clientes> obtenerTodos() {
        return clientesRepository.findAll();
    }
    
    // READ - Obtener un cliente por ID
    public Optional<Clientes> obtenerPorId(Integer id) {
        return clientesRepository.findById(id);
    }
    
    // READ - Obtener cliente por RUT
    public Optional<Clientes> obtenerPorRut(String rut) {
        return clientesRepository.findByRut(rut);
    }
    
    // READ - Buscar clientes por nombre
    public List<Clientes> buscarPorNombre(String nombre) {
        return clientesRepository.findByNombreEmpresaContainingIgnoreCase(nombre);
    }
    
    // UPDATE - Actualizar un cliente
    public Clientes actualizarCliente(Integer id, Clientes clienteActualizado) {
        Optional<Clientes> clienteExistente = clientesRepository.findById(id);
        if (clienteExistente.isPresent()) {
            Clientes cliente = clienteExistente.get();
            
            if (clienteActualizado.getNombre_empresa() != null) {
                cliente.setNombre_empresa(clienteActualizado.getNombre_empresa());
            }
            if (clienteActualizado.getRut() != null) {
                cliente.setRut(clienteActualizado.getRut());
            }
            if (clienteActualizado.getCorreo_contacto() != null) {
                cliente.setCorreo_contacto(clienteActualizado.getCorreo_contacto());
            }
            if (clienteActualizado.getTelefono() != null) {
                cliente.setTelefono(clienteActualizado.getTelefono());
            }
            if (clienteActualizado.getDireccion() != null) {
                cliente.setDireccion(clienteActualizado.getDireccion());
            }
            if (clienteActualizado.getEstado() != null) {
                cliente.setEstado(clienteActualizado.getEstado());
            }
            
            return clientesRepository.save(cliente);
        }
        return null;
    }
    
    // DELETE - Eliminar un cliente
    public boolean eliminarCliente(Integer id) {
        if (clientesRepository.existsById(id)) {
            clientesRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
