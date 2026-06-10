-- ============================================
-- SCRIPT PARA LLENAR BASE DE DATOS COMPLETA
-- Sistema de Postventa - Pitagora
-- ============================================
-- Ejecutar en Cloud SQL Console
-- Base de datos: sistema_postventa_pitagora
-- ============================================

USE `sistema_postventa_pitagora`;

-- Desactivar restricciones de claves foráneas
SET FOREIGN_KEY_CHECKS=0;

-- ============================================
-- 1. LLENAR TABLA REGIONES
-- ============================================
INSERT INTO `regiones` (`id_region`, `nombre_region`) VALUES
(1, 'Arica y Parinacota'),
(2, 'Tarapacá'),
(3, 'Antofagasta'),
(4, 'Atacama'),
(5, 'Coquimbo'),
(6, 'Valparaíso'),
(7, 'O\'Higgins'),
(8, 'Maule'),
(9, 'Ñuble'),
(10, 'Biobío'),
(11, 'Araucanía'),
(12, 'Los Ríos'),
(13, 'Metropolitana de Santiago'),
(14, 'Los Lagos'),
(15, 'Aysén'),
(16, 'Magallanes');

-- ============================================
-- 2. LLENAR TABLA COMUNAS
-- ============================================
INSERT INTO `comunas` (`id_comuna`, `nombre_comuna`, `id_region`) VALUES
(13101, 'Santiago', 13),
(13102, 'Cerrillos', 13),
(13103, 'Cerro Navia', 13),
(13104, 'Conchalí', 13),
(13105, 'El Bosque', 13),
(13106, 'Estación Central', 13),
(13107, 'Huechuraba', 13),
(13108, 'Independencia', 13),
(13109, 'La Cisterna', 13),
(13110, 'La Florida', 13),
(13111, 'La Granja', 13),
(13112, 'La Pintana', 13),
(13113, 'La Reina', 13),
(13114, 'Las Condes', 13),
(13115, 'Lo Barnechea', 13),
(13116, 'Lo Espejo', 13),
(13117, 'Lo Prado', 13),
(13118, 'Macul', 13),
(13119, 'Maipú', 13),
(13120, 'Ñuñoa', 13),
(13121, 'Pedro Aguirre Cerda', 13),
(13122, 'Peñalolén', 13),
(13123, 'Providencia', 13),
(13124, 'Pudahuel', 13),
(13125, 'Quilicura', 13),
(13126, 'Quinta Normal', 13),
(13127, 'Recoleta', 13),
(13128, 'Renca', 13),
(13129, 'San Joaquín', 13),
(13130, 'San Miguel', 13),
(13131, 'San Ramón', 13),
(13132, 'Vitacura', 13),
(5109, 'Viña del Mar', 6),
(8101, 'Concepción', 10);

-- ============================================
-- 3. LLENAR TABLA CATEGORIAS
-- ============================================
INSERT INTO `categorias` (`nombre_categoria`, `subcategoria`, `descripcion`, `fecha_creacion`) VALUES
('Instalaciones Sanitarias', 'Grifería', 'Fallas en llaves, monomandos y flexibles.', NOW()),
('Instalaciones Sanitarias', 'Filtración', 'Fugas en cañerías de PVC o cobre.', NOW()),
('Terminaciones', 'Pintura', 'Detalles de acabado, rayas o pintura saltada.', NOW()),
('Terminaciones', 'Cerámica', 'Piezas sueltas, fragüe mal aplicado o trizaduras.', NOW()),
('Instalaciones Eléctricas', 'Iluminación', 'Problemas en focos, soquetes o interruptores.', NOW()),
('Carpintería', 'Puertas', 'Problemas con puertas, marcos y cerraduras.', NOW()),
('Carpintería', 'Ventanas', 'Fallas en ventanas, correderas y sellos.', NOW()),
('Carpintería', 'Closets', 'Problemas en closets y muebles empotrados.', NOW()),
('Terminaciones', 'Muros', 'Grietas, fisuras y problemas estructurales.', NOW()),
('Terminaciones', 'Pisos', 'Problemas en pisos flotantes o porcelanato.', NOW());

