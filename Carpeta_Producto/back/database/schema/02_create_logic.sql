-- Script de Vistas y Procedimientos - Constructora Pitágora

-- 1. Vista de Dashboard Ejecutivo
CREATE OR REPLACE VIEW vista_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM tickets WHERE estado_general = 'Activo') as tickets_activos,
    (SELECT COUNT(*) FROM tickets WHERE estado_general = 'Cerrado') as tickets_cerrados,
    (SELECT COUNT(*) FROM observaciones WHERE estado_observacion = 'Recibido') as observaciones_nuevas,
    (SELECT COUNT(*) FROM observaciones WHERE estado_observacion = 'En proceso') as observaciones_en_ejecucion,
    (SELECT COUNT(*) FROM actas WHERE confirmacion_cliente = 'Pendiente') as actas_pendientes_cliente;

-- 2. Vista Detallada de Tickets para el Administrador
CREATE OR REPLACE VIEW vista_detalle_tickets AS
SELECT 
    t.id_ticket,
    o.nombre_obra,
    u.nombre as cliente,
    t.fecha_creacion,
    t.prioridad,
    t.estado_general,
    COUNT(obs.id_observacion) as total_observaciones,
    SUM(CASE WHEN obs.estado_observacion = 'Terminado' THEN 1 ELSE 0 END) as terminadas,
    ROUND((SUM(CASE WHEN obs.estado_observacion = 'Terminado' THEN 1 ELSE 0 END) / COUNT(obs.id_observacion)) * 100, 2) as porcentaje_avance
FROM tickets t
JOIN obras o ON t.id_obra = o.id_obra
JOIN usuarios u ON t.id_usuario = u.id_usuario
LEFT JOIN observaciones obs ON t.id_ticket = obs.id_ticket
GROUP BY t.id_ticket;

-- 3. Trigger para actualizar fecha_termino en observaciones
DELIMITER //
CREATE TRIGGER tr_observacion_terminada
BEFORE UPDATE ON observaciones
FOR EACH ROW
BEGIN
    IF NEW.estado_observacion = 'Terminado' AND OLD.estado_observacion <> 'Terminado' THEN
        SET NEW.fecha_termino = CURRENT_TIMESTAMP;
    END IF;
END //
DELIMITER ;

-- 4. Trigger para cerrar ticket automáticamente si todas las observaciones están terminadas o no aplican
DELIMITER //
CREATE TRIGGER tr_cerrar_ticket_auto
AFTER UPDATE ON observaciones
FOR EACH ROW
BEGIN
    DECLARE total INT;
    DECLARE finalizadas INT;
    
    SELECT COUNT(*) INTO total FROM observaciones WHERE id_ticket = NEW.id_ticket;
    SELECT COUNT(*) INTO finalizadas FROM observaciones 
    WHERE id_ticket = NEW.id_ticket AND (estado_observacion = 'Terminado' OR estado_observacion = 'No aplica');
    
    IF total = finalizadas AND total > 0 THEN
        UPDATE tickets SET estado_general = 'Cerrado', fecha_cierre = CURRENT_TIMESTAMP 
        WHERE id_ticket = NEW.id_ticket;
    ELSE
        UPDATE tickets SET estado_general = 'Activo', fecha_cierre = NULL 
        WHERE id_ticket = NEW.id_ticket;
    END IF;
END //
DELIMITER ;
