-- Tabla dedicada para correos capturados por webhook (aislada de mensajes de plataforma)
CREATE TABLE IF NOT EXISTS correos_entrantes (
    id_correo_entrante INT AUTO_INCREMENT PRIMARY KEY,
    id_ticket INT NOT NULL,
    id_usuario INT NOT NULL,
    asunto TEXT NOT NULL,
    asunto_normalizado VARCHAR(500) NOT NULL,
    cuerpo LONGTEXT,
    fecha_recepcion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_correos_entrantes_ticket
        FOREIGN KEY (id_ticket) REFERENCES tickets(id_ticket) ON DELETE CASCADE,
    CONSTRAINT fk_correos_entrantes_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    INDEX idx_correos_grupo (asunto_normalizado, id_usuario),
    INDEX idx_correos_ticket (id_ticket),
    INDEX idx_correos_fecha (fecha_recepcion DESC)
);