-- ============================================
-- 4. LLENAR TABLA CLIENTES
-- ============================================
INSERT INTO `clientes` (`nombre_empresa`, `rut`, `correo_contacto`, `telefono`, `direccion_calle`, `id_region`, `id_comuna`, `fecha_creacion`, `estado`) VALUES
('Inmobiliaria Cordillera S.A.', '76.123.456-K', 'contacto@cordillera.cl', '+5622334455', 'Av. Apoquindo 4500, Las Condes', 13, 13114, NOW(), 'Activo'),
('Consorcio Industrial Pacífico', '77.888.999-0', 'postventa@pacifico.cl', '+5632221100', 'Libertad 120, Viña del Mar', 6, 5109, NOW(), 'Activo'),
('Retail Logística SpA', '80.555.444-2', 'mantencion@retail.cl', '+5622998877', 'Panamericana Norte 500, Santiago', 13, 13101, NOW(), 'Activo'),
('Pontificia Universidad Católica de Chile', '816989000', 'catolica@uc.cl', '955044000', 'Avenida Vicuña Mackenna 340', 13, 13118, NOW(), 'Activo'),
('Constructora Nacional Ltda.', '88.777.666-5', 'proyectos@nacional.cl', '+56912345678', 'Av. Libertador Bernardo O\'Higgins 1234, Santiago', 13, 13102, NOW(), 'Activo'),
('Desarrollos Urbanos SpA', '89.555.444-3', 'desarrollo@urbano.cl', '+56987654321', 'Parque Arauco, Providencia', 13, 13123, NOW(), 'Activo'),
('Inmobiliaria Costa Verde', '90.333.222-7', 'ventas@costaverde.cl', '+56922334455', 'Av. del Mar 1500, Viña del Mar', 6, 5109, NOW(), 'Activo'),
('Komatsu S.A', '96.588.920-K', 'contacto@komatsu.cl', '+56912333444', 'Avenida Americo Vespucio 640, Santiago', 13, 13119, NOW(), 'Activo'),
('Duoc UC', '727547002', 'duoc@duoc.cl', '+56923456765', 'Madre Teresa de Calcuta 4860, Pudahuel', 13, 13124, NOW(), 'Activo');

-- ============================================
-- 5. LLENAR TABLA OBRAS
-- ============================================
INSERT INTO `obras` (`id_cliente`, `nombre_obra`, `descripcion_obra`, `direccion_calle`, `id_region`, `id_comuna`, `planos_presupuestos`, `fecha_entrega`, `garantia_expira`, `estado_obra`, `fecha_creacion`) VALUES
(1, 'Edificio Mirador', 'Torre habitacional de 20 pisos.', 'Calle Suecia 456', 13, 13123, 'https://storage.googleapis.com/pitagora/planos/mirador.pdf', '2026-03-01', '2029-03-01', 'Activa', NOW()),
(2, 'Condominio Altamar', 'Casas de veraneo frente al mar.', 'Subida El Sol 10', 6, 5109, 'https://storage.googleapis.com/pitagora/planos/altamar.pdf', '2026-01-15', '2029-01-15', 'Activa', NOW()),
(3, 'Centro Logístico Biobío', 'Bodegas de alta resistencia.', 'Av. Los Carreras 1200', 10, 8101, 'https://storage.googleapis.com/pitagora/planos/biobio.pdf', '2025-12-20', '2028-12-20', 'Activa', NOW()),
(4, 'Facultad de Medicina Veterinaria', 'Construcción de edificio de la facultad de medicina veterinaria', 'Avenida Vicuña Mackenna 340', 13, 13118, NULL, '2026-05-08', '2036-05-08', 'Activa', NOW()),
(4, 'Supermercado LALA', 'Construcción de supermercado dentro de la universidad católica.', 'Avenida Vicuña Mackenna 340', 13, 13118, NULL, '2026-05-07', '2036-05-07', 'Activa', NOW()),
(5, 'Edificio Plaza Central', 'Centro comercial y de oficinas.', 'Av. Libertador Bernardo O\'Higgins 3000, Santiago', 13, 13102, 'https://storage.googleapis.com/pitagora/planos/plaza_central.pdf', '2026-08-30', '2029-08-30', 'Activa', NOW()),
(6, 'Residencial Los Pinos', 'Condominio residencial de 40 departamentos.', 'Parque Arauco s/n, Providencia', 13, 13123, 'https://storage.googleapis.com/pitagora/planos/los_pinos.pdf', '2026-06-15', '2029-06-15', 'Activa', NOW()),
(7, 'Planta Industrial Maipú', 'Planta de manufactura de última generación.', 'Av. Circunvalación Maipú 5000, Maipú', 13, 13119, 'https://storage.googleapis.com/pitagora/planos/planta_maipú.pdf', '2026-04-20', '2029-04-20', 'Activa', NOW()),
(8, 'Oficinas Pudahuel Tech', 'Centro de tecnología e innovación.', 'Madre Teresa de Calcuta 5000, Pudahuel', 13, 13124, 'https://storage.googleapis.com/pitagora/planos/pudahuel_tech.pdf', '2026-07-10', '2029-07-10', 'Activa', NOW());

