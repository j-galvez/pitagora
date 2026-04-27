-- Script de Creación de Tablas - Sistema de Postventa Constructora Pitágora
-- Adaptado para Frontend v2 (front) y Requerimientos de Cliente (Abril 2026)
-- Motor: MySQL 8.0+

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
    telefono VARCHAR(20),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Obras
CREATE TABLE IF NOT EXISTS obras (
    id_obra INT AUTO_INCREMENT PRIMARY KEY,
    nombre_obra VARCHAR(150) NOT NULL,
    descripcion_obra TEXT, -- "Departamento ubicado en tercer piso..."
    direccion TEXT,
    nombre_cliente_final VARCHAR(100), -- Nombre del cliente de la constructora (ej: Comarcio, UC)
    correo_cliente_final VARCHAR(100), -- Para enviar el link de aceptación
    fecha_entrega DATE,
    garantia_expira DATE, -- 3 años para terminaciones
    estado_obra ENUM('Activa', 'Garantía Vencida', 'Cerrada') DEFAULT 'Activa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Asignación de Usuarios (Trabajadores) a Obras
CREATE TABLE IF NOT EXISTS obras_usuarios (
    id_obra INT,
    id_usuario INT,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_obra, id_usuario),
    FOREIGN KEY (id_obra) REFERENCES obras(id_obra) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Tabla de Categorías
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL, -- 'sanitario', 'electrico', etc.
    descripcion TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabla de Tickets (El "Contenedor")
CREATE TABLE IF NOT EXISTS tickets (
    id_ticket INT AUTO_INCREMENT PRIMARY KEY,
    id_obra INT NOT NULL,
    id_usuario_creador INT NOT NULL, -- Quien registra el ticket (Admin o Usuario)
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_general ENUM('abierto', 'en proceso', 'terminado') DEFAULT 'abierto',
    FOREIGN KEY (id_obra) REFERENCES obras(id_obra),
    FOREIGN KEY (id_usuario_creador) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabla de Observaciones (Las "Ramas" o detalles individuales)
CREATE TABLE IF NOT EXISTS observaciones (
    id_observacion INT AUTO_INCREMENT PRIMARY KEY,
    id_ticket INT NOT NULL,
    id_categoria INT NOT NULL,
    falla VARCHAR(200) NOT NULL, -- Título: "Grieta en muro"
    ubicacion_exacta VARCHAR(255) NOT NULL, -- "Dormitorio principal"
    descripcion_problema TEXT NOT NULL,
    urgencia ENUM('baja', 'media', 'alta') DEFAULT 'media',
    estado_observacion ENUM(
        'pendiente', 
        'en observación', 
        'aplica', 
        'en proceso', 
        'en espera aceptación', 
        'terminado', 
        'no aplica'
    ) DEFAULT 'pendiente',
    
    -- Flujo de Confirmación del Cliente (vía Link)
    confirmacion_cliente ENUM('pendiente', 'aceptado', 'rechazado') DEFAULT 'pendiente',
    fecha_confirmacion TIMESTAMP NULL,
    comentario_cliente TEXT,
    token_aceptacion VARCHAR(100) UNIQUE, -- Token único para el link de confirmación
    intentos_recordatorio INT DEFAULT 0, -- Máximo 4 semanales
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_termino TIMESTAMP NULL,
    FOREIGN KEY (id_ticket) REFERENCES tickets(id_ticket) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabla de Evidencias (Fotos y Videos)
CREATE TABLE IF NOT EXISTS evidencias (
    id_evidencia INT AUTO_INCREMENT PRIMARY KEY,
    id_observacion INT NOT NULL,
    url_archivo VARCHAR(500) NOT NULL,
    tipo_archivo ENUM('imagen', 'video') NOT NULL,
    momento ENUM('antes', 'despues') DEFAULT 'antes',
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_observacion) REFERENCES observaciones(id_observacion) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Tabla de Mensajes / Bitácora (Chat por observación)
CREATE TABLE IF NOT EXISTS mensajes (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_observacion INT NOT NULL,
    id_usuario INT NOT NULL, -- Admin o Usuario de la constructora
    mensaje TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_observacion) REFERENCES observaciones(id_observacion) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
