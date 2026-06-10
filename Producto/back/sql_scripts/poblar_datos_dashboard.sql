-- ============================================
-- SCRIPT PARA POBLAR BASE DE DATOS PITAGORA
-- Sistema de Postventa - Datos de Prueba
-- ============================================
-- Ejecutar en Cloud SQL Console
-- Base de datos: sistema_postventa_pitagora
-- ============================================

USE `sistema_postventa_pitagora`;

-- Comentario: Las categorías ya existen en la base de datos
-- Si deseas agregar más categorías, descomenta las siguientes líneas:
-- INSERT INTO `categorias` (`nombre_categoria`, `subcategoria`, `descripcion`, `fecha_creacion`) VALUES
-- ('Carpintería', 'Puertas', 'Problemas con puertas, marcos y cerraduras', NOW()),
-- ('Carpintería', 'Ventanas', 'Fallas en ventanas, correderas y sellos', NOW()),
-- etc...

-- ============================================
-- 2. AGREGAR MÁS CLIENTES (OPCIONAL)
-- ============================================
-- Los clientes 1-9 ya existen en la base de datos
-- Para agregar más clientes, descomenta las siguientes líneas y ajusta los campos requeridos:
-- INSERT INTO `clientes` (`nombre_empresa`, `rut`, `correo_contacto`, `telefono`, `direccion`, `id_comuna`, `codigo_postal`, `fecha_creacion`, `estado`) VALUES
-- ('Inmobiliaria Vista Hermosa', '77.234.567-8', 'contacto@vistahermosa.cl', '+56922223333', 'Av. Providencia 2500, Santiago', 13, 7500000, NOW(), 'Activo'),
-- ('Constructora Del Sur', '78.345.678-9', 'proyectos@delsur.cl', '+56933334444', 'Av. Libertador Bernardo O\'Higgins 1234', 13, 8300000, NOW(), 'Activo');

-- ============================================
-- 3. AGREGAR MÁS OBRAS (OPCIONAL)
-- ============================================
-- Las obras 1-5 ya existen en la base de datos
-- Para agregar más obras, descomenta las siguientes líneas y ajusta los campos requeridos:
-- INSERT INTO `obras` (`id_cliente`, `nombre_obra`, `descripcion_obra`, `direccion`, `id_region`, `id_comuna`, `planos_presupuestos`, `fecha_inicio`, `fecha_termino`, `estado_obra`, `fecha_creacion`) VALUES
-- (1, 'Condominio Las Palmas', 'Condominio de 30 casas', 'Camino Las Palmas 2000, Peñalolén', 13, 13122, 'https://storage.pitagora.cl/planos/las_palmas.pdf', '2026-05-01', '2028-05-01', 'Activa', NOW()),
-- (2, 'Torre Mirador', 'Edificio de 20 pisos con vista al mar', 'Av. Borgoño 15000, Viña del Mar', 6, 5109, 'https://storage.pitagora.cl/planos/torre_mirador.pdf', '2026-01-15', '2029-01-15', 'Activa', NOW());

-- ============================================
-- 4. AGREGAR MÁS USUARIOS
-- ============================================
-- Los usuarios 1-6 ya existen en la base de datos
-- Agregando usuarios adicionales para pruebas del dashboard
INSERT INTO `usuarios` (`nombre`, `correo`, `password`, `rol`, `id_obra`, `telefono`, `fecha_creacion`, `estado`) VALUES
-- Administradores adicionales
('María González', 'mgonzalez@pitagora.cl', 'admin123', 'admin', NULL, '+56977778888', NOW(), 'Activo'),
('Carlos Ramírez', 'cramirez@pitagora.cl', 'admin123', 'admin', NULL, '+56966669999', NOW(), 'Activo'),

-- Jefes de Obra
('Pedro Soto', 'psoto@pitagora.cl', 'obra2026', 'jefe_obra', 1, '+56955551111', NOW(), 'Activo'),
('Ana Martínez', 'amartinez@pitagora.cl', 'obra2026', 'jefe_obra', 2, '+56944442222', NOW(), 'Activo'),
('Luis Fernández', 'lfernandez@pitagora.cl', 'obra2026', 'jefe_obra', 3, '+56933333333', NOW(), 'Activo'),