-- ============================================
-- 6. LLENAR TABLA USUARIOS
-- ============================================
INSERT INTO `usuarios` (`run`, `nombre`, `apellido_paterno`, `apellido_materno`, `correo`, `password`, `rol`, `id_obra`, `telefono`, `direccion_calle`, `id_region`, `id_comuna`, `fecha_creacion`, `estado`) VALUES
('12.345.678-1', 'Francisco', 'Castillo', 'López', 'fcastillo@pitagora.cl', 'admin123', 'admin', NULL, '+56988887777', 'Av. Andrés Bello 2500', 13, 13114, NOW(), 'Activo'),
('13.456.789-2', 'Juan', 'Maestro', 'Soto', 'jmaestro@pitagora.cl', 'obra2026', 'jefe_obra', 1, '+56955554444', 'Calle Los Robles 890', 13, 13123, NOW(), 'Activo'),
('14.567.890-3', 'Roberto', 'Técnico', 'González', 'rtenico@pitagora.cl', 'tec2026', 'tecnico', NULL, '+56933332222', 'Av. Italia 1200', 13, 13120, NOW(), 'Activo'),
('15.678.901-4', 'Admin', 'Cordillera', 'Venegas', 'admin@cordillera.cl', 'cli2026', 'cliente', 1, '+56900001111', 'Av. Apoquindo 4500', 13, 13114, NOW(), 'Activo'),
('16.789.012-5', 'Pepe', 'Tapia', 'García', 'pepetapia@dodo.com', 'oEPwxvJFVfP&', 'cliente', NULL, '+56912345678', 'Calle Principal 100', 13, 13118, NOW(), 'Inactivo'),
('17.890.123-6', 'Jorge', 'Silva', 'Morales', 'jsilva@pitagora.cl', 'tec2026', 'tecnico', NULL, '+56922224444', 'Av. Grecia 450', 13, 13120, NOW(), 'Activo'),
('18.901.234-7', 'Jorge', 'Galvez', 'Rodríguez', 'jorge.galvez@pitagora.cl', 'admin123', 'admin', NULL, '+56977778888', 'Av. Providencia 2500', 13, 13123, NOW(), 'Activo'),
('19.012.345-8', 'Carlos', 'Ramírez', 'Flores', 'cramirez@pitagora.cl', 'admin123', 'admin', NULL, '+56966669999', 'Paseo Ahumada 150', 13, 13101, NOW(), 'Activo'),
('20.123.456-9', 'Pedro', 'Soto', 'Henríquez', 'psoto@pitagora.cl', 'obra2026', 'jefe_obra', 2, '+56955551111', 'Subida El Sol 10', 6, 5109, NOW(), 'Activo'),
('21.234.567-0', 'Ana', 'Martínez', 'Bravo', 'amartinez@pitagora.cl', 'obra2026', 'jefe_obra', 3, '+56944442222', 'Av. Los Carreras 1200', 10, 8101, NOW(), 'Activo'),
('22.345.678-1', 'Luis', 'Fernández', 'Castro', 'lfernandez@pitagora.cl', 'obra2026', 'jefe_obra', 4, '+56933333333', 'Avenida Vicuña Mackenna 340', 13, 13118, NOW(), 'Activo'),
('23.456.789-2', 'Carmen', 'Gasfiter', 'López', 'cgasfiter@pitagora.cl', 'tec2026', 'tecnico', NULL, '+56911115555', 'Av. Libertador 500', 13, 13102, NOW(), 'Activo'),
('24.567.890-3', 'Diego', 'Pintor', 'Medina', 'dpintor@pitagora.cl', 'tec2026', 'tecnico', NULL, '+56900006666', 'Calle Teatinos 120', 13, 13127, NOW(), 'Activo'),
('25.678.901-4', 'Patricia', 'Carpintera', 'Silva', 'pcarpintera@pitagora.cl', 'tec2026', 'tecnico', NULL, '+56988887777', 'Av. Apoquindo 3000', 13, 13114, NOW(), 'Activo'),
('26.789.012-5', 'Cliente', 'Pacifico', 'Martinez', 'cliente@pacifico.cl', 'cli2026', 'cliente', 2, '+56977771111', 'Libertad 120', 6, 5109, NOW(), 'Activo'),
('27.890.123-6', 'Cliente', 'Logistica', 'González', 'cliente@logistica.cl', 'cli2026', 'cliente', 3, '+56966662222', 'Av. Los Carreras 1200', 10, 8101, NOW(), 'Activo');

