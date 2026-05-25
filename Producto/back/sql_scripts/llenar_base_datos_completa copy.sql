-- ============================================
-- SCRIPT REDUCIDO PARA BASE DE DATOS (CON TODOS LOS CAMPOS)
-- Sistema de Postventa - Pitagora
-- ============================================

USE `sistema_postventa_pitagora`;

-- Desactivar restricciones de claves foráneas
SET FOREIGN_KEY_CHECKS=0;

-- ============================================
-- 1. LLENAR TABLA REGIONES (Se mantienen todas)
-- ============================================
INSERT INTO `regiones` (`id_region`, `nombre_region`) VALUES
(1, 'Arica y Parinacota'), (2, 'Tarapacá'), (3, 'Antofagasta'), (4, 'Atacama'),
(5, 'Coquimbo'), (6, 'Valparaíso'), (7, 'O\'Higgins'), (8, 'Maule'),
(9, 'Ñuble'), (10, 'Biobío'), (11, 'Araucanía'), (12, 'Los Ríos'),
(13, 'Metropolitana de Santiago'), (14, 'Los Lagos'), (15, 'Aysén'), (16, 'Magallanes');

-- ============================================
-- 2. LLENAR TABLA COMUNAS (Se mantienen todas las del archivo original)
-- ============================================
INSERT INTO `comunas` (`id_comuna`, `nombre_comuna`, `id_region`) VALUES
(13101, 'Santiago', 13), (13102, 'Cerrillos', 13), (13103, 'Cerro Navia', 13),
(13104, 'Conchalí', 13), (13105, 'El Bosque', 13), (13106, 'Estación Central', 13),
(13107, 'Huechuraba', 13), (13108, 'Independencia', 13), (13109, 'La Cisterna', 13),
(13110, 'La Florida', 13), (13111, 'La Granja', 13), (13112, 'La Pintana', 13),
(13113, 'La Reina', 13), (13114, 'Las Condes', 13), (13115, 'Lo Barnechea', 13),
(13116, 'Lo Espejo', 13), (13117, 'Lo Prado', 13), (13118, 'Macul', 13),
(13119, 'Maipú', 13), (13120, 'Ñuñoa', 13), (13121, 'Pedro Aguirre Cerda', 13),
(13122, 'Peñalolén', 13), (13123, 'Providencia', 13), (13124, 'Pudahuel', 13),
(13125, 'Quilicura', 13), (13126, 'Quinta Normal', 13), (13127, 'Recoleta', 13),
(13128, 'Renca', 13), (13129, 'San Joaquín', 13), (13130, 'San Miguel', 13),
(13131, 'San Ramón', 13), (13132, 'Vitacura', 13), (5109, 'Viña del Mar', 6),
(8101, 'Concepción', 10);

-- ============================================
-- 3. LLENAR TABLA CATEGORIAS (2 registros)
-- ============================================
INSERT INTO `categorias` (`nombre_categoria`, `subcategoria`, `descripcion`, `fecha_creacion`) VALUES
('Instalaciones Sanitarias', 'Grifería', 'Fallas en llaves, monomandos y flexibles.', NOW()),
('Terminaciones', 'Pintura', 'Detalles de acabado, rayas o pintura saltada.', NOW());

-- ============================================
-- 4. LLENAR TABLA CLIENTES (2 registros)
-- ============================================
INSERT INTO `clientes` (`nombre_empresa`, `rut`, `correo_contacto`, `telefono`, `direccion_calle`, `id_region`, `id_comuna`, `fecha_creacion`, `estado`) VALUES
('Inmobiliaria Cordillera S.A.', '76.123.456-K', 'contacto@cordillera.cl', '+5622334455', 'Av. Apoquindo 4500, Las Condes', 13, 13114, NOW(), 'Activo'),
('Consorcio Industrial Pacífico', '77.888.999-0', 'postventa@pacifico.cl', '+5632221100', 'Libertad 120, Viña del Mar', 6, 5109, NOW(), 'Activo');

-- ============================================
-- 5. LLENAR TABLA OBRAS (2 registros)
-- ============================================
INSERT INTO `obras` (`id_cliente`, `nombre_obra`, `descripcion_obra`, `direccion_calle`, `id_region`, `id_comuna`, `planos_presupuestos`, `fecha_entrega`, `garantia_expira`, `estado_obra`, `fecha_creacion`) VALUES
(1, 'Edificio Mirador', 'Torre habitacional de 20 pisos.', 'Calle Suecia 456', 13, 13123, 'https://storage.googleapis.com/pitagora/planos/mirador.pdf', '2026-03-01', '2029-03-01', 'Activa', NOW()),
(2, 'Condominio Altamar', 'Casas de veraneo frente al mar.', 'Subida El Sol 10', 6, 5109, 'https://storage.googleapis.com/pitagora/planos/altamar.pdf', '2026-01-15', '2029-01-15', 'Activa', NOW());

