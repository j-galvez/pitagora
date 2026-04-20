-- Datos Iniciales para Constructora Pitágora
-- Motor: MySQL

-- 1. Usuarios Base (Pass: admin123 / client123 / jefe123 - Nota: Deben ser hasheadas con bcrypt en la app real)
INSERT INTO usuarios (nombre, correo, password, rol, telefono) VALUES
('Francisco Castillo', 'admin@pitagora.cl', '$2a$10$X7v5uSj.6b5hR/v9f.R9EeJ3uU.7tV9r6S2l3m4n5o6p7q8r9s0t1', 'Admin', '912345678'),
('Juan Pérez Cliente', 'juan.perez@komatsu.cl', '$2a$10$X7v5uSj.6b5hR/v9f.R9EeJ3uU.7tV9r6S2l3m4n5o6p7q8r9s0t1', 'Cliente', '987654321'),
('Ricardo Jefe Obra', 'rjefe@pitagora.cl', '$2a$10$X7v5uSj.6b5hR/v9f.R9EeJ3uU.7tV9r6S2l3m4n5o6p7q8r9s0t1', 'Jefe Obra', '955544433');

-- 2. Categorías solicitadas por Francisco
INSERT INTO categorias (nombre_categoria, descripcion) VALUES
('Instalaciones Sanitarias', 'Filtraciones, WC, sifones, llaves, red de agua potable/alcantarillado'),
('Instalaciones Eléctricas', 'Tableros, enchufes, iluminación, cortocircuitos'),
('Terminaciones - Cerámica', 'Pisos y muros de cerámica, porcelanato, fragüe'),
('Terminaciones - Pintura', 'Paredes, cielos, pintura exterior e interior'),
('Estructura', 'Muros de carga, vigas, lozas (Garantía 10 años)'),
('Climatización', 'Aire acondicionado, ventilación, calefacción'),
('Red de Incendio (PCI)', 'Alarmas, sensores de humo, mangueras'),
('Carpintería y Puertas', 'Marcos, cerraduras, ajustes de puertas y ventanas'),
('Otros', 'Cualquier otra especialidad no listada');

-- 3. Obras de ejemplo
INSERT INTO obras (nombre_obra, direccion, fecha_entrega, garantia_expira) VALUES
('Torre Komatsu Lampa', 'Sector Industrial Lampa 450', '2023-01-15', '2033-01-15'),
('Facultad Economía UC', 'Av. Vicuña Mackenna 4860, Macul', '2024-03-10', '2034-03-10'),
('Bodega Logística Quilicura', 'Americo Vespucio 1200', '2025-02-20', '2035-02-20');

-- 4. Asignación de Usuarios a Obras
INSERT INTO obras_usuarios (id_obra, id_usuario) VALUES
(1, 2), -- Juan Pérez asignado a Komatsu Lampa
(1, 3); -- Ricardo Jefe de Obra asignado a Komatsu Lampa

-- 5. Ticket y Observación inicial de prueba
INSERT INTO tickets (id_usuario, id_obra, prioridad) VALUES (2, 1, 'Urgente');

INSERT INTO observaciones (id_ticket, id_categoria, ubicacion_exacta, descripcion_problema, estado_observacion) VALUES
(1, 1, 'Baño Gerencia, Piso 1', 'Filtración masiva en sifón de lavamanos principal', 'Recibido'),
(1, 3, 'Hall de Acceso', 'Dos palmetas de porcelanato quebradas por tránsito pesado', 'Recibido');