-- Técnicos
('Jorge Electricista', 'jelectricista@pitagora.cl', 'tec2026', 'tecnico', NULL, '+56922224444', NOW(), 'Activo'),
('Carmen Gasfiter', 'cgasfiter@pitagora.cl', 'tec2026', 'tecnico', NULL, '+56911115555', NOW(), 'Activo'),
('Diego Pintor', 'dpintor@pitagora.cl', 'tec2026', 'tecnico', NULL, '+56900006666', NOW(), 'Activo'),
('Patricia Carpintera', 'pcarpintera@pitagora.cl', 'tec2026', 'tecnico', NULL, '+56988887777', NOW(), 'Activo'),

-- Clientes (se usan los clientes existentes)
('Cliente Vista Mirador', 'cliente@vistahermosa.cl', 'cli2026', 'cliente', 1, '+56977771111', NOW(), 'Activo'),
('Cliente Altamar', 'cliente@altamar.cl', 'cli2026', 'cliente', 2, '+56966662222', NOW(), 'Activo'),
('Cliente Biobío', 'cliente@biobio.cl', 'cli2026', 'cliente', 3, '+56955553333', NOW(), 'Activo'),
('Cliente Medicina Vet', 'cliente@uc.cl', 'cli2026', 'cliente', 4, '+56944444444', NOW(), 'Activo'),
('Cliente LALA', 'cliente@lala.cl', 'cli2026', 'cliente', 5, '+56933335555', NOW(), 'Activo');

-- ============================================
-- 5. AGREGAR TICKETS
-- ============================================
-- Usando solo obras existentes (1-5) y usuarios válidos
INSERT INTO `tickets` (`id_obra`, `id_usuario_creador`, `fecha_creacion`, `estado_general`) VALUES
-- Obra 1: Edificio Mirador
(1, 4, '2026-05-05 10:30:00', 'en proceso'),
(1, 4, '2026-05-06 14:20:00', 'en proceso'),
(1, 4, '2026-05-07 09:15:00', 'terminado'),

-- Obra 2: Condominio Altamar
(2, 4, '2026-05-03 11:00:00', 'abierto'),
(2, 4, '2026-05-04 15:30:00', 'en proceso'),
(2, 4, '2026-05-05 08:45:00', 'en proceso'),

-- Obra 3: Centro Logístico Biobío
(3, 9, '2026-05-02 09:00:00', 'abierto'),
(3, 9, '2026-05-03 13:30:00', 'en proceso'),
(3, 9, '2026-05-04 11:15:00', 'en proceso'),

-- Obra 4: Facultad de Medicina Veterinaria
(4, 10, '2026-05-01 10:00:00', 'abierto'),
(4, 10, '2026-05-02 14:30:00', 'en proceso'),
(4, 10, '2026-05-03 09:20:00', 'terminado'),

-- Obra 5: Supermercado LALA
(5, 10, '2026-05-03 08:30:00', 'abierto'),
(5, 10, '2026-05-04 12:00:00', 'en proceso'),
(5, 10, '2026-05-05 15:30:00', 'terminado');

-- ============================================
-- 6. AGREGAR OBSERVACIONES
-- ============================================
INSERT INTO `observaciones` (`id_obra`, `id_categoria`, `falla`, `ubicacion_exacta`, `descripcion_problema`, `urgencia`, `estado_observacion`, `confirmacion_cliente`, `token_aceptacion`, `id_usuario`, `visitas_efectuadas`, `fecha_creacion`) VALUES
-- Obra 1: Edificio Mirador (categoría 1 = Grifería)
(1, 1, 'Llave gotea', 'Depto 402, baño principal', 'Llave de agua caliente gotea constantemente', 'alta', 'en proceso', 'pendiente', 'TK-774411', 12, 1, NOW()),
(1, 2, 'Muro con humedad', 'Living principal', 'Se observan manchas de humedad en el muro norte', 'baja', 'pendiente', 'pendiente', 'TK-774422', NULL, 0, NOW()),

-- Obra 2: Condominio Altamar (categoría 4 = Cerámica)
(2, 4, 'Cerámica suelta', 'Terraza principal', 'Cerámicas suenan huecas en el sector de la baranda', 'media', 'pendiente', 'pendiente', 'TK-885500', NULL, 0, NOW()),
(2, 1, 'Llave del lavaplatos', 'Cocina', 'Gotea agua constantemente en el flexible', 'media', 'en proceso', 'pendiente', 'TK-885501', 13, 1, NOW()),

-- Obra 3: Centro Logístico Biobío (categoría 5 = Iluminación)
(3, 5, 'Luminarias no encienden', 'Bodega A, sector norte', 'Varias luminarias del sector norte no funcionan', 'alta', 'pendiente', 'pendiente', 'TK-995500', NULL, 0, NOW()),
(3, 1, 'Válvula de paso con fuga', 'Baño empleados', 'La válvula de paso tiene fuga de agua', 'alta', 'en proceso', 'pendiente', 'TK-995501', 12, 2, NOW()),

