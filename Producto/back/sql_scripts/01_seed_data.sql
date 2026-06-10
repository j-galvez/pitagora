-- Datos Iniciales para Constructora Pitágora

-- 1. Categorías del Frontend
INSERT INTO categorias (nombre_categoria) VALUES 
('terminaciones pisos'),
('terminaciones muros'),
('terminaciones cielos'),
('puertas y/o ventanas'),
('mobiliario'),
('cubierta'),
('sanitario'),
('electrico'),
('climatizacion'),
('otro');

-- 2. Usuarios de Prueba
INSERT INTO usuarios (nombre, correo, password, rol) VALUES 
('Administrador Pitágora', 'admin@pitagora.cl', 'pitagora2026', 'admin'),
('Juan Pérez', 'juan.perez@pitagora.cl', 'pitagora2026', 'usuario'),
('Constanza Soto', 'constanza.soto@pitagora.cl', 'pitagora2026', 'usuario');

-- 3. Obras de Prueba
INSERT INTO obras (nombre_obra, descripcion_obra, direccion, nombre_cliente_final, correo_cliente_final, fecha_entrega, garantia_expira) VALUES 
('Edificio Los Almendros', 'Departamento ubicado en tercer piso con vista al norte', 'Calle Las Lilas 123, Providencia', 'Juan Pérez (Propietario)', 'cliente.almendros@gmail.com', '2025-01-15', '2028-01-15'),
('Casa Los Robles', 'Casa de 120m² en condominio Los Robles', 'Avenida El Parque 456, Lo Barnechea', 'Inversiones Comarcio', 'contacto@comarcio.cl', '2026-03-10', '2029-03-10'),
('Edificio Vista Mar', 'Departamento en piso 8 con vista al mar', 'Avenida del Mar 789, Viña del Mar', 'Universidad Católica', 'postventa@uc.cl', '2026-04-01', '2029-04-01');

-- 4. Asignación de trabajadores a obras
INSERT INTO obras_usuarios (id_obra, id_usuario) VALUES 
(1, 2), -- Juan Pérez en Los Almendros
(2, 3), -- Constanza Soto en Los Robles
(3, 3); -- Constanza Soto en Vista Mar
