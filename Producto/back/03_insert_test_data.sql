-- Script de Inserción de Datos de Prueba
-- Sistema de Postventa Constructora Pitágora
-- Ejecutar DESPUÉS de 02_create_tables_improved.sql

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- 1. INSERTAR CLIENTES (Empresas)
-- ============================================================================
INSERT INTO clientes (nombre_empresa, rut, correo_contacto, telefono, direccion, estado) VALUES
('Pontificia Universidad Católica', '8098974110', 'contacto@uc.cl', '+56225525000', 'Av. Libertador Bernardo O\'Higgins 340, Santiago', 'Activo'),
('Komatsu Chile S.A.', '7610001054', 'compras@komatsu.cl', '+56225812000', 'Av. Presidente Kennedy 5757, Las Condes', 'Activo'),
('Comercio S.A.', '9876543210', 'ventas@comercio.cl', '+56229981000', 'Avenida Providencia 1200, Providencia', 'Activo'),
('Constructora BIM Ingeniería', '1234567890', 'info@bim.cl', '+56227451234', 'Calle Los Laureles 450, Vitacura', 'Activo');

-- ============================================================================
-- 2. INSERTAR USUARIOS (Sistema Multi-perfil)
-- ============================================================================
INSERT INTO usuarios (nombre, correo, password, rol, id_obra, telefono, estado) VALUES
-- Admin
('Francisco Castillo', 'francisco.castillo@pitagora.cl', 'hashed_password_123', 'admin', NULL, '+56912345678', 'Activo'),

-- Jefes de Obra
('Juan Pérez', 'juan.perez@pitagora.cl', 'hashed_password_456', 'jefe_obra', NULL, '+56923456789', 'Activo'),
('María García', 'maria.garcia@pitagora.cl', 'hashed_password_789', 'jefe_obra', NULL, '+56934567890', 'Activo'),

-- Técnicos
('Carlos López', 'carlos.lopez@pitagora.cl', 'hashed_password_012', 'tecnico', NULL, '+56945678901', 'Activo'),
('Ana Martínez', 'ana.martinez@pitagora.cl', 'hashed_password_345', 'tecnico', NULL, '+56956789012', 'Activo'),

-- Clientes (Usuarios de empresas contratantes)
('Roberto Silva', 'roberto.silva@uc.cl', 'hashed_password_678', 'cliente', NULL, '+56967890123', 'Activo'),
('Patricia Jiménez', 'patricia.jimenez@komatsu.cl', 'hashed_password_901', 'cliente', NULL, '+56978901234', 'Activo');

-- ============================================================================
-- 3. INSERTAR OBRAS (Proyectos/Unidades)
-- ============================================================================
INSERT INTO obras (id_cliente, nombre_obra, descripcion_obra, direccion, planos_presupuestos, fecha_entrega, garantia_expira, estado_obra) VALUES
(1, 'Biblioteca Central UC - Piso 3', 'Remodelación de espacios de estudio, áreas comunes y baños', 'Av. Libertador Bernardo O\'Higgins 340, Santiago', 'https://storage.google.com/pitagora/uc-biblioteca-p3-planos.pdf', '2025-06-30', '2028-06-30', 'Activa'),
(1, 'Laboratorio de Computación - Edificio W', 'Instalación de sistemas de climatización y red de datos', 'Campus San Joaquín, Av. Vicuña Mackenna 4860, Santiago', 'https://storage.google.com/pitagora/uc-lab-comp-planos.pdf', '2025-07-15', '2028-07-15', 'Activa'),
(2, 'Oficinas Komatsu - Las Condes', 'Construcción de 5 pisos de oficinas con estacionamiento subterráneo', 'Av. Presidente Kennedy 5757, Las Condes', 'https://storage.google.com/pitagora/komatsu-oficinas-planos.pdf', '2025-08-30', '2028-08-30', 'Activa'),
(3, 'Local Comercial Centro - Providencia', 'Remodelación integral de local comercial de retail', 'Avenida Providencia 1200, Providencia', 'https://storage.google.com/pitagora/comercio-local-planos.pdf', '2025-05-20', '2028-05-20', 'Activa'),
(4, 'Vivienda Unifamiliar Vitacura', 'Casa de 3 pisos con piscina y quincho', 'Calle Los Laureles 450, Vitacura', 'https://storage.google.com/pitagora/bim-vivienda-planos.pdf', '2025-09-10', '2028-09-10', 'Activa');