-- ============================================
-- 7. LLENAR TABLA TICKETS
-- ============================================
INSERT INTO `tickets` (`id_obra`, `id_usuario_creador`, `id_usuario`, `fecha_creacion`, `estado_general`) VALUES
(1, 4, NULL, '2026-05-05 10:30:00', 'en proceso'),
(1, 4, 3, '2026-05-06 14:20:00', 'en proceso'),
(1, 4, 3, '2026-05-07 09:15:00', 'terminado'),
(2, 15, 12, '2026-05-03 11:00:00', 'abierto'),
(2, 15, 12, '2026-05-04 15:30:00', 'en proceso'),
(2, 15, 12, '2026-05-05 08:45:00', 'en proceso'),
(3, 16, 3, '2026-05-02 09:00:00', 'abierto'),
(3, 16, 3, '2026-05-03 13:30:00', 'en proceso'),
(3, 16, 3, '2026-05-04 11:15:00', 'en proceso'),
(4, 11, 6, '2026-05-01 10:00:00', 'abierto'),
(4, 11, 6, '2026-05-02 14:30:00', 'en proceso'),
(5, 11, 13, '2026-05-03 08:30:00', 'abierto'),
(5, 11, 13, '2026-05-04 12:00:00', 'en proceso'),
(6, 4, 3, '2026-05-05 10:15:00', 'abierto'),
(7, 4, 12, '2026-05-03 14:45:00', 'en proceso'),
(8, 4, 3, '2026-05-02 11:30:00', 'terminado');

