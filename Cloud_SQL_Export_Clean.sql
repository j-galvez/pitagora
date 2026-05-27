-- Base de datos: sistema_postventa_pitagora
-- Versión limpia para MySQL Workbench - Ingeniería Inversa

SET FOREIGN_KEY_CHECKS = 0;

-- Tabla: regiones
CREATE TABLE IF NOT EXISTS regiones (
  id_region INT NOT NULL,
  nombre_region VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_region)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO regiones VALUES 
(1,'Arica y Parinacota'),
(2,'Tarapacá'),
(3,'Antofagasta'),
(4,'Atacama'),
(5,'Coquimbo'),
(6,'Valparaíso'),
(7,'OHiggins'),
(8,'Maule'),
(9,'Ñuble'),
(10,'Biobío'),
(11,'Araucanía'),
(12,'Los Ríos'),
(13,'Metropolitana de Santiago'),
(14,'Los Lagos'),
(15,'Aysén'),
(16,'Magallanes');

-- Tabla: comunas
CREATE TABLE IF NOT EXISTS comunas (
  id_comuna INT NOT NULL,
  nombre_comuna VARCHAR(100) NOT NULL,
  id_region INT NOT NULL,
  PRIMARY KEY (id_comuna),
  KEY id_region (id_region),
  CONSTRAINT comunas_ibfk_1 FOREIGN KEY (id_region) REFERENCES regiones (id_region)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Datos de comunas (muestra parcial - Región Metropolitana completa)
INSERT INTO comunas VALUES 
(1101,'Iquique',2),
(1107,'Alto Hospicio',2),
(5101,'Valparaíso',6),
(5109,'Viña del Mar',6),
(8101,'Concepción',10),
(13101,'Santiago',13),
(13102,'Cerrillos',13),
(13103,'Cerro Navia',13),
(13104,'Conchalí',13),
(13105,'El Bosque',13),
(13106,'Estación Central',13),
(13107,'Huechuraba',13),
(13108,'Independencia',13),
(13109,'La Cisterna',13),
(13110,'La Florida',13),
(13111,'La Granja',13),
(13112,'La Pintana',13),
(13113,'La Reina',13),
(13114,'Las Condes',13),
(13115,'Lo Barnechea',13),
(13116,'Lo Espejo',13),
(13117,'Lo Prado',13),
(13118,'Macul',13),
(13119,'Maipú',13),
(13120,'Ñuñoa',13),
(13121,'Pedro Aguirre Cerda',13),
(13122,'Peñalolén',13),
(13123,'Providencia',13),
(13124,'Pudahuel',13),
(13125,'Quilicura',13),
(13126,'Quinta Normal',13),
(13127,'Recoleta',13),
(13128,'Renca',13),
(13129,'San Joaquín',13),
(13130,'San Miguel',13),
(13131,'San Ramón',13),
(13132,'Vitacura',13),
(13201,'Puente Alto',13),
(13202,'Pirque',13),
(13203,'San José de Maipo',13),
(13301,'Colina',13),
(13302,'Lampa',13),
(13303,'Tiltil',13),
(13401,'San Bernardo',13),
(13402,'Buin',13),
(13403,'Calera de Tango',13),
(13404,'Paine',13),
(13501,'Melipilla',13),
(13502,'Alhué',13),
(13503,'Curacaví',13),
(13504,'María Pinto',13),
(13505,'San Pedro',13),
(13601,'Talagante',13),
(13602,'El Monte',13),
(13603,'Isla de Maipo',13),
(13604,'Padre Hurtado',13),
(13605,'Peñaflor',13);

-- Tabla: categorias
CREATE TABLE IF NOT EXISTS categorias (
  id_categoria INT NOT NULL AUTO_INCREMENT,
  nombre_categoria VARCHAR(100) NOT NULL,
  subcategoria VARCHAR(100) DEFAULT NULL,
  descripcion TEXT,
  fecha_creacion TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_categoria)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO categorias VALUES 
(1,'Instalaciones Sanitarias','Grifería','Fallas en llaves, monomandos y flexibles.','2026-05-08 14:35:53'),
(2,'Instalaciones Sanitarias','Filtración','Fugas en cañerías de PVC o cobre.','2026-05-08 14:35:53'),
(3,'Terminaciones','Pintura','Detalles de acabado, rayas o pintura saltada.','2026-05-08 14:35:53'),
(4,'Terminaciones','Cerámica','Piezas sueltas, fragüe mal aplicado o trizaduras.','2026-05-08 14:35:53'),
(5,'Instalaciones Eléctricas','Iluminación','Problemas en focos, soquetes o interruptores.','2026-05-08 14:35:53');

-- Tabla: clientes
CREATE TABLE IF NOT EXISTS clientes (
  id_cliente INT NOT NULL AUTO_INCREMENT,
  nombre_empresa VARCHAR(150) NOT NULL,
  rut VARCHAR(20) NOT NULL,
  correo_contacto VARCHAR(100) DEFAULT NULL,
  telefono VARCHAR(20) DEFAULT NULL,
  direccion_calle VARCHAR(255) DEFAULT NULL,
  id_region INT DEFAULT NULL,
  id_comuna INT DEFAULT NULL,
  fecha_creacion TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('Activo','Inactivo') DEFAULT 'Activo',
  PRIMARY KEY (id_cliente),
  UNIQUE KEY rut (rut),
  KEY id_region (id_region),
  KEY id_comuna (id_comuna),
  CONSTRAINT clientes_ibfk_1 FOREIGN KEY (id_region) REFERENCES regiones (id_region),
  CONSTRAINT clientes_ibfk_2 FOREIGN KEY (id_comuna) REFERENCES comunas (id_comuna)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO clientes VALUES 
(1,'Inmobiliaria Cordillera S.A.','76.123.456-K','contacto@cordillera.cl','+5622334455','Av. Apoquindo 4500, Las Condes',13,13114,'2026-05-08 14:35:53','Activo'),
(2,'Consorcio Industrial Pacífico','77.888.999-0','postventa@pacifico.cl','+5632221100','Libertad 120, Viña del Mar',5,5109,'2026-05-08 14:35:53','Activo'),
(3,'Retail Logística SpA','80.555.444-2','mantencion@retail.cl','+5622998877','Panamericana Norte 500, Santiago',13,13101,'2026-05-08 14:35:53','Activo'),
(4,'Pontificia Universidad Católica de Chile','816989000','catolica@uc.cl','955044000','Avenida Vicuña Mackenna 340',13,13118,'2026-05-08 19:05:36','Activo'),
(5,'Komatsu S.A','193106188','papapap@papap.com','123456799',NULL,NULL,NULL,'2026-05-08 20:28:39','Activo'),
(6,'Komatsu S.A','104503845','aa@aa.com','912345667',NULL,13,13104,'2026-05-08 21:55:44','Activo'),
(7,'Komatsu S.A','236788423','jo.galvezr@gmail.com','912345667',NULL,13,13102,'2026-05-08 21:57:40','Activo'),
(8,'Ibiza spa','761799975','ibiza@ibiza.com','982936771',NULL,13,13101,'2026-05-11 18:17:04','Activo');

-- Tabla: obras
CREATE TABLE IF NOT EXISTS obras (
  id_obra INT NOT NULL AUTO_INCREMENT,
  id_cliente INT NOT NULL,
  nombre_obra VARCHAR(150) NOT NULL,
  descripcion_obra TEXT,
  direccion_calle VARCHAR(255) DEFAULT NULL,
  id_region INT NOT NULL,
  id_comuna INT DEFAULT NULL,
  planos_presupuestos VARCHAR(500) DEFAULT NULL,
  fecha_entrega DATE DEFAULT NULL,
  garantia_expira DATE DEFAULT NULL,
  estado_obra ENUM('Activa','Garantía Vencida','Cerrada') DEFAULT 'Activa',
  fecha_creacion TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_obra),
  KEY id_cliente (id_cliente),
  KEY id_region (id_region),
  KEY id_comuna (id_comuna),
  CONSTRAINT obras_ibfk_1 FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente) ON DELETE RESTRICT,
  CONSTRAINT obras_ibfk_2 FOREIGN KEY (id_region) REFERENCES regiones (id_region),
  CONSTRAINT obras_ibfk_3 FOREIGN KEY (id_comuna) REFERENCES comunas (id_comuna)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO obras VALUES 
(1,1,'Edificio Mirador','Torre habitacional de 20 pisos.','Calle Suecia 456',13,13123,'https://storage.googleapis.com/pitagora/planos/mirador.pdf','2026-03-01','2029-03-01','Activa','2026-05-08 14:35:53'),
(2,2,'Condominio Altamar','Casas de veraneo frente al mar.','Subida El Sol 10',5,5109,'https://storage.googleapis.com/pitagora/planos/altamar.pdf','2026-01-15','2029-01-15','Activa','2026-05-08 14:35:53'),
(3,3,'Centro Logístico Biobío','Bodegas de alta resistencia.','Av. Los Carreras 1200',8,8101,'https://storage.googleapis.com/pitagora/planos/biobio.pdf','2025-12-20','2028-12-20','Activa','2026-05-08 14:35:53'),
(4,4,'Facultad de Medicina Veterinaria','Construcción de edificio de la facultad de medicina veterinaria','Avenida Vicuña Mackenna 340',13,13118,NULL,'2026-05-08','2036-05-08','Activa','2026-05-08 19:20:01'),
(5,4,'Supermercado LALA','Construcción de supermercado dentro de la universidad católica.','Avenida Vicuña Mackenna 340',13,13118,NULL,'2026-05-07','2036-05-07','Activa','2026-05-11 18:36:47');

-- Tabla: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  run VARCHAR(12) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  apellido_paterno VARCHAR(50) NOT NULL,
  apellido_materno VARCHAR(50) DEFAULT NULL,
  correo VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin','jefe_obra','cliente','tecnico','usuario') NOT NULL DEFAULT 'cliente',
  id_obra INT DEFAULT NULL,
  telefono VARCHAR(20) DEFAULT NULL,
  direccion_calle VARCHAR(255) DEFAULT NULL,
  id_region INT DEFAULT NULL,
  id_comuna INT DEFAULT NULL,
  fecha_creacion TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('Activo','Inactivo') DEFAULT 'Activo',
  PRIMARY KEY (id_usuario),
  UNIQUE KEY run (run),
  UNIQUE KEY correo (correo),
  KEY id_obra (id_obra),
  KEY id_region (id_region),
  KEY id_comuna (id_comuna),
  CONSTRAINT usuarios_ibfk_1 FOREIGN KEY (id_obra) REFERENCES obras (id_obra) ON DELETE SET NULL,
  CONSTRAINT usuarios_ibfk_2 FOREIGN KEY (id_region) REFERENCES regiones (id_region),
  CONSTRAINT usuarios_ibfk_3 FOREIGN KEY (id_comuna) REFERENCES comunas (id_comuna)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO usuarios VALUES 
(1,'12.345.678-9','Jorge','Gálvez','Silva','jorge.galvez@pitagora.cl','admin123','admin',NULL,'+56911111111','Calle Falsa 123',13,13123,'2026-05-08 14:35:53','Activo'),
(2,'15.222.333-4','Francisco','Castillo','Rojas','fcastillo@pitagora.cl','jefe2026','usuario',NULL,'+56922222222','Pasaje Real 45',13,13101,'2026-05-08 14:35:53','Activo'),
(3,'18.555.666-7','Luis','Tapia','Mendez','l.tapia@pitagora.cl','tecnico','usuario',NULL,'933333333','Av. Matta 900',13,13101,'2026-05-08 14:35:53','Activo'),
(4,'10.111.222-3','Roberto','Pérez','Soto','r.perez@cordillera.cl','cli2026','usuario',1,'944444444','Cerro Alegre 50',5,5101,'2026-05-08 14:35:53','Activo'),
(5,'17.444.555-6','Claudio','Navarro','Díaz','fpitagora@pitagora.cl','tec2026','usuario',NULL,'955555555','Valparaíso 400',5,5109,'2026-05-08 14:35:53','Activo'),
(6,'103782368','Sofia','Ramirez','Tapia','sofia@example.com','oEPwxvJFVfP&','usuario',4,'928736472','Avenida siempre viva 112',13,13113,'2026-05-08 20:29:15','Activo'),
(7,'17354958K','Valentina','Silva','Gomez','valentina@example.com','oEPwxvJFVfP&','usuario',4,'952474245','Avenida Providencia 2984',13,13123,'2026-05-11 16:29:50','Activo'),
(8,'185349659','Jose','Gomez','Soto','jose@example.com','oEPwxvJFVfP&','usuario',3,'953425533','Avenida Santa Rosa 430',13,13129,'2026-05-11 17:28:01','Activo');

-- Tabla: obras_usuarios (relación muchos a muchos)
CREATE TABLE IF NOT EXISTS obras_usuarios (
  id_obra INT NOT NULL,
  id_usuario INT NOT NULL,
  fecha_asignacion TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_obra,id_usuario),
  KEY id_usuario (id_usuario),
  CONSTRAINT obras_usuarios_ibfk_1 FOREIGN KEY (id_obra) REFERENCES obras (id_obra) ON DELETE CASCADE,
  CONSTRAINT obras_usuarios_ibfk_2 FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO obras_usuarios VALUES 
(1,2,'2026-05-08 14:35:53'),
(1,3,'2026-05-08 14:35:53'),
(2,2,'2026-05-08 14:35:53'),
(2,5,'2026-05-08 14:35:53'),
(3,2,'2026-05-08 14:35:53');

-- Tabla: tickets
CREATE TABLE IF NOT EXISTS tickets (
  id_ticket INT NOT NULL AUTO_INCREMENT,
  id_obra INT NOT NULL,
  id_usuario_creador INT NOT NULL,
  fecha_creacion TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  estado_general ENUM('abierto','en proceso','terminado') DEFAULT 'abierto',
  PRIMARY KEY (id_ticket),
  KEY id_obra (id_obra),
  KEY id_usuario_creador (id_usuario_creador),
  CONSTRAINT tickets_ibfk_1 FOREIGN KEY (id_obra) REFERENCES obras (id_obra) ON DELETE CASCADE,
  CONSTRAINT tickets_ibfk_2 FOREIGN KEY (id_usuario_creador) REFERENCES usuarios (id_usuario) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO tickets VALUES 
(1,1,2,'2026-05-08 14:35:53','en proceso'),
(2,2,4,'2026-05-08 14:35:53','abierto');

-- Tabla: observaciones
CREATE TABLE IF NOT EXISTS observaciones (
  id_observacion INT NOT NULL AUTO_INCREMENT,
  id_ticket INT NOT NULL,
  id_categoria INT NOT NULL,
  falla VARCHAR(200) NOT NULL,
  ubicacion_exacta VARCHAR(255) NOT NULL,
  descripcion_problema TEXT NOT NULL,
  urgencia ENUM('baja','media','alta') DEFAULT 'media',
  estado_observacion ENUM('pendiente','en observación','aplica','en proceso','en espera aceptación','terminado','no aplica') DEFAULT 'pendiente',
  confirmacion_cliente ENUM('pendiente','aceptado','rechazado') DEFAULT 'pendiente',
  fecha_confirmacion TIMESTAMP NULL DEFAULT NULL,
  comentario_cliente TEXT,
  token_aceptacion VARCHAR(100) DEFAULT NULL,
  intentos_recordatorio INT DEFAULT 0,
  fecha_registro TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_termino TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id_observacion),
  UNIQUE KEY token_aceptacion (token_aceptacion),
  KEY id_ticket (id_ticket),
  KEY id_categoria (id_categoria),
  CONSTRAINT observaciones_ibfk_1 FOREIGN KEY (id_ticket) REFERENCES tickets (id_ticket) ON DELETE CASCADE,
  CONSTRAINT observaciones_ibfk_2 FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO observaciones VALUES 
(1,1,1,'Filtración lavaplatos','Depto 402, Cocina','Gotea agua al abrir la llave de agua caliente.','alta','en proceso','pendiente',NULL,NULL,'TK-774411',0,'2026-05-08 14:35:53',NULL),
(2,1,3,'Muro mal pintado','Living, muro norte','Se ven manchas de rodillo y falta una mano de pintura.','baja','pendiente','pendiente',NULL,NULL,'TK-774422',0,'2026-05-08 14:35:53',NULL),
(3,2,4,'Cerámica suelta','Terraza principal','Al caminar suena hueco en el sector de la baranda.','media','pendiente','pendiente',NULL,NULL,'TK-885500',0,'2026-05-08 14:35:53',NULL);

-- Tabla: evidencias
CREATE TABLE IF NOT EXISTS evidencias (
  id_evidencia INT NOT NULL AUTO_INCREMENT,
  id_observacion INT NOT NULL,
  url_archivo VARCHAR(500) NOT NULL,
  tipo_archivo ENUM('imagen','video') NOT NULL,
  momento ENUM('antes','despues') DEFAULT 'antes',
  fecha_subida TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_evidencia),
  KEY id_observacion (id_observacion),
  CONSTRAINT evidencias_ibfk_1 FOREIGN KEY (id_observacion) REFERENCES observaciones (id_observacion) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO evidencias VALUES 
(1,1,'https://storage.googleapis.com/pitagora/evidencias/fuga_402.jpg','imagen','antes','2026-05-08 14:35:53'),
(2,3,'https://storage.googleapis.com/pitagora/evidencias/ceramica_video.mp4','video','antes','2026-05-08 14:35:53');

-- Tabla: mensajes
CREATE TABLE IF NOT EXISTS mensajes (
  id_mensaje INT NOT NULL AUTO_INCREMENT,
  id_observacion INT NOT NULL,
  id_usuario INT NOT NULL,
  mensaje TEXT NOT NULL,
  fecha_envio TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_mensaje),
  KEY id_observacion (id_observacion),
  KEY id_usuario (id_usuario),
  CONSTRAINT mensajes_ibfk_1 FOREIGN KEY (id_observacion) REFERENCES observaciones (id_observacion) ON DELETE CASCADE,
  CONSTRAINT mensajes_ibfk_2 FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO mensajes VALUES 
(1,1,3,'He revisado el lavaplatos. Se requiere cambio de flexible de 1/2.','2026-05-08 14:35:53'),
(2,1,2,'Proceda con la compra. El repuesto está autorizado.','2026-05-08 14:35:53'),
(3,1,3,'Repuesto comprado. Agendando visita con el residente para mañana.','2026-05-08 14:35:53');

-- Tabla: historial_bitacora
CREATE TABLE IF NOT EXISTS historial_bitacora (
  id_historial INT NOT NULL AUTO_INCREMENT,
  id_observacion INT NOT NULL,
  id_usuario INT NOT NULL,
  sello_tiempo TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  accion VARCHAR(255) NOT NULL,
  detalles TEXT,
  justificacion TEXT,
  fecha_creacion TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_historial),
  KEY idx_observacion (id_observacion),
  KEY idx_usuario (id_usuario),
  KEY idx_sello_tiempo (sello_tiempo),
  CONSTRAINT historial_bitacora_ibfk_1 FOREIGN KEY (id_observacion) REFERENCES observaciones (id_observacion) ON DELETE CASCADE,
  CONSTRAINT historial_bitacora_ibfk_2 FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO historial_bitacora VALUES 
(1,1,2,'2026-05-08 14:35:53','Creación de observación','Reportado durante la marcha blanca del edificio.',NULL,'2026-05-08 14:35:53'),
(2,1,3,'2026-05-08 14:35:53','Cambio de estado a En Proceso','Técnico asignado para diagnóstico inicial.',NULL,'2026-05-08 14:35:53'),
(3,3,4,'2026-05-08 14:35:53','Creación de observación','Cliente reporta falla vía plataforma web.',NULL,'2026-05-08 14:35:53'),
(4,1,3,'2026-05-08 14:35:53','Registro de mensaje','Técnico informa necesidad de repuestos.',NULL,'2026-05-08 14:35:53');

SET FOREIGN_KEY_CHECKS = 1;