-- ============================================
-- 6. LLENAR TABLA USUARIOS (2 registros con TODOS los campos)
-- ============================================
INSERT INTO `usuarios` (`run`, `nombre`, `apellido_paterno`, `apellido_materno`, `correo`, `password`, `rol`, `id_obra`, `telefono`, `direccion_calle`, `id_region`, `id_comuna`, `fecha_creacion`, `estado`) VALUES
('12.345.678-1', 'Jorge', 'Galvez', 'López', 'jorge.galvez@pitagora.cl', 'admin123', 'admin', NULL, '912345678', 'Av. Andrés Bello 2500', 13, 13114, NOW(), 'Activo'),
('13.456.789-2', 'Juan', 'Maestro', 'Soto', 'juan@pitagora.cl', 'usuario123', 'usuario', 1, '912345678', 'Calle Los Robles 890', 13, 13123, NOW(), 'Activo');

-- ============================================
-- 7. LLENAR TABLA TICKETS (2 registros)
-- ============================================
-- id_obra=1 y 2 correspondientes, id_usuario=1 y 2 creados arriba
INSERT INTO `tickets` (`id_obra`, `id_usuario_creador`, `id_usuario`, `fecha_creacion`, `estado_general`) VALUES
(1, 1, 2, '2026-05-05 10:30:00', 'en proceso'),
(2, 2, 1, '2026-05-03 11:00:00', 'abierto');

-- ============================================
-- 8. LLENAR TABLA OBSERVACIONES (2 registros)
-- ============================================
INSERT INTO `observaciones` (`id_ticket`, `id_categoria`, `falla`, `ubicacion_exacta`, `descripcion_problema`, `urgencia`, `estado_observacion`, `confirmacion_cliente`, `token_aceptacion`, `fecha_registro`) VALUES
(1, 1, 'Llave gotea', 'Depto 402, baño principal', 'Llave de agua caliente gotea constantemente', 'alta', 'en proceso', 'pendiente', 'TK-774411', NOW()),
(2, 2, 'Pintura descascarada', 'Pasillo principal', 'Pintura del pasillo está descascarada', 'baja', 'pendiente', 'pendiente', 'TK-778801', NOW());

-- ============================================
-- 9. LLENAR TABLA EVIDENCIAS (2 registros)
-- ============================================
INSERT INTO `evidencias` (`id_observacion`, `url_archivo`, `tipo_archivo`, `momento`, `fecha_subida`) VALUES
(1, 'https://storage.googleapis.com/pitagora/evidencias/llave_baño_402.jpg', 'imagen', 'antes', NOW()),
(2, 'https://storage.googleapis.com/pitagora/evidencias/pintura_pasillo.jpg', 'imagen', 'antes', NOW());

-- ============================================
-- 10. LLENAR TABLA MENSAJES (2 registros)
-- ============================================
INSERT INTO `mensajes` (`id_observacion`, `id_usuario`, `mensaje`, `fecha_envio`) VALUES
(1, 2, 'Se agendó visita técnica para revisar la llave que gotea.', NOW()),
(2, 1, 'Se coordinó inspección de la pintura del pasillo.', NOW());

-- ============================================
-- 11. LLENAR TABLA HISTORIAL_BITACORA (2 registros)
-- ============================================
INSERT INTO `historial_bitacora` (`id_observacion`, `id_usuario`, `sello_tiempo`, `accion`, `detalles`, `justificacion`, `fecha_creacion`) VALUES
(1, 1, NOW(), 'Creación de observación', 'Cliente reporta llave que gotea en baño principal', NULL, NOW()),
(2, 2, NOW(), 'Creación de observación', 'Cliente reporta pintura descascarada', NULL, NOW());

-- ============================================
-- 12. LLENAR TABLA OBRAS_USUARIOS (2 registros)
-- ============================================
INSERT INTO `obras_usuarios` (`id_obra`, `id_usuario`, `fecha_asignacion`) VALUES
(1, 2, NOW()),
(2, 1, NOW());

-- Reactivar restricciones de claves foráneas
SET FOREIGN_KEY_CHECKS=1;