-- ============================================
-- 8. LLENAR TABLA OBSERVACIONES
-- ============================================
INSERT INTO `observaciones` (`id_ticket`, `id_categoria`, `falla`, `ubicacion_exacta`, `descripcion_problema`, `urgencia`, `estado_observacion`, `confirmacion_cliente`, `token_aceptacion`, `fecha_registro`) VALUES
(1, 1, 'Llave gotea', 'Depto 402, baño principal', 'Llave de agua caliente gotea constantemente', 'alta', 'en proceso', 'pendiente', 'TK-774411', NOW()),
(1, 2, 'Muro con humedad', 'Living principal', 'Se observan manchas de humedad en el muro norte', 'baja', 'pendiente', 'pendiente', 'TK-774422', NOW()),
(2, 4, 'Cerámica suelta', 'Terraza principal', 'Cerámicas suenan huecas en el sector de la baranda', 'media', 'pendiente', 'pendiente', 'TK-885500', NOW()),
(2, 1, 'Llave del lavaplatos', 'Cocina', 'Gotea agua constantemente en el flexible', 'media', 'en proceso', 'pendiente', 'TK-885501', NOW()),
(3, 5, 'Luminarias no encienden', 'Bodega A, sector norte', 'Varias luminarias del sector norte no funcionan', 'alta', 'pendiente', 'pendiente', 'TK-995500', NOW()),
(3, 1, 'Válvula de paso con fuga', 'Baño empleados', 'La válvula de paso tiene fuga de agua', 'alta', 'en proceso', 'pendiente', 'TK-995501', NOW()),
(4, 2, 'Filtración en techo', 'Laboratorio 201', 'Filtraciones de agua durante lluvia en el techo', 'alta', 'en proceso', 'pendiente', 'TK-778800', NOW()),
(4, 3, 'Pintura descascarada', 'Pasillo principal', 'Pintura del pasillo está descascarada', 'baja', 'pendiente', 'pendiente', 'TK-778801', NOW()),
(5, 5, 'Foco LED quemado', 'Zona de cajas', 'Foco LED de la zona de cajas está quemado', 'media', 'terminado', 'aceptado', 'TK-669900', NOW()),
(5, 4, 'Fragüe desprendido', 'Piso interior', 'Fragüe entre cerámicas se está desprendiendo', 'media', 'en proceso', 'pendiente', 'TK-669901', NOW()),
(6, 6, 'Puerta no cierra bien', 'Depto 301, puerta principal', 'La puerta principal no cierra correctamente', 'media', 'pendiente', 'pendiente', 'TK-556600', NOW()),
(6, 7, 'Ventana con filtración', 'Depto 305, dormitorio', 'La ventana filtra agua cuando llueve', 'alta', 'en observación', 'pendiente', 'TK-556601', NOW()),
(7, 1, 'Ducha con baja presión', 'Depto 501, baño principal', 'La ducha tiene muy baja presión de agua', 'media', 'pendiente', 'pendiente', 'TK-667700', NOW()),
(8, 3, 'Pintura con burbujas', 'Depto 605, living', 'Pintura del living presenta burbujas', 'baja', 'en observación', 'pendiente', 'TK-667701', NOW()),
(9, 9, 'Muro con grietas', 'Fachada norte', 'Se observan grietas en el muro exterior', 'alta', 'pendiente', 'pendiente', 'TK-778822', NOW()),
(10, 8, 'Closet descuadrado', 'Dormitorio principal', 'Puertas del closet están descuadradas', 'media', 'en proceso', 'pendiente', 'TK-889933', NOW());

-- ============================================
-- 9. LLENAR TABLA EVIDENCIAS
-- ============================================
INSERT INTO `evidencias` (`id_observacion`, `url_archivo`, `tipo_archivo`, `momento`, `fecha_subida`) VALUES
(1, 'https://storage.googleapis.com/pitagora/evidencias/llave_baño_402.jpg', 'imagen', 'antes', NOW()),
(1, 'https://storage.googleapis.com/pitagora/evidencias/llave_baño_402_reparado.jpg', 'imagen', 'despues', NOW()),
(2, 'https://storage.googleapis.com/pitagora/evidencias/muro_humedad.jpg', 'imagen', 'antes', NOW()),
(3, 'https://storage.googleapis.com/pitagora/evidencias/ceramica_suelta_terraza.jpg', 'imagen', 'antes', NOW()),
(4, 'https://storage.googleapis.com/pitagora/evidencias/llave_cocina.jpg', 'imagen', 'antes', NOW()),
(5, 'https://storage.googleapis.com/pitagora/evidencias/luminarias_bodega_a.jpg', 'imagen', 'antes', NOW()),
(6, 'https://storage.googleapis.com/pitagora/evidencias/valvula_fuga.jpg', 'imagen', 'antes', NOW()),
(7, 'https://storage.googleapis.com/pitagora/evidencias/filtracion_techo_lab.jpg', 'imagen', 'antes', NOW()),
(8, 'https://storage.googleapis.com/pitagora/evidencias/pintura_pasillo.jpg', 'imagen', 'antes', NOW()),
(9, 'https://storage.googleapis.com/pitagora/evidencias/foco_led_caja.jpg', 'imagen', 'antes', NOW()),
(9, 'https://storage.googleapis.com/pitagora/evidencias/foco_led_caja_nuevo.jpg', 'imagen', 'despues', NOW()),
(10, 'https://storage.googleapis.com/pitagora/evidencias/frauge_piso.jpg', 'imagen', 'antes', NOW()),
(11, 'https://storage.googleapis.com/pitagora/evidencias/puerta_no_cierra.jpg', 'imagen', 'antes', NOW()),
(12, 'https://storage.googleapis.com/pitagora/evidencias/ventana_filtracion.jpg', 'imagen', 'antes', NOW()),
(13, 'https://storage.googleapis.com/pitagora/evidencias/ducha_baja_presion.jpg', 'imagen', 'antes', NOW()),
(14, 'https://storage.googleapis.com/pitagora/evidencias/pintura_burbujas.jpg', 'imagen', 'antes', NOW());