-- Obra 4: Facultad de Medicina Veterinaria (categoría 2 = Filtración)
(4, 2, 'Filtración en techo', 'Laboratorio 201', 'Filtraciones de agua durante lluvia en el techo', 'alta', 'en proceso', 'pendiente', 'TK-778800', 9, 3, NOW()),
(4, 3, 'Pintura descascarada', 'Pasillo principal', 'Pintura del pasillo está descascarada', 'baja', 'pendiente', 'pendiente', 'TK-778801', NULL, 0, NOW()),

-- Obra 5: Supermercado LALA (categoría 5 = Iluminación)
(5, 5, 'Foco LED quemado', 'Zona de cajas', 'Foco LED de la zona de cajas está quemado', 'media', 'terminado', 'aceptado', 'TK-669900', 14, 1, NOW()),
(5, 4, 'Fragüe desprendido', 'Piso interior', 'Fragüe entre cerámicas se está desprendiendo', 'media', 'en proceso', 'pendiente', 'TK-669901', 13, 2, NOW());

-- ============================================
-- 7. AGREGAR EVIDENCIAS
-- ============================================
-- Las evidencias ya existen en la base de datos
-- Para agregar más evidencias vinculadas a las nuevas observaciones:
INSERT INTO `evidencias` (`id_observacion`, `url_archivo`, `tipo_archivo`, `momento`, `fecha_creacion`) VALUES
(5, 'https://storage.googleapis.com/pitagora/evidencias/llave_baño_402.jpg', 'imagen', 'antes', NOW()),
(5, 'https://storage.googleapis.com/pitagora/evidencias/llave_baño_402_reparado.jpg', 'imagen', 'despues', NOW()),
(6, 'https://storage.googleapis.com/pitagora/evidencias/muro_humedad.jpg', 'imagen', 'antes', NOW()),
(7, 'https://storage.googleapis.com/pitagora/evidencias/ceramica_suelta_terraza.jpg', 'imagen', 'antes', NOW()),
(8, 'https://storage.googleapis.com/pitagora/evidencias/llave_cocina.jpg', 'imagen', 'antes', NOW()),
(9, 'https://storage.googleapis.com/pitagora/evidencias/luminarias_bodega_a.jpg', 'imagen', 'antes', NOW()),
(10, 'https://storage.googleapis.com/pitagora/evidencias/valvula_fuga.jpg', 'imagen', 'antes', NOW()),
(11, 'https://storage.googleapis.com/pitagora/evidencias/filtracion_techo_lab.jpg', 'imagen', 'antes', NOW()),
(12, 'https://storage.googleapis.com/pitagora/evidencias/pintura_pasillo.jpg', 'imagen', 'antes', NOW()),
(13, 'https://storage.googleapis.com/pitagora/evidencias/foco_led_caja.jpg', 'imagen', 'antes', NOW()),
(13, 'https://storage.googleapis.com/pitagora/evidencias/foco_led_caja_nuevo.jpg', 'imagen', 'despues', NOW()),
(14, 'https://storage.googleapis.com/pitagora/evidencias/frauge_piso_supermercado.jpg', 'imagen', 'antes', NOW());

-- ============================================
-- 8. AGREGAR MENSAJES
-- ============================================
INSERT INTO `mensajes` (`id_observacion`, `id_usuario`, `mensaje`, `fecha_creacion`) VALUES
(5, 12, 'Se agendó visita técnica para revisar la llave que gotea.', NOW()),
(5, 1, 'Se cambió la empaquetadura de la llave. Problema resuelto.', NOW()),
(6, 7, 'Se realizó inspección de la humedad en el muro.', NOW()),
(7, 13, 'Se reemplazaron las cerámicas sueltas exitosamente.', NOW()),
(8, 12, 'Se coordina con proveedor de grifería para la reparación.', NOW()),
(9, 2, 'Se agendó mantenimiento de las luminarias para el próximo lunes.', NOW()),
(10, 12, 'Se reparó la válvula de paso. Necesita impermeabilización.', NOW()),
(11, 9, 'Se detectó filtración desde el piso superior. Coordinando con obra.', NOW()),
(12, 14, 'Se aplicó sellador a la pintura descascarada.', NOW()),
(13, 1, 'Se cambió el foco LED por uno nuevo LED de mayor durabilidad.', NOW()),
(13, 16, 'Gracias por el pronto servicio. Se ve bien el nuevo foco.', NOW()),
(14, 13, 'Se realizó inspección del fragüe y se coordinó reparación.', NOW());

