package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.repository.ObrasRepository;
import PitagoraBackend.model.Obras;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ObrasService {

    @Autowired
    private ObrasRepository obrasRepository;

    // CREATE - Crear obra
    public Obras crearObras(Obras obras) {
        // Validación 1: id_cliente es requerido
        if (obras.getIdCliente() == null) {
            throw new IllegalArgumentException("El ID del cliente es requerido");
        }

        // Validación 2: nombre_obra es requerido
        if (obras.getNombreObra() == null || obras.getNombreObra().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la obra es requerido");
        }

        // Nota: Cuando implementes Clientes.java, valida que el cliente existe:
        // if (!clientesRepository.existsById(obras.getIdCliente())) {
        //     throw new IllegalArgumentException("El cliente no existe con ID: " + obras.getIdCliente());
        // }

        // Establecer valores por defecto
        if (obras.getEstadoObra() == null || obras.getEstadoObra().isEmpty()) {
            obras.setEstadoObra("Activa");
        }

        // Validar que el estado sea válido
        if (!obras.getEstadoObra().equals("Activa") &&
            !obras.getEstadoObra().equals("Garantía Vencida") &&
            !obras.getEstadoObra().equals("Cerrada")) {
            throw new IllegalArgumentException("Estado inválido. Debe ser: 'Activa', 'Garantía Vencida' o 'Cerrada'");
        }

        // La fecha_creacion se establece automáticamente por la BD
        if (obras.getFechaCreacion() == null) {
            obras.setFechaCreacion(LocalDateTime.now());
        }

        // Guardar la obra
        return obrasRepository.save(obras);
    }

    // READ - Obtener todas las obras
    public List<Obras> obtenerObras() {
        return obrasRepository.findAll();
    }

    // READ - Obtener obra por ID
    public Obras obtenerObraById(Integer id) {
        Optional<Obras> obra = obrasRepository.findById(id);
        if (!obra.isPresent()) {
            throw new IllegalArgumentException("Obra no encontrada con ID: " + id);
        }
        return obra.get();
    }

    // UPDATE - Actualizar obra
    public Obras actualizarObras(Integer id, Obras obrasActualizado) {
        // Verificar que la obra exista
        Obras obraExistente = obtenerObraById(id);

        // Actualizar campos si se proporcionan
        if (obrasActualizado.getNombreObra() != null && !obrasActualizado.getNombreObra().isEmpty()) {
            obraExistente.setNombreObra(obrasActualizado.getNombreObra());
        }

        if (obrasActualizado.getDescripcionObra() != null) {
            obraExistente.setDescripcionObra(obrasActualizado.getDescripcionObra());
        }

        if (obrasActualizado.getDireccion() != null) {
            obraExistente.setDireccion(obrasActualizado.getDireccion());
        }

        if (obrasActualizado.getPlanosPresupuestos() != null) {
            obraExistente.setPlanosPresupuestos(obrasActualizado.getPlanosPresupuestos());
        }

        if (obrasActualizado.getFechaEntrega() != null) {
            obraExistente.setFechaEntrega(obrasActualizado.getFechaEntrega());
        }

        if (obrasActualizado.getGarantiaExpira() != null) {
            obraExistente.setGarantiaExpira(obrasActualizado.getGarantiaExpira());
        }

        if (obrasActualizado.getEstadoObra() != null && !obrasActualizado.getEstadoObra().isEmpty()) {
            // Validar que el estado sea válido
            if (!obrasActualizado.getEstadoObra().equals("Activa") &&
                !obrasActualizado.getEstadoObra().equals("Garantía Vencida") &&
                !obrasActualizado.getEstadoObra().equals("Cerrada")) {
                throw new IllegalArgumentException("Estado inválido. Debe ser: 'Activa', 'Garantía Vencida' o 'Cerrada'");
            }
            obraExistente.setEstadoObra(obrasActualizado.getEstadoObra());
        }

        // Nota: id_cliente normalmente no debería cambiar después de crear la obra
        // Si necesitas cambiarlo, descomenta y valida:
        // if (obrasActualizado.getIdCliente() != null) {
        //     if (!clientesRepository.existsById(obrasActualizado.getIdCliente())) {
        //         throw new IllegalArgumentException("El cliente no existe");
        //     }
        //     obraExistente.setIdCliente(obrasActualizado.getIdCliente());
        // }

        return obrasRepository.save(obraExistente);
    }

    // DELETE - Eliminar obra
    public void eliminarObras(Integer id) {
        // Verificar que la obra exista
        if (!obrasRepository.existsById(id)) {
            throw new IllegalArgumentException("Obra no encontrada con ID: " + id);
        }

        // Nota: Al eliminar una obra, se eliminarán en cascada todos sus tickets y observaciones
        // según las FK definidas en la BD (ON DELETE CASCADE)
        obrasRepository.deleteById(id);
    }

    // MÉTODOS ADICIONALES ÚTILES

    // Obtener obras por cliente
    public List<Obras> obtenerObrasPorCliente(Integer idCliente) {
        // Necesitarás agregar este método en ObrasRepository:
        // List<Obras> findByIdCliente(Integer idCliente);
        // return obrasRepository.findByIdCliente(idCliente);
        throw new UnsupportedOperationException("Implementar método findByIdCliente en ObrasRepository");
    }

    // Obtener obras por estado
    public List<Obras> obtenerObrasPorEstado(String estado) {
        // Validar estado
        if (!estado.equals("Activa") && !estado.equals("Garantía Vencida") && !estado.equals("Cerrada")) {
            throw new IllegalArgumentException("Estado inválido");
        }
        // Necesitarás agregar este método en ObrasRepository:
        // List<Obras> findByEstadoObra(String estadoObra);
        // return obrasRepository.findByEstadoObra(estado);
        throw new UnsupportedOperationException("Implementar método findByEstadoObra en ObrasRepository");
    }
}