-- ============================================
-- 10. LLENAR TABLA MENSAJES
-- ============================================
INSERT INTO `mensajes` (`id_observacion`, `id_usuario`, `mensaje`, `fecha_envio`) VALUES
(1, 3, 'Se agendó visita técnica para revisar la llave que gotea.', NOW()),
(1, 1, 'Se cambió la empaquetadura de la llave. Problema resuelto.', NOW()),
(2, 7, 'Se realizó inspección de la humedad en el muro.', NOW()),
(3, 14, 'Se reemplazaron las cerámicas sueltas exitosamente.', NOW()),
(4, 3, 'Se coordina con proveedor de grifería para la reparación.', NOW()),
(5, 6, 'Se agendó mantenimiento de las luminarias para el próximo lunes.', NOW()),
(6, 3, 'Se reparó la válvula de paso. Necesita impermeabilización.', NOW()),
(7, 6, 'Se detectó filtración desde el piso superior. Coordinando con obra.', NOW()),
(8, 13, 'Se aplicó sellador a la pintura descascarada.', NOW()),
(9, 1, 'Se cambió el foco LED por uno nuevo LED de mayor durabilidad.', NOW()),
(9, 15, 'Gracias por el pronto servicio. Se ve bien el nuevo foco.', NOW()),
(10, 14, 'Se realizó inspección del fragüe y se coordinó reparación.', NOW()),
(11, 3, 'La puerta necesita ajuste de bisagras.', NOW()),
(12, 6, 'Se solicitará cambio de vidrio al proveedor.', NOW()),
(13, 12, 'Se revisó la presión del agua. Sistema normal.', NOW()),
(14, 13, 'Se requiere decapado y repintado de la zona.', NOW());

