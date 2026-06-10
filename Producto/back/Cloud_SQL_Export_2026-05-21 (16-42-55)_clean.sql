-- Base de datos: sistema_postventa_pitagora
-- Version limpia generada desde Cloud SQL export

SET FOREIGN_KEY_CHECKS = 0;



CREATE DATABASE /*!32312 IF NOT EXISTS*/ `sistema_postventa_pitagora` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `sistema_postventa_pitagora`;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subcategoria` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre_empresa` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rut` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo_contacto` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion_calle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_region` int DEFAULT NULL,
  `id_comuna` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('Activo','Inactivo') COLLATE utf8mb4_unicode_ci DEFAULT 'Activo',
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `rut` (`rut`),
  KEY `id_region` (`id_region`),
  KEY `id_comuna` (`id_comuna`),
  CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`id_region`) REFERENCES `regiones` (`id_region`),
  CONSTRAINT `clientes_ibfk_2` FOREIGN KEY (`id_comuna`) REFERENCES `comunas` (`id_comuna`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `comunas`
--

DROP TABLE IF EXISTS `comunas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comunas` (
  `id_comuna` int NOT NULL,
  `nombre_comuna` varchar(100) NOT NULL,
  `id_region` int NOT NULL,
  PRIMARY KEY (`id_comuna`),
  KEY `id_region` (`id_region`),
  CONSTRAINT `comunas_ibfk_1` FOREIGN KEY (`id_region`) REFERENCES `regiones` (`id_region`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `evidencias`
--

DROP TABLE IF EXISTS `evidencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evidencias` (
  `id_evidencia` int NOT NULL AUTO_INCREMENT,
  `id_observacion` int NOT NULL,
  `url_archivo` varchar(500) NOT NULL,
  `tipo_archivo` enum('imagen','video') NOT NULL,
  `momento` enum('antes','despues') DEFAULT 'antes',
  `fecha_subida` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_evidencia`),
  KEY `id_observacion` (`id_observacion`),
  CONSTRAINT `evidencias_ibfk_1` FOREIGN KEY (`id_observacion`) REFERENCES `observaciones` (`id_observacion`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `historial_bitacora`
--

DROP TABLE IF EXISTS `historial_bitacora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_bitacora` (
  `id_historial` int NOT NULL AUTO_INCREMENT,
  `id_observacion` int NOT NULL,
  `id_usuario` int NOT NULL,
  `sello_tiempo` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `accion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detalles` text COLLATE utf8mb4_unicode_ci,
  `justificacion` text COLLATE utf8mb4_unicode_ci,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historial`),
  KEY `idx_observacion` (`id_observacion`),
  KEY `idx_usuario` (`id_usuario`),
  KEY `idx_sello_tiempo` (`sello_tiempo`),
  CONSTRAINT `historial_bitacora_ibfk_1` FOREIGN KEY (`id_observacion`) REFERENCES `observaciones` (`id_observacion`) ON DELETE CASCADE,
  CONSTRAINT `historial_bitacora_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `mensajes`
--

DROP TABLE IF EXISTS `mensajes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensajes` (
  `id_mensaje` int NOT NULL AUTO_INCREMENT,
  `id_observacion` int NOT NULL,
  `id_usuario` int NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_mensaje`),
  KEY `id_observacion` (`id_observacion`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`id_observacion`) REFERENCES `observaciones` (`id_observacion`) ON DELETE CASCADE,
  CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `obras`
--

DROP TABLE IF EXISTS `obras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obras` (
  `id_obra` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `nombre_obra` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion_obra` text COLLATE utf8mb4_unicode_ci,
  `direccion_calle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_region` int NOT NULL,
  `id_comuna` int DEFAULT NULL,
  `planos_presupuestos` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `garantia_expira` date DEFAULT NULL,
  `estado_obra` enum('Activa','Garantía Vencida','Cerrada') COLLATE utf8mb4_unicode_ci DEFAULT 'Activa',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_obra`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_region` (`id_region`),
  KEY `id_comuna` (`id_comuna`),
  CONSTRAINT `obras_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE RESTRICT,
  CONSTRAINT `obras_ibfk_2` FOREIGN KEY (`id_region`) REFERENCES `regiones` (`id_region`),
  CONSTRAINT `obras_ibfk_3` FOREIGN KEY (`id_comuna`) REFERENCES `comunas` (`id_comuna`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `obras_usuarios`
--

DROP TABLE IF EXISTS `obras_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obras_usuarios` (
  `id_obra` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha_asignacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_obra`,`id_usuario`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `obras_usuarios_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE,
  CONSTRAINT `obras_usuarios_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `observaciones`
--

DROP TABLE IF EXISTS `observaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `observaciones` (
  `id_observacion` int NOT NULL AUTO_INCREMENT,
  `id_ticket` int NOT NULL,
  `id_categoria` int NOT NULL,
  `falla` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ubicacion_exacta` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion_problema` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `urgencia` enum('baja','media','alta') COLLATE utf8mb4_unicode_ci DEFAULT 'media',
  `estado_observacion` enum('pendiente','en observación','aplica','en proceso','en espera aceptación','terminado','no aplica') COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente',
  `confirmacion_cliente` enum('pendiente','aceptado','rechazado') COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente',
  `fecha_confirmacion` timestamp NULL DEFAULT NULL,
  `comentario_cliente` text COLLATE utf8mb4_unicode_ci,
  `token_aceptacion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `intentos_recordatorio` int DEFAULT '0',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_termino` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_observacion`),
  UNIQUE KEY `token_aceptacion` (`token_aceptacion`),
  KEY `id_ticket` (`id_ticket`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `observaciones_ibfk_1` FOREIGN KEY (`id_ticket`) REFERENCES `tickets` (`id_ticket`) ON DELETE CASCADE,
  CONSTRAINT `observaciones_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `regiones`
--

DROP TABLE IF EXISTS `regiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regiones` (
  `id_region` int NOT NULL,
  `nombre_region` varchar(100) NOT NULL,
  PRIMARY KEY (`id_region`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id_ticket` int NOT NULL AUTO_INCREMENT,
  `id_obra` int NOT NULL,
  `id_usuario_creador` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado_general` enum('abierto','en proceso','terminado') COLLATE utf8mb4_unicode_ci DEFAULT 'abierto',
  PRIMARY KEY (`id_ticket`),
  KEY `id_obra` (`id_obra`),
  KEY `id_usuario_creador` (`id_usuario_creador`),
  KEY `fk_tickets_usuario` (`id_usuario`),
  CONSTRAINT `fk_tickets_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT,
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE,
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`id_usuario_creador`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `run` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido_paterno` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido_materno` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('admin','jefe_obra','cliente','tecnico','usuario') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cliente',
  `id_obra` int DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion_calle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_region` int DEFAULT NULL,
  `id_comuna` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('Activo','Inactivo') COLLATE utf8mb4_unicode_ci DEFAULT 'Activo',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `run` (`run`),
  UNIQUE KEY `correo` (`correo`),
  KEY `id_obra` (`id_obra`),
  KEY `id_region` (`id_region`),
  KEY `id_comuna` (`id_comuna`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE SET NULL,
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`id_region`) REFERENCES `regiones` (`id_region`),
  CONSTRAINT `usuarios_ibfk_3` FOREIGN KEY (`id_comuna`) REFERENCES `comunas` (`id_comuna`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--

SET FOREIGN_KEY_CHECKS = 1;