-- ============================================================================
-- 4. INSERTAR ASIGNACIÓN USUARIOS A OBRAS (Relación N:M)
-- ============================================================================
INSERT INTO obras_usuarios (id_obra, id_usuario, fecha_asignacion) VALUES
-- Obra 1: UC Biblioteca
(1, 2, NOW()),  -- Juan Pérez (Jefe Obra)
(1, 4, NOW()),  -- Carlos López (Técnico)
(1, 6, NOW()),  -- Roberto Silva (Cliente UC)

-- Obra 2: UC Lab Computación
(2, 3, NOW()),  -- María García (Jefe Obra)
(2, 5, NOW()),  -- Ana Martínez (Técnico)
(2, 6, NOW()),  -- Roberto Silva (Cliente UC)

-- Obra 3: Komatsu Oficinas
(3, 2, NOW()),  -- Juan Pérez (Jefe Obra)
(3, 4, NOW()),  -- Carlos López (Técnico)
(3, 7, NOW()),  -- Patricia Jiménez (Cliente Komatsu)

-- Obra 4: Comercio Local
(4, 3, NOW()),  -- María García (Jefe Obra)
(4, 5, NOW()),  -- Ana Martínez (Técnico)

-- Obra 5: BIM Vivienda
(5, 2, NOW()),  -- Juan Pérez (Jefe Obra)
(5, 4, NOW());  -- Carlos López (Técnico)

-- ============================================================================
-- 5. INSERTAR CATEGORÍAS DE FALLAS
-- ============================================================================
INSERT INTO categorias (nombre_categoria, subcategoria, descripcion) VALUES
('Instalaciones Sanitarias', 'Tuberías', 'Problemas con tuberías de agua potable y desagüe'),
('Instalaciones Sanitarias', 'Grifería', 'Griferías defectuosas o con fugas'),
('Instalaciones Sanitarias', 'Sanitarios', 'Inodoros, bidés, lavamanos'),
('Instalaciones Eléctricas', 'Iluminación', 'Luminarias, focos, sistemas de iluminación'),
('Instalaciones Eléctricas', 'Enchufes', 'Tomas de corriente y enchufes de pared'),
('Instalaciones Eléctricas', 'Circuitos', 'Circuitos eléctricos y distribución de energía'),
('Terminaciones', 'Cerámica', 'Pisos y azulejos'),
('Terminaciones', 'Pintura', 'Pintura de muros y cielos'),
('Terminaciones', 'Carpintería', 'Puertas, ventanas y molduras'),
('Estructuras', 'Muros', 'Grietas, fisuras en muros'),
('Estructuras', 'Pisos', 'Problemas de nivelación y fisuras en pisos'),
('Estructuras', 'Techumbre', 'Problemas en cubiertas y techos'),
('Sistemas Especiales', 'Climatización', 'Aire acondicionado, calefacción'),
('Sistemas Especiales', 'Seguridad', 'Sistemas de seguridad, alarmas'),
('Sistemas Especiales', 'Red de Datos', 'Cableado estructurado y redes');

-- ============================================================================
-- 6. INSERTAR TICKETS (Contenedor Agrupador)
-- ============================================================================
INSERT INTO tickets (id_obra, id_usuario_creador, estado_general) VALUES
(1, 1, 'abierto'),      -- Ticket 1: UC Biblioteca
(2, 1, 'en proceso'),   -- Ticket 2: UC Lab Computación
(3, 2, 'abierto'),      -- Ticket 3: Komatsu Oficinas
(4, 3, 'abierto'),      -- Ticket 4: Comercio Local
(5, 2, 'terminado');    -- Ticket 5: BIM Vivienda

-- ============================================================================
-- 7. INSERTAR OBSERVACIONES (Unidad Atómica de Trabajo)
-- ============================================================================
INSERT INTO observaciones (
    id_ticket, id_categoria, falla, ubicacion_exacta, descripcion_problema, 
    urgencia, estado_observacion, confirmacion_cliente, token_aceptacion
) VALUES
-- Ticket 1: UC Biblioteca (abierto)
(1, 2, 'Fuga en grifo del baño', 'Baño N°3, Piso 3', 'Grifo de lavamanos gotea constantemente, desperdiciando agua', 'media', 'pendiente', 'pendiente', 'TOKEN_UC_LIB_001'),
(1, 7, 'Cerámica rota en piso', 'Área de lectura, esquina sureste', 'Dos azulejos rotos en el piso de cerámica color gris', 'baja', 'en observación', 'aceptado', 'TOKEN_UC_LIB_002'),
(1, 9, 'Puerta de oficina pegada', 'Oficina del bibliotecario', 'La puerta de madera se pega al abrir y cerrar', 'baja', 'en proceso', 'pendiente', 'TOKEN_UC_LIB_003'),