-- ============================================
-- 11. LLENAR TABLA HISTORIAL_BITACORA
-- ============================================
INSERT INTO `historial_bitacora` (`id_observacion`, `id_usuario`, `sello_tiempo`, `accion`, `detalles`, `justificacion`, `fecha_creacion`) VALUES
(1, 4, NOW(), 'Creación de observación', 'Cliente reporta llave que gotea en baño principal', NULL, NOW()),
(1, 3, NOW(), 'Cambio de estado a En Proceso', 'Se asigna técnico gasfiter para revisión', NULL, NOW()),
(1, 1, NOW(), 'Cambio de estado a Terminado', 'Se cambió empaquetadura, llave reparada', 'Reparación exitosa', NOW()),
(2, 4, NOW(), 'Creación de observación', 'Cliente reporta humedad en muro del living', NULL, NOW()),
(2, 7, NOW(), 'Cambio de estado a En Proceso', 'Se agenda inspección del muro', NULL, NOW()),
(3, 15, NOW(), 'Creación de observación', 'Cliente reporta cerámicas sueltas en terraza', NULL, NOW()),
(3, 14, NOW(), 'Cambio de estado a Terminado', 'Se reemplazaron las cerámicas', 'Reemplazo completado', NOW()),
(4, 15, NOW(), 'Creación de observación', 'Cliente reporta llave del lavaplatos con goteo', NULL, NOW()),
(4, 3, NOW(), 'Cambio de estado a En Proceso', 'Se coordina con proveedor de grifería', NULL, NOW()),
(5, 16, NOW(), 'Creación de observación', 'Cliente reporta luminarias no funcionan en bodega A', NULL, NOW()),
(5, 6, NOW(), 'Cambio de estado a En Proceso', 'Se asigna técnico electricista', NULL, NOW()),
(6, 16, NOW(), 'Creación de observación', 'Cliente reporta válvula de paso con fuga', NULL, NOW()),
(6, 3, NOW(), 'Cambio de estado a En Proceso', 'Se reparó la válvula de paso', NULL, NOW()),
(7, 11, NOW(), 'Creación de observación', 'Cliente reporta filtración en techo del laboratorio', NULL, NOW()),
(7, 6, NOW(), 'Cambio de estado a En Proceso', 'Se detectó filtraciones por lluvia', NULL, NOW()),
(8, 11, NOW(), 'Creación de observación', 'Cliente reporta pintura descascarada en pasillo', NULL, NOW()),
(8, 13, NOW(), 'Cambio de estado a Terminado', 'Se aplicó sellador a la pintura', 'Acabado completado', NOW()),
(9, 11, NOW(), 'Creación de observación', 'Cliente reporta foco LED quemado en caja', NULL, NOW()),
(9, 1, NOW(), 'Cambio de estado a En Proceso', 'Se cambió el foco LED por uno nuevo', NULL, NOW()),
(9, 1, NOW(), 'Cambio de estado a Terminado', 'Foco LED instalado correctamente', 'Instalación exitosa', NOW()),
(10, 11, NOW(), 'Creación de observación', 'Cliente reporta fragüe desprendido', NULL, NOW()),
(10, 14, NOW(), 'Cambio de estado a En Proceso', 'Se inspecciona el estado del fragüe', NULL, NOW());

-- ============================================
-- 12. LLENAR TABLA OBRAS_USUARIOS
-- ============================================
INSERT INTO `obras_usuarios` (`id_obra`, `id_usuario`, `fecha_asignacion`) VALUES
(1, 2, NOW()),
(1, 3, NOW()),
(2, 9, NOW()),
(2, 12, NOW()),
(3, 10, NOW()),
(3, 3, NOW()),
(4, 11, NOW()),
(5, 11, NOW()),
(6, 4, NOW()),
(7, 4, NOW()),
(8, 4, NOW());

-- Reactivar restricciones de claves foráneas
SET FOREIGN_KEY_CHECKS=1;

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================

SELECT 'Base de datos llenada exitosamente!' AS Resultado;
SELECT 'Todos los datos han sido insertados' AS Info;

SELECT COUNT(*) AS 'Regiones' FROM `regiones`;
SELECT COUNT(*) AS 'Comunas' FROM `comunas`;
SELECT COUNT(*) AS 'Categorías' FROM `categorias`;
SELECT COUNT(*) AS 'Clientes' FROM `clientes`;
SELECT COUNT(*) AS 'Obras' FROM `obras`;
SELECT COUNT(*) AS 'Usuarios' FROM `usuarios`;
SELECT COUNT(*) AS 'Tickets' FROM `tickets`;
SELECT COUNT(*) AS 'Observaciones' FROM `observaciones`;
SELECT COUNT(*) AS 'Evidencias' FROM `evidencias`;
SELECT COUNT(*) AS 'Mensajes' FROM `mensajes`;
SELECT COUNT(*) AS 'Historial' FROM `historial_bitacora`;
SELECT COUNT(*) AS 'Obras_Usuarios' FROM `obras_usuarios`;

-- Script ejecutado: 22 de mayo de 2026
