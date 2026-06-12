-- Crear tabla para rastrear notificaciones enviadas
CREATE TABLE IF NOT EXISTS notificaciones_enviadas (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_observacion INT NOT NULL,
    destinatario VARCHAR(255) NOT NULL,
    asunto TEXT NOT NULL,
    cuerpo LONGTEXT,
    tipo_notificacion VARCHAR(50) NOT NULL,
    fecha_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_envio VARCHAR(50) NOT NULL DEFAULT 'enviado',
    
    INDEX idx_observacion (id_observacion),
    INDEX idx_fecha_envio (fecha_envio),
    FOREIGN KEY (id_observacion) REFERENCES observaciones(id_observacion) ON DELETE CASCADE
);

-- Crear índices adicionales para queries frecuentes
CREATE INDEX idx_notif_obs_fecha ON notificaciones_enviadas(id_observacion, fecha_envio ASC);
