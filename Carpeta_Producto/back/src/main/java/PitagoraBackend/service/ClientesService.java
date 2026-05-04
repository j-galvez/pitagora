package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.repository.ClientesRepository;
import PitagoraBackend.model.Clientes;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ClientesService {
    
    @Autowired
    private ClientesRepository clientesRepository;

    // CREATE - Crear cliente
    public Clientes crearCliente(Clientes cliente) {
        // Validación: nombreEmpresa es requerido
        if (cliente.getNombreEmpresa() == null || cliente.getNombreEmpresa().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la empresa es requerido");
        }
        
        // Validación: RUT es requerido y único
        if (cliente.getRut() == null || cliente.getRut().isEmpty()) {
            throw new IllegalArgumentException("El RUT es requerido");
        }
        
        // Verificar que el RUT no exista
        if (clientesRepository.existsByRut(cliente.getRut())) {
            throw new IllegalArgumentException("Ya existe un cliente con el RUT: " + cliente.getRut());
        }
        
        // Establecer valores por defecto
        if (cliente.getEstado() == null || cliente.getEstado().isEmpty()) {
            cliente.setEstado("Activo");
        }
        
        // Validar estado
        if (!cliente.getEstado().equals("Activo") && !cliente.getEstado().equals("Inactivo")) {
            throw new IllegalArgumentException("Estado inválido. Debe ser: 'Activo' o 'Inactivo'");
        }
        
        // La fechaCreacion se establece automáticamente
        if (cliente.getFechaCreacion() == null) {
            cliente.setFechaCreacion(LocalDateTime.now());
        }
        
        // Guardar el cliente
        return clientesRepository.save(cliente);
    }

    // READ - Obtener todos los clientes
    public List<Clientes> obtenerClientes() {
        return clientesRepository.findAll();
    }

    // READ - Obtener cliente por ID
    public Clientes obtenerClienteById(Integer id) {
        Optional<Clientes> cliente = clientesRepository.findById(id);
        if (!cliente.isPresent()) {
            throw new IllegalArgumentException("Cliente no encontrado con ID: " + id);
        }
        return cliente.get();
    }

    // UPDATE - Actualizar cliente
    public Clientes actualizarCliente(Integer id, Clientes clienteActualizado) {
        // Verificar que el cliente exista
        Clientes clienteExistente = obtenerClienteById(id);

        // Actualizar campos si se proporcionan
        if (clienteActualizado.getNombreEmpresa() != null && !clienteActualizado.getNombreEmpresa().isEmpty()) {
            clienteExistente.setNombreEmpresa(clienteActualizado.getNombreEmpresa());
        }

        // Actualizar RUT solo si es diferente y no existe otro cliente con ese RUT
        if (clienteActualizado.getRut() != null && !clienteActualizado.getRut().isEmpty()) {
            if (!clienteActualizado.getRut().equals(clienteExistente.getRut())) {
                if (clientesRepository.existsByRut(clienteActualizado.getRut())) {
                    throw new IllegalArgumentException("Ya existe otro cliente con el RUT: " + clienteActualizado.getRut());
                }
                clienteExistente.setRut(clienteActualizado.getRut());
            }
        }

        if (clienteActualizado.getCorreoContacto() != null) {
            clienteExistente.setCorreoContacto(clienteActualizado.getCorreoContacto());
        }

        if (clienteActualizado.getTelefono() != null) {
            clienteExistente.setTelefono(clienteActualizado.getTelefono());
        }

        if (clienteActualizado.getDireccion() != null) {
            clienteExistente.setDireccion(clienteActualizado.getDireccion());
        }

        if (clienteActualizado.getEstado() != null && !clienteActualizado.getEstado().isEmpty()) {
            if (!clienteActualizado.getEstado().equals("Activo") && 
                !clienteActualizado.getEstado().equals("Inactivo")) {
                throw new IllegalArgumentException("Estado inválido. Debe ser: 'Activo' o 'Inactivo'");
            }
            clienteExistente.setEstado(clienteActualizado.getEstado());
        }

        return clientesRepository.save(clienteExistente);
    }

    // DELETE - Eliminar cliente
    public void eliminarCliente(Integer id) {
        // Verificar que el cliente exista
        if (!clientesRepository.existsById(id)) {
            throw new IllegalArgumentException("Cliente no encontrado con ID: " + id);
        }
        
        // Nota: Si hay obras asociadas a este cliente, la eliminación fallará
        // debido a la FK con ON DELETE RESTRICT en la BD
        clientesRepository.deleteById(id);
    }

    // MÉTODOS ADICIONALES ÚTILES

    // Obtener cliente por RUT
    public Clientes obtenerClientePorRut(String rut) {
        Optional<Clientes> cliente = clientesRepository.findByRut(rut);
        if (!cliente.isPresent()) {
            throw new IllegalArgumentException("Cliente no encontrado con RUT: " + rut);
        }
        return cliente.get();
    }

    // Buscar clientes por nombre de empresa
    public List<Clientes> buscarClientesPorNombre(String nombreEmpresa) {
        return clientesRepository.findByNombreEmpresaContainingIgnoreCase(nombreEmpresa);
    }

    // Obtener clientes por estado
    public List<Clientes> obtenerClientesPorEstado(String estado) {
        if (!estado.equals("Activo") && !estado.equals("Inactivo")) {
            throw new IllegalArgumentException("Estado inválido. Debe ser: 'Activo' o 'Inactivo'");
        }
        return clientesRepository.findByEstado(estado);
    }

    // Obtener solo clientes activos
    public List<Clientes> obtenerClientesActivos() {
        return clientesRepository.findByEstado("Activo");
    }
}

// Made with Bob