-- Ticket 2: UC Lab Computación (en proceso)
(2, 4, 'Luminarias defectuosas', 'Sala de computadores (rack norte)', '3 luminarias LED parpadean intermitentemente', 'alta', 'en proceso', 'aceptado', 'TOKEN_UC_LAB_001'),
(2, 6, 'Circuito sobrecargado', 'Sala de servidores', 'El circuito salta cada vez que se conectan todos los equipos', 'alta', 'en proceso', 'pendiente', 'TOKEN_UC_LAB_002'),
(2, 15, 'Cableado desordenado', 'Detrás del escritorio central', 'El cableado de red no está correctamente organizado', 'baja', 'en observación', 'pendiente', 'TOKEN_UC_LAB_003'),

-- Ticket 3: Komatsu Oficinas (abierto)
(3, 1, 'Fuga en tubería de agua', 'Sótano, zona de estacionamiento', 'Goteo en tubería principal de agua potable', 'alta', 'aplica', 'aceptado', 'TOKEN_KOM_OF_001'),
(3, 11, 'Piso desnivelado', 'Piso 2, oficina gerencial', 'El piso tiene desnivel de aproximadamente 2cm en la esquina', 'media', 'pendiente', 'rechazado', 'TOKEN_KOM_OF_002'),

-- Ticket 4: Comercio Local (abierto)
(4, 8, 'Pintura descascarada', 'Fachada exterior, muro norte', 'La pintura se está descascarando en gran área', 'media', 'pendiente', 'pendiente', 'TOKEN_COM_LOC_001'),
(4, 9, 'Ventana rota', 'Vitrina de exhibición lado izquierdo', 'Cristal roto en la ventana principal de exhibición', 'alta', 'en proceso', 'aceptado', 'TOKEN_COM_LOC_002'),

-- Ticket 5: BIM Vivienda (terminado)
(5, 10, 'Grieta en muro', 'Sala principal, muro oeste', 'Grieta vertical de aproximadamente 1cm de ancho', 'media', 'terminado', 'aceptado', 'TOKEN_BIM_VIV_001'),
(5, 13, 'Aire acondicionado no enfría', 'Dormitorio principal', 'El aire acondicionado encendido pero no baja la temperatura', 'alta', 'terminado', 'aceptado', 'TOKEN_BIM_VIV_002');

-- ============================================================================
-- 8. INSERTAR EVIDENCIAS (Fotos/Videos)
-- ============================================================================
INSERT INTO evidencias (id_observacion, url_archivo, tipo_archivo, momento) VALUES
-- Observación 1: Fuga en grifo
(1, 'https://storage.google.com/pitagora/grifo-goteo-antes.jpg', 'imagen', 'antes'),
(1, 'https://storage.google.com/pitagora/grifo-goteo-video.mp4', 'video', 'antes'),

-- Observación 2: Cerámica rota
(2, 'https://storage.google.com/pitagora/ceramica-rota-antes.jpg', 'imagen', 'antes'),
(2, 'https://storage.google.com/pitagora/ceramica-reparada-despues.jpg', 'imagen', 'despues'),

-- Observación 4: Luminarias defectuosas
(4, 'https://storage.google.com/pitagora/luminarias-oscuras.jpg', 'imagen', 'antes'),

-- Observación 7: Fuga en tubería
(7, 'https://storage.google.com/pitagora/tuberia-fuga-antes.jpg', 'imagen', 'antes'),
(7, 'https://storage.google.com/pitagora/tuberia-reparada-despues.jpg', 'imagen', 'despues');

-- ============================================================================
-- 9. INSERTAR MENSAJES (Chat/Bitácora)
-- ============================================================================
INSERT INTO mensajes (id_observacion, id_usuario, mensaje) VALUES
-- Observación 1
(1, 1, 'Se ha reportado fuga en el grifo del baño 3. Se requiere cambio de grifo.'),
(1, 4, 'He revisado el área. El grifo necesita ser reemplazado completamente.'),
(1, 1, 'Se ha programado la reparación para el próximo lunes.'),

