-- Script de Creación de Tablas - Sistema de Postventa Constructora Pitágora
-- Versión Mejorada con Correcciones según Análisis NotebookLM
-- Basado en Requerimientos de Francisco Castillo (Jefe de Postventa)
-- Motor: MySQL 8.0+
-- Fecha: Abril 2026

SET FOREIGN_KEY_CHECKS = 0;

-- 0. TABLAS MAESTRAS GEOGRÁFICAS
CREATE TABLE IF NOT EXISTS regiones (
    id_region INT PRIMARY KEY,
    nombre_region VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS comunas (
    id_comuna INT PRIMARY KEY,
    nombre_comuna VARCHAR(100) NOT NULL,
    id_region INT NOT NULL,
    FOREIGN KEY (id_region) REFERENCES regiones(id_region)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 1. Tabla de Clientes (Empresas - Nuevas)
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre_empresa VARCHAR(150) NOT NULL,
    rut VARCHAR(20) NOT NULL UNIQUE, -- Identificación legal única
    correo_contacto VARCHAR(100),
    telefono VARCHAR(20),
    direccion_calle VARCHAR(255),
    id_region INT,
    id_comuna INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    FOREIGN KEY (id_region) REFERENCES regiones(id_region),
    FOREIGN KEY (id_comuna) REFERENCES comunas(id_comuna)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Usuarios (Sistema Multi-perfil - Actualizada con RUN y Nombres Separados)
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    run VARCHAR(12) NOT NULL UNIQUE,          -- Ejemplo: 12.345.678-9
    nombre VARCHAR(50) NOT NULL,
    apellido_paterno VARCHAR(50) NOT NULL,
    apellido_materno VARCHAR(50),
    correo VARCHAR(100) NOT NULL UNIQUE,      -- Correo corporativo = nombre de usuario
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'jefe_obra', 'cliente', 'tecnico', 'usuario') NOT NULL DEFAULT 'cliente',
    id_obra INT NULL,                         -- Para perfiles "cliente": restricción a una única obra
    telefono VARCHAR(20),
    direccion_calle VARCHAR(255),
    id_region INT,
    id_comuna INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    FOREIGN KEY (id_obra) REFERENCES obras(id_obra) ON DELETE SET NULL,
    FOREIGN KEY (id_region) REFERENCES regiones(id_region),
    FOREIGN KEY (id_comuna) REFERENCES comunas(id_comuna)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla de Obras (Proyectos / Unidades - Dirección Normalizada)
CREATE TABLE IF NOT EXISTS obras (
    id_obra INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL, -- FK a la empresa cliente
    nombre_obra VARCHAR(150) NOT NULL,
    descripcion_obra TEXT, -- Ej: "Departamento ubicado en tercer piso..."
    direccion_calle VARCHAR(255),
    id_region INT NOT NULL,
    id_comuna INT NULL,       -- Opcional según región
    planos_presupuestos VARCHAR(500), -- URL a documentos en Cloud Storage
    fecha_entrega DATE,
    garantia_expira DATE, -- 3 años para terminaciones
    estado_obra ENUM('Activa', 'Garantía Vencida', 'Cerrada') DEFAULT 'Activa',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE RESTRICT,
    FOREIGN KEY (id_region) REFERENCES regiones(id_region),
    FOREIGN KEY (id_comuna) REFERENCES comunas(id_comuna)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Asignación de Usuarios (Trabajadores) a Obras (Relación N:M)
-- Nota: Mantiene la flexibilidad de asignar múltiples usuarios a una obra
CREATE TABLE IF NOT EXISTS obras_usuarios (
    id_obra INT,
    id_usuario INT,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_obra, id_usuario),
    FOREIGN KEY (id_obra) REFERENCES obras(id_obra) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabla de Categorías de Fallas (Maestros predefinidos)
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL, -- Ej: 'Instalaciones Sanitarias'
    subcategoria VARCHAR(100), -- Ej: dentro de terminaciones: 'cerámica', 'pintura'
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabla de Tickets (Contenedor Agrupador)
-- Nota: Un único ticket agrupa todos los problemas de una obra (no 50 tickets para 50 problemas)
CREATE TABLE IF NOT EXISTS tickets (
    id_ticket INT AUTO_INCREMENT PRIMARY KEY,
    id_obra INT NOT NULL,
    id_usuario_creador INT NOT NULL, -- Quien registra el ticket (Admin, Jefe Obra o Usuario)
    id_usuario INT NOT NULL,         -- El usuario al que pertenece el ticket (dueño de la unidad/cliente)
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_general ENUM('abierto', 'en proceso', 'terminado') DEFAULT 'abierto',
    FOREIGN KEY (id_obra) REFERENCES obras(id_obra) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_creador) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabla de Observaciones (La unidad atómica de trabajo - "Hojas del libro")
-- Esta es la tabla más importante: cada problema específico es una observación
CREATE TABLE IF NOT EXISTS observaciones (
    id_observacion INT AUTO_INCREMENT PRIMARY KEY,
    id_ticket INT NOT NULL,
    id_categoria INT NOT NULL,
    falla VARCHAR(200) NOT NULL, -- Título: "Grieta en muro"
    ubicacion_exacta VARCHAR(255) NOT NULL, -- Ej: "Baño N°4, Fachada Oriente"
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
    
    -- Flujo de Confirmación Digital del Cliente (vía Link)
    confirmacion_cliente ENUM('pendiente', 'aceptado', 'rechazado') DEFAULT 'pendiente',
    fecha_confirmacion TIMESTAMP NULL,
    comentario_cliente TEXT,
    token_aceptacion VARCHAR(100) UNIQUE, -- Token único para el link de confirmación seguro
    intentos_recordatorio INT DEFAULT 0, -- Máximo 4 semanales
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_termino TIMESTAMP NULL,
    FOREIGN KEY (id_ticket) REFERENCES tickets(id_ticket) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tabla de Evidencias (Fotos y Videos - Antes/Después)
CREATE TABLE IF NOT EXISTS evidencias (
    id_evidencia INT AUTO_INCREMENT PRIMARY KEY,
    id_observacion INT NOT NULL,
    url_archivo VARCHAR(500) NOT NULL, -- URL en Google Cloud Storage
    tipo_archivo ENUM('imagen', 'video') NOT NULL,
    momento ENUM('antes', 'despues') DEFAULT 'antes',
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_observacion) REFERENCES observaciones(id_observacion) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Tabla de Mensajes / Chat (Bitácora de comunicación por observación)
CREATE TABLE IF NOT EXISTS mensajes (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_observacion INT NOT NULL,
    id_usuario INT NOT NULL, -- Admin, Jefe Obra o Usuario de la constructora
    mensaje TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_observacion) REFERENCES observaciones(id_observacion) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 10. Tabla de Historial de Bitácora (CRÍTICA - Trazabilidad Legal e Inmutabilidad)
-- Esta tabla actúa como "Escudo Legal" para juicios o cobros de boletas de garantía
-- Registra cada acción, cambio de estado, correo enviado, etc. de forma inmutable
CREATE TABLE IF NOT EXISTS historial_bitacora (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    id_observacion INT NOT NULL,
    id_usuario INT NOT NULL, -- Autor de la acción
    sello_tiempo TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    accion VARCHAR(255) NOT NULL, -- Ej: "Cambio de estado a Terminado", "Correo automático enviado", "Creación de observación"
    detalles TEXT, -- Información adicional de la acción
    justificacion TEXT, -- Campo obligatorio si la observación pasó a estado "No Aplica"
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_observacion) REFERENCES observaciones(id_observacion) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    INDEX idx_observacion (id_observacion),
    INDEX idx_usuario (id_usuario),
    INDEX idx_sello_tiempo (sello_tiempo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- NOTAS IMPORTANTES SOBRE LOS CAMBIOS:
-- ============================================================================
-- 1. NUEVA TABLA: clientes
--    - Almacena las empresas clientes (Ej: UC, Komatsu, Comercio)
--    - RUT como identificador único legal
--    - Permite normalización y reportes por cliente
--
-- 2. MODIFICACIÓN: usuarios
--    - Nuevo campo id_obra (nullable) para restricción de acceso de clientes
--    - Nuevos roles: 'jefe_obra', 'tecnico' (además de admin y cliente)
--    - Correo único como nombre de usuario (per Francisco's requirements)
--
-- 3. MODIFICACIÓN: obras
--    - Nuevo FK a clientes (id_cliente) - relación 1:N
--    - Nuevo campo planos_presupuestos (URL a Cloud Storage)
--    - Eliminado nombre_cliente_final (ahora en tabla clientes)
--
-- 4. MODIFICACIÓN: categorias
--    - Nuevo campo subcategoria para clasificación más granular
--    - Ej: "Instalaciones Sanitarias" > "Tuberías", "Grifería"
--
-- 5. NUEVA TABLA: historial_bitacora (CRÍTICA)
--    - Registro inmutable de cada acción en el sistema
--    - Campo justificacion obligatorio para estados "No Aplica"
--    - Índices en observacion, usuario y sello_tiempo para queries rápidas
--    - Cumple con requerimiento legal de Francisco (escudo legal para litigios)
--    - Permite exportar a Excel/PDF como prueba ante entidades legales
--
-- 6. RELACIÓN JERÁRQUICA COMPLETA:
--    Clientes -> Obras -> Tickets -> Observaciones
--    Con trazabilidad completa vía historial_bitacora
--
-- ============================================================================
