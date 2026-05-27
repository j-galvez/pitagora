-- ============================================================================
-- Script Limpio para Modelo Entidad-Relación - Proyecto Pitágora
-- Generado a partir de Cloud SQL Export (Mayo 2026)
-- Motor: MySQL 8.0+
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. REGIONES
CREATE TABLE IF NOT EXISTS `regiones` (
  `id_region` int NOT NULL,
  `nombre_region` varchar(100) NOT NULL,
  PRIMARY KEY (`id_region`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. COMUNAS
CREATE TABLE IF NOT EXISTS `comunas` (
  `id_comuna` int NOT NULL,
  `nombre_comuna` varchar(100) NOT NULL,
  `id_region` int NOT NULL,
  PRIMARY KEY (`id_comuna`),
  CONSTRAINT `comunas_ibfk_1` FOREIGN KEY (`id_region`) REFERENCES `regiones` (`id_region`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. CLIENTES
CREATE TABLE IF NOT EXISTS `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre_empresa` varchar(150) NOT NULL,
  `rut` varchar(20) NOT NULL,
  `correo_contacto` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion_calle` varchar(255) DEFAULT NULL,
  `id_region` int DEFAULT NULL,
  `id_comuna` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('Activo','Inactivo') DEFAULT 'Activo',
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `rut` (`rut`),
  CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`id_region`) REFERENCES `regiones` (`id_region`),
  CONSTRAINT `clientes_ibfk_2` FOREIGN KEY (`id_comuna`) REFERENCES `comunas` (`id_comuna`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. OBRAS
CREATE TABLE IF NOT EXISTS `obras` (
  `id_obra` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `nombre_obra` varchar(150) NOT NULL,
  `descripcion_obra` text,
  `direccion_calle` varchar(255) DEFAULT NULL,
  `id_region` int NOT NULL,
  `id_comuna` int DEFAULT NULL,
  `planos_presupuestos` varchar(500) DEFAULT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `garantia_expira` date DEFAULT NULL,
  `estado_obra` enum('Activa','Garantía Vencida','Cerrada') DEFAULT 'Activa',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_obra`),
  CONSTRAINT `obras_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `obras_ibfk_2` FOREIGN KEY (`id_region`) REFERENCES `regiones` (`id_region`),
  CONSTRAINT `obras_ibfk_3` FOREIGN KEY (`id_comuna`) REFERENCES `comunas` (`id_comuna`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. USUARIOS
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `run` varchar(12) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido_paterno` varchar(50) NOT NULL,
  `apellido_materno` varchar(50) DEFAULT NULL,
  `correo` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','jefe_obra','cliente','tecnico','usuario') NOT NULL DEFAULT 'cliente',
  `id_obra` int DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion_calle` varchar(255) DEFAULT NULL,
  `id_region` int DEFAULT NULL,
  `id_comuna` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('Activo','Inactivo') DEFAULT 'Activo',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `run` (`run`),
  UNIQUE KEY `correo` (`correo`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE SET NULL,
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`id_region`) REFERENCES `regiones` (`id_region`),
  CONSTRAINT `usuarios_ibfk_3` FOREIGN KEY (`id_comuna`) REFERENCES `comunas` (`id_comuna`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. OBRAS_USUARIOS (N:M)
CREATE TABLE IF NOT EXISTS `obras_usuarios` (
  `id_obra` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha_asignacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_obra`,`id_usuario`),
  CONSTRAINT `obras_usuarios_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE,
  CONSTRAINT `obras_usuarios_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. CATEGORIAS
CREATE TABLE IF NOT EXISTS `categorias` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) NOT NULL,
  `subcategoria` varchar(100) DEFAULT NULL,
  `descripcion` text,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. TICKETS
CREATE TABLE IF NOT EXISTS `tickets` (
  `id_ticket` int NOT NULL AUTO_INCREMENT,
  `id_obra` int NOT NULL,
  `id_usuario_creador` int NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado_general` enum('abierto','en proceso','terminado') DEFAULT 'abierto',
  PRIMARY KEY (`id_ticket`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE,
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`id_usuario_creador`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. OBSERVACIONES
CREATE TABLE IF NOT EXISTS `observaciones` (
  `id_observacion` int NOT NULL AUTO_INCREMENT,
  `id_ticket` int NOT NULL,
  `id_categoria` int NOT NULL,
  `falla` varchar(200) NOT NULL,
  `ubicacion_exacta` varchar(255) NOT NULL,
  `descripcion_problema` text NOT NULL,
  `urgencia` enum('baja','media','alta') DEFAULT 'media',
  `estado_observacion` enum('pendiente','en observación','aplica','en proceso','en espera aceptación','terminado','no aplica') DEFAULT 'pendiente',
  `confirmacion_cliente` enum('pendiente','aceptado','rechazado') DEFAULT 'pendiente',
  `fecha_confirmacion` timestamp NULL DEFAULT NULL,
  `comentario_cliente` text,
  `token_aceptacion` varchar(100) DEFAULT NULL,
  `intentos_recordatorio` int DEFAULT '0',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_termino` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_observacion`),
  UNIQUE KEY `token_aceptacion` (`token_aceptacion`),
  CONSTRAINT `observaciones_ibfk_1` FOREIGN KEY (`id_ticket`) REFERENCES `tickets` (`id_ticket`) ON DELETE CASCADE,
  CONSTRAINT `observaciones_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. EVIDENCIAS
CREATE TABLE IF NOT EXISTS `evidencias` (
  `id_evidencia` int NOT NULL AUTO_INCREMENT,
  `id_observacion` int NOT NULL,
  `url_archivo` varchar(500) NOT NULL,
  `tipo_archivo` enum('imagen','video') NOT NULL,
  `momento` enum('antes','despues') DEFAULT 'antes',
  `fecha_subida` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_evidencia`),
  CONSTRAINT `evidencias_ibfk_1` FOREIGN KEY (`id_observacion`) REFERENCES `observaciones` (`id_observacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. MENSAJES
CREATE TABLE IF NOT EXISTS `mensajes` (
  `id_mensaje` int NOT NULL AUTO_INCREMENT,
  `id_observacion` int NOT NULL,
  `id_usuario` int NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_mensaje`),
  CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`id_observacion`) REFERENCES `observaciones` (`id_observacion`) ON DELETE CASCADE,
  CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. HISTORIAL_BITACORA
CREATE TABLE IF NOT EXISTS `historial_bitacora` (
  `id_historial` int NOT NULL AUTO_INCREMENT,
  `id_observacion` int NOT NULL,
  `id_usuario` int NOT NULL,
  `sello_tiempo` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `accion` varchar(255) NOT NULL,
  `detalles` text,
  `justificacion` text,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historial`),
  CONSTRAINT `historial_bitacora_ibfk_1` FOREIGN KEY (`id_observacion`) REFERENCES `observaciones` (`id_observacion`) ON DELETE CASCADE,
  CONSTRAINT `historial_bitacora_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;