-- Observación 4
(4, 3, 'Las luminarias LED están parpadando. Se debe revisar el circuito.'),
(4, 5, 'He cambiado las luminarias por nuevas. El problema persiste en una de ellas.'),
(4, 1, 'Se requiere verificar el circuito completo.'),

-- Observación 7
(7, 1, 'Se detectó fuga en tubería principal del sótano.'),
(7, 4, 'He revisado la tubería. Se requiere soldadura de la unión.'),
(7, 7, 'Autorizo proceder con la reparación.');

-- ============================================================================
-- 10. INSERTAR HISTORIAL BITÁCORA (Trazabilidad Legal)
-- ============================================================================
INSERT INTO historial_bitacora (id_observacion, id_usuario, accion, detalles, justificacion) VALUES
-- Observación 1
(1, 1, 'Creación de observación', 'Nueva observación creada por Francisco Castillo', NULL),
(1, 1, 'Cambio de estado', 'Estado cambiado de pendiente a pendiente (confirmación esperada)', NULL),
(1, 6, 'Confirmación del cliente', 'Observación aceptada por Roberto Silva (UC)', NULL),

-- Observación 2
(2, 1, 'Creación de observación', 'Nueva observación creada por Francisco Castillo', NULL),
(2, 4, 'Cambio de estado', 'Estado cambiado a en observación por Carlos López', NULL),
(2, 6, 'Confirmación del cliente', 'Observación aceptada por Roberto Silva (UC)', NULL),
(2, 4, 'Reparación completada', 'Cerámica reemplazada con nuevas piezas', NULL),
(2, 1, 'Cambio de estado', 'Estado cambiado a terminado', NULL),

-- Observación 4
(4, 1, 'Creación de observación', 'Nueva observación por Francisco Castillo', NULL),
(4, 5, 'Cambio de estado', 'Estado cambiado a en proceso por Ana Martínez', NULL),
(4, 6, 'Confirmación del cliente', 'Observación aceptada por Roberto Silva (UC)', NULL),
(4, 5, 'Reemplazo de luminarias', 'Se reemplazaron 3 luminarias LED por nuevas', NULL),

-- Observación 8 (Rechazada)
(8, 1, 'Creación de observación', 'Nueva observación por Francisco Castillo', NULL),
(8, 7, 'Rechazo de observación', 'Observación rechazada por Patricia Jiménez (Komatsu)', 'No aplica. La desnivelación es menor a lo permitido en norma técnica'),
(8, 1, 'Cambio de estado', 'Estado cambiado a no aplica', 'Cliente rechazó la reparación. Desnivelación dentro de tolerancia técnica'),

-- Observación 10 (Terminada)
(10, 1, 'Creación de observación', 'Nueva observación por Francisco Castillo', NULL),
(10, 4, 'Cambio de estado', 'Estado cambiado a en proceso por Carlos López', NULL),
(10, 4, 'Reparación completada', 'Grieta sellada con productos de calidad', NULL),
(10, 1, 'Cambio de estado', 'Estado cambiado a terminado', NULL),
(10, 1, 'Envío de confirmación', 'Email enviado al cliente para confirmación final', NULL);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- NOTAS SOBRE LOS DATOS:
-- ============================================================================
-- 1. Se insertaron 4 clientes con datos realistas (UC, Komatsu, Comercio, BIM)
-- 2. Se insertaron 7 usuarios con roles variados (admin, jefes, técnicos, clientes)
-- 3. Se insertaron 5 obras asociadas a los clientes
-- 4. Se insertaron 15 categorías de fallas con subcategorías específicas
-- 5. Se insertaron 5 tickets con diferentes estados (abierto, en proceso, terminado)
-- 6. Se insertaron 8 observaciones variadas con estados distintos
-- 7. Se insertaron evidencias (fotos/videos) para algunas observaciones
-- 8. Se insertaron mensajes para demostrar la comunicación
-- 9. Se insertaron registros de historial_bitacora con acciones inmutables
-- 
-- IMPORTANTE: Los passwords están hasheados (en producción usar bcrypt/argon2)
-- ============================================================================