-- ============================================
-- 9. AGREGAR HISTORIAL DE BITÁCORA
-- ============================================
INSERT INTO `historial_bitacora` (`id_observacion`, `id_usuario`, `fecha_accion`, `accion`, `detalles`, `fecha_creacion`) VALUES
(5, 4, NOW(), 'Creación de observación', 'Cliente reporta llave que gotea en baño principal', NOW()),
(5, 12, NOW(), 'Cambio de estado a En Proceso', 'Se asigna técnico gasfiter para revisión', NOW()),
(5, 1, NOW(), 'Cambio de estado a Terminado', 'Se cambió empaquetadura, llave reparada', NOW()),
(6, 4, NOW(), 'Creación de observación', 'Cliente reporta humedad en muro del living', NOW()),
(6, 7, NOW(), 'Cambio de estado a En Proceso', 'Se agenda inspección del muro', NOW()),
(7, 4, NOW(), 'Creación de observación', 'Cliente reporta cerámicas sueltas en terraza', NOW()),
(7, 13, NOW(), 'Cambio de estado a Terminado', 'Se reemplazaron las cerámicas', NOW()),
(8, 4, NOW(), 'Creación de observación', 'Cliente reporta llave del lavaplatos con goteo', NOW()),
(8, 12, NOW(), 'Cambio de estado a En Proceso', 'Se coordina con proveedor de grifería', NOW()),
(9, 9, NOW(), 'Creación de observación', 'Cliente reporta luminarias no funcionan en bodega A', NOW()),
(9, 2, NOW(), 'Cambio de estado a En Proceso', 'Se asigna técnico electricista', NOW()),
(10, 9, NOW(), 'Creación de observación', 'Cliente reporta válvula de paso con fuga', NOW()),
(10, 12, NOW(), 'Cambio de estado a En Proceso', 'Se reparó la válvula de paso', NOW()),
(11, 9, NOW(), 'Creación de observación', 'Cliente reporta filtración en techo del laboratorio', NOW()),
(11, 9, NOW(), 'Cambio de estado a En Proceso', 'Se detectó filtraciones por lluvia', NOW()),
(12, 9, NOW(), 'Creación de observación', 'Cliente reporta pintura descascarada en pasillo', NOW()),
(12, 14, NOW(), 'Cambio de estado a Terminado', 'Se aplicó sellador a la pintura', NOW()),
(13, 10, NOW(), 'Creación de observación', 'Cliente reporta foco LED quemado en caja', NOW()),
(13, 1, NOW(), 'Cambio de estado a En Proceso', 'Se cambió el foco LED por uno nuevo', NOW()),
(13, 1, NOW(), 'Cambio de estado a Terminado', 'Foco LED instalado correctamente', NOW()),
(14, 10, NOW(), 'Creación de observación', 'Cliente reporta fragüe desprendido', NOW()),
(14, 13, NOW(), 'Cambio de estado a En Proceso', 'Se inspecciona el estado del fragüe', NOW());

-- ============================================
-- RESUMEN DE DATOS AGREGADOS
-- ============================================
-- Base de datos: sistema_postventa_pitagora
-- Usuarios: +15 nuevos usuarios
-- Tickets: +15 nuevos tickets
-- Observaciones: +10 nuevas observaciones
-- Evidencias: +12 nuevas evidencias
-- Mensajes: +12 nuevos mensajes
-- Historial: +22 nuevos registros de bitácora
--
-- NOTAS IMPORTANTES:
-- - Este script es compatible con sistema_postventa_pitagora
-- - Usa solo obras existentes (IDs 1-5)
-- - Usa clientes existentes (IDs 1-9)
-- - Referencia usuarios existentes y nuevos
-- - Todos los campos requeridos están incluidos

SELECT 'Script ejecutado exitosamente!' AS Resultado;
SELECT 'Datos poblados en la base de datos sistema_postventa_pitagora' AS Info;
SELECT COUNT(*) AS 'Total Usuarios' FROM usuarios;
SELECT COUNT(*) AS 'Total Tickets' FROM tickets;
SELECT COUNT(*) AS 'Total Observaciones' FROM observaciones;
SELECT COUNT(*) AS 'Total Mensajes' FROM mensajes;

-- Corrección realizada: 22 de mayo de 2026
