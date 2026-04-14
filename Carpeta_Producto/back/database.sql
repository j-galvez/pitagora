CREATE DATABASE IF NOT EXISTS sistema_postventa_pitagora;
USE sistema_postventa_pitagora;

-- 1. Catálogo de Obras
CREATE TABLE obras (
    id_obra INT AUTO_INCREMENT PRIMARY KEY,
    nombre_obra VARCHAR(150) NOT NULL,
    estado_obra BOOLEAN DEFAULT TRUE 
);

-- 2. Catálogo de Categorías (Ex Especialidades)
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL,
    estado_categoria BOOLEAN DEFAULT TRUE
);

-- 3. Tabla de Usuarios (Ex Solicitantes, preparada para Firebase)
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE, -- ID que te entregará Firebase Auth
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    rol VARCHAR(50) DEFAULT 'Cliente', -- Ej: 'Admin', 'Jefe de Obra', 'Cliente'
    telefono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla Principal de Tickets (El "Contenedor")
CREATE TABLE tickets (
    id_ticket INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL, -- Quién abrió la solicitud
    id_obra INT NOT NULL,    -- En qué obra
    estado_general VARCHAR(50) DEFAULT 'Abierto', -- Se cerrará cuando todas las observaciones se cierren
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_obra) REFERENCES obras(id_obra)
);

-- 5. Tabla de Observaciones (Los problemas individuales dentro del ticket)
CREATE TABLE observaciones (
    id_observacion INT AUTO_INCREMENT PRIMARY KEY,
    id_ticket INT NOT NULL,
    id_categoria INT NOT NULL,
    ubicacion_exacta VARCHAR(255) NOT NULL,
    descripcion_problema TEXT NOT NULL,
    estado_observacion VARCHAR(50) DEFAULT 'Nuevo', -- 'Nuevo', 'En proceso', 'No aplica', 'Terminado'
    fecha_hallazgo DATETIME,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ticket) REFERENCES tickets(id_ticket) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

-- 6. Tabla para Evidencias (Fotos de Google Cloud Storage)
CREATE TABLE evidencias (
    id_evidencia INT AUTO_INCREMENT PRIMARY KEY,
    id_observacion INT NOT NULL, -- La foto va ligada a la falla específica, no al ticket general
    url_archivo VARCHAR(500) NOT NULL, -- 500 por si las URLs de Cloud Storage son largas
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_observacion) REFERENCES observaciones(id_observacion) ON DELETE CASCADE
);

