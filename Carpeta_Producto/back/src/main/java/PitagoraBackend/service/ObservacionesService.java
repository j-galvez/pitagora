package PitagoraBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import PitagoraBackend.repository.ObservacionesRepository;
import PitagoraBackend.repository.TicketsRepository;
import PitagoraBackend.model.Observaciones;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ObservacionesService {
    
    @Autowired
    private ObservacionesRepository observacionesRepository;
    
    @Autowired
    private TicketsRepository ticketsRepository;
    
    // Nota: Cuando implementes Categorias.java, agrega:
    // @Autowired
    // private CategoriasRepository categoriasRepository;

    // CREATE - Crear observación
    public Observaciones crearObservaciones(Observaciones observaciones) {
        // Validación 1: id_ticket es requerido
        if (observaciones.getIdTicket() == null) {
            throw new IllegalArgumentException("El ID del ticket es requerido");
        }
        
        // Validación 2: id_categoria es requerido
        if (observaciones.getIdCategoria() == null) {
            throw new IllegalArgumentException("El ID de la categoría es requerido");
        }
        
        // Validación 3: falla es requerida
        if (observaciones.getFalla() == null || observaciones.getFalla().isEmpty()) {
            throw new IllegalArgumentException("La falla es requerida");
        }
        
        // Validación 4: ubicacion_exacta es requerida
        if (observaciones.getUbicacionExacta() == null || observaciones.getUbicacionExacta().isEmpty()) {
            throw new IllegalArgumentException("La ubicación exacta es requerida");
        }
        
        // Validación 5: descripcion_problema es requerida
        if (observaciones.getDescripcionProblema() == null || observaciones.getDescripcionProblema().isEmpty()) {
            throw new IllegalArgumentException("La descripción del problema es requerida");
        }
        
        // Validación 6: Verificar que el ticket existe
        if (!ticketsRepository.existsById(observaciones.getIdTicket())) {
            throw new IllegalArgumentException("El ticket no existe con ID: " + observaciones.getIdTicket());
        }
        
        // Validación 7: Verificar que la categoría existe (cuando implementes Categorias.java)
        // if (!categoriasRepository.existsById(observaciones.getIdCategoria())) {
        //     throw new IllegalArgumentException("La categoría no existe con ID: " + observaciones.getIdCategoria());
        // }
        
        // Establecer valores por defecto
        if (observaciones.getUrgencia() == null || observaciones.getUrgencia().isEmpty()) {
            observaciones.setUrgencia("media");
        }
        
        if (observaciones.getEstadoObservacion() == null || observaciones.getEstadoObservacion().isEmpty()) {
            observaciones.setEstadoObservacion("pendiente");
        }
        
        if (observaciones.getConfirmacionCliente() == null || observaciones.getConfirmacionCliente().isEmpty()) {
            observaciones.setConfirmacionCliente("pendiente");
        }
        
        if (observaciones.getIntentosRecordatorio() == null) {
            observaciones.setIntentosRecordatorio(0);
        }
        
        // Generar token único para confirmación del cliente
        if (observaciones.getTokenAceptacion() == null || observaciones.getTokenAceptacion().isEmpty()) {
            observaciones.setTokenAceptacion(UUID.randomUUID().toString());
        }
        
        // Validar urgencia
        if (!observaciones.getUrgencia().equals("baja") && 
            !observaciones.getUrgencia().equals("media") && 
            !observaciones.getUrgencia().equals("alta")) {
            throw new IllegalArgumentException("Urgencia inválida. Debe ser: 'baja', 'media' o 'alta'");
        }
        
        // Validar estado_observacion
        if (!observaciones.getEstadoObservacion().equals("pendiente") && 
            !observaciones.getEstadoObservacion().equals("en observación") && 
            !observaciones.getEstadoObservacion().equals("aplica") && 
            !observaciones.getEstadoObservacion().equals("en proceso") && 
            !observaciones.getEstadoObservacion().equals("en espera aceptación") && 
            !observaciones.getEstadoObservacion().equals("terminado") && 
            !observaciones.getEstadoObservacion().equals("no aplica")) {
            throw new IllegalArgumentException("Estado de observación inválido");
        }
        
        // Validar confirmacion_cliente
        if (!observaciones.getConfirmacionCliente().equals("pendiente") && 
            !observaciones.getConfirmacionCliente().equals("aceptado") && 
            !observaciones.getConfirmacionCliente().equals("rechazado")) {
            throw new IllegalArgumentException("Confirmación del cliente inválida. Debe ser: 'pendiente', 'aceptado' o 'rechazado'");
        }
        
        // La fecha_registro se establece automáticamente
        if (observaciones.getFechaRegistro() == null) {
            observaciones.setFechaRegistro(LocalDateTime.now());
        }
        
        // Guardar la observación
        return observacionesRepository.save(observaciones);
    }

    // READ - Obtener todas las observaciones
    public List<Observaciones> obtenerObservaciones() {
        return observacionesRepository.findAll();
    }

    // READ - Obtener observación por ID
    public Observaciones obtenerObservacionById(Integer id) {
        Optional<Observaciones> observacion = observacionesRepository.findById(id);
        if (!observacion.isPresent()) {
            throw new IllegalArgumentException("Observación no encontrada con ID: " + id);
        }
        return observacion.get();
    }

    // UPDATE - Actualizar observación
    public Observaciones actualizarObservaciones(Integer id, Observaciones observacionesActualizado) {
        // Verificar que la observación exista
        Observaciones observacionExistente = obtenerObservacionById(id);

        // Actualizar campos si se proporcionan
        if (observacionesActualizado.getFalla() != null && !observacionesActualizado.getFalla().isEmpty()) {
            observacionExistente.setFalla(observacionesActualizado.getFalla());
        }

        if (observacionesActualizado.getUbicacionExacta() != null && !observacionesActualizado.getUbicacionExacta().isEmpty()) {
            observacionExistente.setUbicacionExacta(observacionesActualizado.getUbicacionExacta());
        }

        if (observacionesActualizado.getDescripcionProblema() != null && !observacionesActualizado.getDescripcionProblema().isEmpty()) {
            observacionExistente.setDescripcionProblema(observacionesActualizado.getDescripcionProblema());
        }

        if (observacionesActualizado.getUrgencia() != null && !observacionesActualizado.getUrgencia().isEmpty()) {
            if (!observacionesActualizado.getUrgencia().equals("baja") && 
                !observacionesActualizado.getUrgencia().equals("media") && 
                !observacionesActualizado.getUrgencia().equals("alta")) {
                throw new IllegalArgumentException("Urgencia inválida");
            }
            observacionExistente.setUrgencia(observacionesActualizado.getUrgencia());
        }

        if (observacionesActualizado.getEstadoObservacion() != null && !observacionesActualizado.getEstadoObservacion().isEmpty()) {
            if (!observacionesActualizado.getEstadoObservacion().equals("pendiente") && 
                !observacionesActualizado.getEstadoObservacion().equals("en observación") && 
                !observacionesActualizado.getEstadoObservacion().equals("aplica") && 
                !observacionesActualizado.getEstadoObservacion().equals("en proceso") && 
                !observacionesActualizado.getEstadoObservacion().equals("en espera aceptación") && 
                !observacionesActualizado.getEstadoObservacion().equals("terminado") && 
                !observacionesActualizado.getEstadoObservacion().equals("no aplica")) {
                throw new IllegalArgumentException("Estado de observación inválido");
            }
            observacionExistente.setEstadoObservacion(observacionesActualizado.getEstadoObservacion());
            
            // Si se marca como terminado, establecer fecha_termino
            if (observacionesActualizado.getEstadoObservacion().equals("terminado") && 
                observacionExistente.getFechaTermino() == null) {
                observacionExistente.setFechaTermino(LocalDateTime.now());
            }
        }

        if (observacionesActualizado.getConfirmacionCliente() != null && !observacionesActualizado.getConfirmacionCliente().isEmpty()) {
            if (!observacionesActualizado.getConfirmacionCliente().equals("pendiente") && 
                !observacionesActualizado.getConfirmacionCliente().equals("aceptado") && 
                !observacionesActualizado.getConfirmacionCliente().equals("rechazado")) {
                throw new IllegalArgumentException("Confirmación del cliente inválida");
            }
            observacionExistente.setConfirmacionCliente(observacionesActualizado.getConfirmacionCliente());
            
            // Si el cliente acepta o rechaza, establecer fecha_confirmacion
            if ((observacionesActualizado.getConfirmacionCliente().equals("aceptado") || 
                 observacionesActualizado.getConfirmacionCliente().equals("rechazado")) && 
                observacionExistente.getFechaConfirmacion() == null) {
                observacionExistente.setFechaConfirmacion(LocalDateTime.now());
            }
        }

        if (observacionesActualizado.getComentarioCliente() != null) {
            observacionExistente.setComentarioCliente(observacionesActualizado.getComentarioCliente());
        }

        if (observacionesActualizado.getIntentosRecordatorio() != null) {
            observacionExistente.setIntentosRecordatorio(observacionesActualizado.getIntentosRecordatorio());
        }

        return observacionesRepository.save(observacionExistente);
    }

    // DELETE - Eliminar observación
    public void eliminarObservaciones(Integer id) {
        // Verificar que la observación exista
        if (!observacionesRepository.existsById(id)) {
            throw new IllegalArgumentException("Observación no encontrada con ID: " + id);
        }
        
        observacionesRepository.deleteById(id);
    }

    // MÉTODOS ADICIONALES ÚTILES

    // Obtener observaciones por ticket
    public List<Observaciones> obtenerObservacionesPorTicket(Integer idTicket) {
        return observacionesRepository.findByIdTicket(idTicket);
    }

    // Obtener observaciones por categoría
    public List<Observaciones> obtenerObservacionesPorCategoria(Integer idCategoria) {
        return observacionesRepository.findByIdCategoria(idCategoria);
    }

    // Obtener observaciones por estado
    public List<Observaciones> obtenerObservacionesPorEstado(String estado) {
        return observacionesRepository.findByEstadoObservacion(estado);
    }

    // Obtener observaciones por urgencia
    public List<Observaciones> obtenerObservacionesPorUrgencia(String urgencia) {
        return observacionesRepository.findByUrgencia(urgencia);
    }

    // Obtener observaciones por confirmación del cliente
    public List<Observaciones> obtenerObservacionesPorConfirmacion(String confirmacion) {
        return observacionesRepository.findByConfirmacionCliente(confirmacion);
    }
}

