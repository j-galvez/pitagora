-- Script de Creación de Tablas - Sistema de Postventa Constructora Pitágora
-- Motor: MySQL 8.0+

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('Admin', 'Jefe Obra', 'Cliente') NOT NULL,
    telefono VARCHAR(20),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Obras (Unidad principal)
CREATE TABLE IF NOT EXISTS obras (
    id_obra INT AUTO_INCREMENT PRIMARY KEY,
    nombre_obra VARCHAR(150) NOT NULL,
    direccion TEXT,
    fecha_entrega DATE,
    garantia_expira DATE, -- Calculado según ley (3, 5 o 10 años)
    estado_obra ENUM('Activa', 'Garantía Vencida', 'Cerrada') DEFAULT 'Activa',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla de Relación Obra-Usuario (Asignación de clientes/jefes a obras)
CREATE TABLE IF NOT EXISTS obras_usuarios (
    id_obra INT,
    id_usuario INT,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_obra, id_usuario),
    FOREIGN KEY (id_obra) REFERENCES obras(id_obra) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Tabla de Categorías de Fallas
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabla de Tickets (Contenedor de solicitudes)
CREATE TABLE IF NOT EXISTS tickets (
    id_ticket INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL, -- Quien crea el ticket (Cliente o Admin)
    id_obra INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre TIMESTAMP NULL,
    estado_general ENUM('Activo', 'Cerrado', 'Inactivo') DEFAULT 'Activo',
    prioridad ENUM('Baja', 'Media', 'Alta', 'Urgente') DEFAULT 'Media',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_obra) REFERENCES obras(id_obra)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabla de Observaciones (Detalle individual de fallas dentro de un ticket)
CREATE TABLE IF NOT EXISTS observaciones (
    id_observacion INT AUTO_INCREMENT PRIMARY KEY,
    id_ticket INT NOT NULL,
    id_categoria INT NOT NULL,
    ubicacion_exacta TEXT NOT NULL, -- Ej: "Baño 3, piso 2"
    descripcion_problema TEXT NOT NULL,
    estado_observacion ENUM('Recibido', 'En proceso', 'Terminado', 'No aplica') DEFAULT 'Recibido',
    comentario_interno TEXT, -- Notas del admin o jefe de obra
    motivo_no_aplica TEXT, -- Si el estado es 'No aplica'
    id_empleado_asignado INT NULL, -- Jefe de obra responsable
    fecha_hallazgo DATE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_termino TIMESTAMP NULL,
    FOREIGN KEY (id_ticket) REFERENCES tickets(id_ticket) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    FOREIGN KEY (id_empleado_asignado) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabla de Evidencias (Fotos y Videos)
CREATE TABLE IF NOT EXISTS evidencias (
    id_evidencia INT AUTO_INCREMENT PRIMARY KEY,
    id_observacion INT NOT NULL,
    url_archivo VARCHAR(255) NOT NULL,
    tipo_archivo ENUM('Imagen', 'Video') NOT NULL,
    momento ENUM('Antes', 'Después') NOT NULL, -- Antes de la reparación o después
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_observacion) REFERENCES observaciones(id_observacion) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Tabla de Actas de Recepción / Confirmación Cliente
CREATE TABLE IF NOT EXISTS actas (
    id_acta INT AUTO_INCREMENT PRIMARY KEY,
    id_ticket INT NOT NULL,
    id_usuario INT NOT NULL, -- Cliente que confirma
    fecha_programada DATETIME NULL,
    fecha_confirmacion TIMESTAMP NULL,
    confirmacion_cliente ENUM('Pendiente', 'Sí', 'No') DEFAULT 'Pendiente',
    comentarios_cliente TEXT,
    estado_acta ENUM('Pendiente', 'Confirmada', 'Rechazada') DEFAULT 'Pendiente',
    token_confirmacion VARCHAR(100), -- Para el enlace de un solo clic
    FOREIGN KEY (id_ticket) REFERENCES tickets(id_ticket),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tabla de Recordatorios (Alertas semanales)
CREATE TABLE IF NOT EXISTS recordatorios (
    id_recordatorio INT AUTO_INCREMENT PRIMARY KEY,
    id_acta INT NOT NULL,
    fecha_programada DATETIME NOT NULL,
    intento INT DEFAULT 1, -- 1 a 4 según requerimiento
    enviado BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP NULL,
    FOREIGN KEY (id_acta) REFERENCES actas(id_acta) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Tabla de Comunicaciones (Bitácora de correos)
CREATE TABLE IF NOT EXISTS comunicaciones (
    id_comunicacion INT AUTO_INCREMENT PRIMARY KEY,
    id_ticket INT NOT NULL,
    tipo_comunicacion ENUM('Email', 'Sistema') DEFAULT 'Email',
    destinatario VARCHAR(100) NOT NULL,
    asunto VARCHAR(200),
    contenido TEXT,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_cliente VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (id_ticket) REFERENCES tickets(id_ticket)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Tabla de Mensajería (Chat en cascada por ticket)
CREATE TABLE IF NOT EXISTS mensajes (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_ticket INT NOT NULL,
    id_usuario INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leido BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_ticket) REFERENCES tickets(id_ticket) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
