-- MySQL dump 10.13  Distrib 8.4.8, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: sistema_postventa_pitagora
-- ------------------------------------------------------
-- Server version	8.4.8-google

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `sistema_postventa_pitagora`
--

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
  `nombre_categoria` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subcategoria` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Instalaciones Sanitarias','Grifería','Fallas en llaves, monomandos y flexibles.','2026-05-25 04:24:46'),(2,'Terminaciones','Pintura','Detalles de acabado, rayas o pintura saltada.','2026-05-25 04:24:46'),(3,'Puertas y/o Ventanas',NULL,'Solicitudes relacionadas con puertas, ventanas, marcos, quincallería, cerraduras, bisagras o sellos.','2026-06-02 02:52:07'),(4,'Mobiliario',NULL,'Solicitudes relacionadas con muebles, repisas, módulos, closets u otros elementos de mobiliario.','2026-06-02 02:52:07'),(5,'Cubierta',NULL,'Solicitudes relacionadas con cubiertas, techumbres, impermeabilización, filtraciones o terminaciones superiores.','2026-06-02 02:52:07'),(6,'Eléctrico',NULL,'Solicitudes relacionadas con enchufes, interruptores, luminarias, tableros o fallas eléctricas.','2026-06-02 02:52:07'),(7,'Climatización',NULL,'Solicitudes relacionadas con calefacción, ventilación, aire acondicionado o equipos de climatización.','2026-06-02 02:52:07');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre_empresa` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rut` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo_contacto` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion_calle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_region` int DEFAULT NULL,
  `id_comuna` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('Activo','Inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Activo',
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `rut` (`rut`),
  KEY `id_region` (`id_region`),
  KEY `id_comuna` (`id_comuna`),
  CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`id_region`) REFERENCES `regiones` (`id_region`),
  CONSTRAINT `clientes_ibfk_2` FOREIGN KEY (`id_comuna`) REFERENCES `comunas` (`id_comuna`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Inmobiliaria Cordillera S.A.','76.123.456-K','contacto@cordillera.cl','+5622334455','Av. Apoquindo 4500, Las Condes',13,13114,'2026-05-25 04:24:46','Activo'),(2,'Consorcio Industrial Pacífico','77.888.999-0','postventa@pacifico.cl','+5632221100','Libertad 120, Viña del Mar',6,5109,'2026-05-25 04:24:46','Activo'),(7,'Pontificia Universidad Católica de Chile','816989000','uc@uc.cl','912345678','Av Alameda 340',13,13101,'2026-06-02 03:25:37','Activo'),(8,'DuocUC','727547002','duoc@duoc.cl','912345678','Av Eliodoro Yáñez 1595',13,13123,'2026-06-11 22:00:51','Inactivo');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `comunas`
--

LOCK TABLES `comunas` WRITE;
/*!40000 ALTER TABLE `comunas` DISABLE KEYS */;
INSERT INTO `comunas` VALUES (5109,'Viña del Mar',6),(8101,'Concepción',10),(13101,'Santiago',13),(13102,'Cerrillos',13),(13103,'Cerro Navia',13),(13104,'Conchalí',13),(13105,'El Bosque',13),(13106,'Estación Central',13),(13107,'Huechuraba',13),(13108,'Independencia',13),(13109,'La Cisterna',13),(13110,'La Florida',13),(13111,'La Granja',13),(13112,'La Pintana',13),(13113,'La Reina',13),(13114,'Las Condes',13),(13115,'Lo Barnechea',13),(13116,'Lo Espejo',13),(13117,'Lo Prado',13),(13118,'Macul',13),(13119,'Maipú',13),(13120,'Ñuñoa',13),(13121,'Pedro Aguirre Cerda',13),(13122,'Peñalolén',13),(13123,'Providencia',13),(13124,'Pudahuel',13),(13125,'Quilicura',13),(13126,'Quinta Normal',13),(13127,'Recoleta',13),(13128,'Renca',13),(13129,'San Joaquín',13),(13130,'San Miguel',13),(13131,'San Ramón',13),(13132,'Vitacura',13);
/*!40000 ALTER TABLE `comunas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `costos_observacion`
--

DROP TABLE IF EXISTS `costos_observacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `costos_observacion` (
  `id_costo` int NOT NULL AUTO_INCREMENT,
  `id_observacion` int NOT NULL,
  `monto` bigint NOT NULL DEFAULT '0',
  `descripcion` varchar(255) NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_costo`),
  KEY `idx_id_observacion` (`id_observacion`),
  KEY `fk_costos_usuario` (`id_usuario`),
  CONSTRAINT `fk_costos_observacion` FOREIGN KEY (`id_observacion`) REFERENCES `observaciones` (`id_observacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_costos_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `costos_observacion`
--

LOCK TABLES `costos_observacion` WRITE;
/*!40000 ALTER TABLE `costos_observacion` DISABLE KEYS */;
INSERT INTO `costos_observacion` VALUES (1,1,250000,'electiricstas',1,'2026-06-11 19:37:58'),(2,1,500000,'luces led',1,'2026-06-11 19:38:11'),(3,1,500000,'llaves',1,'2026-06-11 19:38:43');
/*!40000 ALTER TABLE `costos_observacion` ENABLE KEYS */;
UNLOCK TABLES;

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
  `fecha_subida` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_evidencia`),
  KEY `id_observacion` (`id_observacion`),
  CONSTRAINT `evidencias_ibfk_1` FOREIGN KEY (`id_observacion`) REFERENCES `observaciones` (`id_observacion`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evidencias`
--

LOCK TABLES `evidencias` WRITE;
/*!40000 ALTER TABLE `evidencias` DISABLE KEYS */;
INSERT INTO `evidencias` VALUES (1,1,'https://storage.googleapis.com/pitagora/evidencias/llave_baño_402.jpg','2026-05-25 04:24:46'),(2,2,'https://storage.googleapis.com/pitagora/evidencias/pintura_pasillo.jpg','2026-05-25 04:24:46'),(3,1,'https://storage.googleapis.com/pitagora-evidencias-bucket/45219e09-479b-44f4-87f2-71b2ba90ac5d_IMG_91A56C27D9B9-1.jpeg','2026-06-01 02:12:15'),(4,17,'https://storage.googleapis.com/pitagora-evidencias-bucket/937b148b-8078-4629-a8b5-5bf53d332dc9_Captura de pantalla 2026-06-01 a la(s) 4.05.09 p.m..png','2026-06-02 02:05:31'),(5,17,'https://storage.googleapis.com/pitagora-evidencias-bucket/fb4552c8-4f08-4009-878b-3051814e2a2a_Captura de pantalla 2026-06-01 a la(s) 3.53.30 p.m..png','2026-06-02 02:05:31'),(6,17,'https://storage.googleapis.com/pitagora-evidencias-bucket/59e95d2b-a2fa-40d5-a6bb-45e505ffe3e0_Captura de pantalla 2026-06-01 a la(s) 4.05.09 p.m..png','2026-06-02 02:12:28'),(7,18,'https://storage.googleapis.com/pitagora-evidencias-bucket/4077d77e-3775-406c-9105-bf6a12ab7243_gettyimages-644996994-612x612.jpg','2026-06-02 02:18:50'),(8,18,'https://storage.googleapis.com/pitagora-evidencias-bucket/8db40e53-fd18-4777-a789-1dfaffa74eec_images.jpeg','2026-06-02 02:18:50'),(9,19,'https://storage.googleapis.com/pitagora-evidencias-bucket/53d84f6e-3b15-429c-89e6-ebb6d7235919_4077d77e-3775-406c-9105-bf6a12ab7243_gettyimages-644996994-612x612.jpg','2026-06-02 02:21:33'),(10,20,'https://storage.googleapis.com/pitagora-evidencias-bucket/65b928a8-21f3-4302-a042-abe981be6084_images.jpeg','2026-06-02 03:29:43'),(11,20,'https://storage.googleapis.com/pitagora-evidencias-bucket/4d9d6b48-1f26-447c-800e-790a6b792805_images (1).jpeg','2026-06-02 03:29:43'),(12,21,'https://storage.googleapis.com/pitagora-evidencias-bucket/6b508a61-7e2b-4516-ac36-eb161c1b3660_leakage-in-the-basement-P23LBAT-3-1-1.jpg','2026-06-08 21:43:54'),(13,21,'https://storage.googleapis.com/pitagora-evidencias-bucket/27e17cef-87ed-4af5-9ee3-f7ff71555b3f_images.jpg','2026-06-08 21:43:54'),(14,21,'https://storage.googleapis.com/pitagora-evidencias-bucket/e5b2b259-f9c1-41b3-8a6a-42ff73133cc7_Caracteristicas.png','2026-06-08 22:37:46'),(15,21,'https://storage.googleapis.com/pitagora-evidencias-bucket/bd01fe43-c6b5-4995-b466-ed732be682aa_leakage-in-the-basement-P23LBAT-3-1-1.jpg','2026-06-08 23:27:08'),(16,22,'https://storage.googleapis.com/pitagora-evidencias-bucket/6ee91652-c454-4efe-9d85-e625cc0f69b8_images (1).jpg','2026-06-09 00:38:50'),(17,22,'https://storage.googleapis.com/pitagora-evidencias-bucket/544043c7-3b3c-4fbf-9536-dc2eb418c0f6_how-do-i-fix-an-out-of-square-interior-door-frame-v0-vgv7z6muhuae1.jpg','2026-06-09 00:38:51'),(18,23,'https://storage.googleapis.com/pitagora-evidencias-bucket/545c9043-d4ea-462a-9baf-8baca1df1426_images (2).jpg','2026-06-09 00:50:17');
/*!40000 ALTER TABLE `evidencias` ENABLE KEYS */;
UNLOCK TABLES;

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
  `accion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `detalles` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `justificacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historial`),
  KEY `idx_observacion` (`id_observacion`),
  KEY `idx_usuario` (`id_usuario`),
  KEY `idx_sello_tiempo` (`sello_tiempo`),
  CONSTRAINT `historial_bitacora_ibfk_1` FOREIGN KEY (`id_observacion`) REFERENCES `observaciones` (`id_observacion`) ON DELETE CASCADE,
  CONSTRAINT `historial_bitacora_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_bitacora`
--

LOCK TABLES `historial_bitacora` WRITE;
/*!40000 ALTER TABLE `historial_bitacora` DISABLE KEYS */;
INSERT INTO `historial_bitacora` VALUES (1,1,1,'2026-05-25 04:24:46','Creación de observación','Cliente reporta llave que gotea en baño principal',NULL,'2026-05-25 04:24:46'),(2,2,2,'2026-05-25 04:24:46','Creación de observación','Cliente reporta pintura descascarada',NULL,'2026-05-25 04:24:46');
/*!40000 ALTER TABLE `historial_bitacora` ENABLE KEYS */;
UNLOCK TABLES;

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
  `id_evidencia` int DEFAULT NULL,
  `mensaje` text,
  `fecha_envio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_mensaje`),
  KEY `id_observacion` (`id_observacion`),
  KEY `id_usuario` (`id_usuario`),
  KEY `idx_id_evidencia` (`id_evidencia`),
  CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`id_observacion`) REFERENCES `observaciones` (`id_observacion`) ON DELETE CASCADE,
  CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT,
  CONSTRAINT `mensajes_ibfk_3` FOREIGN KEY (`id_evidencia`) REFERENCES `evidencias` (`id_evidencia`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajes`
--

LOCK TABLES `mensajes` WRITE;
/*!40000 ALTER TABLE `mensajes` DISABLE KEYS */;
INSERT INTO `mensajes` VALUES (1,1,2,NULL,'Se agendó visita técnica para revisar la llave que gotea.','2026-05-25 04:24:46'),(2,2,1,NULL,'Se coordinó inspección de la pintura del pasillo.','2026-05-25 04:24:46'),(3,1,1,NULL,'hola','2026-06-01 02:09:32'),(4,1,1,NULL,'malo','2026-06-01 02:10:38'),(5,1,1,NULL,'se cambio la luz','2026-06-01 02:11:22'),(6,1,1,3,NULL,'2026-06-01 02:12:15'),(7,1,7,NULL,'probando 123','2026-06-01 02:38:58'),(8,1,1,NULL,'hola giss','2026-06-01 02:39:21'),(9,1,1,NULL,'holaaaaaa','2026-06-01 02:40:11'),(10,1,1,NULL,'se enviaron maestros a revisar la falla','2026-06-01 02:45:41'),(11,1,1,NULL,'cambio de proceso','2026-06-01 02:57:44'),(12,1,1,NULL,'aaaa','2026-06-01 02:58:11'),(13,1,1,NULL,'mensaje rapido','2026-06-01 03:00:00'),(14,3,1,NULL,'hola','2026-06-01 03:00:32'),(15,16,1,NULL,'prueba de mensajes','2026-06-01 03:00:43'),(16,1,7,NULL,'test','2026-06-01 03:02:14'),(17,1,1,NULL,'aaaaa','2026-06-02 01:45:00'),(18,17,1,NULL,'hola','2026-06-02 02:05:54'),(19,17,1,NULL,'Se llevó un maestro a revisar la ventana hoy \n1:40pm','2026-06-02 02:06:30'),(20,17,1,6,NULL,'2026-06-02 02:12:29'),(21,20,1,NULL,'Se enviarán maestros a revisar la obra','2026-06-02 03:30:23'),(22,1,2,NULL,'hola','2026-06-04 03:57:34'),(23,21,7,NULL,'hola','2026-06-08 22:35:54'),(24,21,7,14,'Prueba de imagen','2026-06-08 22:37:46'),(25,21,7,15,'Mensaje de prueba e imagen','2026-06-08 23:27:09'),(26,23,7,NULL,'LALA','2026-06-09 00:51:02'),(27,21,7,NULL,'Chapalapachala','2026-06-09 01:09:10'),(28,2,1,NULL,'Se cambia el estado a: aplica','2026-06-11 22:50:34');
/*!40000 ALTER TABLE `mensajes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones_enviadas`
--

DROP TABLE IF EXISTS `notificaciones_enviadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones_enviadas` (
  `id_notificacion` int NOT NULL AUTO_INCREMENT,
  `id_observacion` int NOT NULL,
  `destinatario` varchar(255) NOT NULL,
  `asunto` text NOT NULL,
  `cuerpo` longtext,
  `tipo_notificacion` varchar(50) NOT NULL,
  `fecha_envio` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado_envio` varchar(50) NOT NULL DEFAULT 'enviado',
  PRIMARY KEY (`id_notificacion`),
  KEY `idx_observacion` (`id_observacion`),
  KEY `idx_fecha_envio` (`fecha_envio`),
  KEY `idx_notif_obs_fecha` (`id_observacion`,`fecha_envio`),
  CONSTRAINT `notificaciones_enviadas_ibfk_1` FOREIGN KEY (`id_observacion`) REFERENCES `observaciones` (`id_observacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones_enviadas`
--

LOCK TABLES `notificaciones_enviadas` WRITE;
/*!40000 ALTER TABLE `notificaciones_enviadas` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificaciones_enviadas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obras`
--

DROP TABLE IF EXISTS `obras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obras` (
  `id_obra` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `nombre_obra` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion_obra` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `direccion_calle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_region` int NOT NULL,
  `id_comuna` int DEFAULT NULL,
  `planos_presupuestos` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `garantia_expira` date DEFAULT NULL,
  `estado_obra` enum('Activa','Garantía Vencida','Cerrada') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Activa',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_obra`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_region` (`id_region`),
  KEY `id_comuna` (`id_comuna`),
  CONSTRAINT `obras_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE RESTRICT,
  CONSTRAINT `obras_ibfk_2` FOREIGN KEY (`id_region`) REFERENCES `regiones` (`id_region`),
  CONSTRAINT `obras_ibfk_3` FOREIGN KEY (`id_comuna`) REFERENCES `comunas` (`id_comuna`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obras`
--

LOCK TABLES `obras` WRITE;
/*!40000 ALTER TABLE `obras` DISABLE KEYS */;
INSERT INTO `obras` VALUES (1,1,'Edificio Mirador','Torre habitacional de 20 pisos.','Calle Suecia 456',13,13123,'https://storage.googleapis.com/pitagora/planos/mirador.pdf','2026-03-01','2029-03-01','Activa','2026-05-25 04:24:46'),(2,2,'Condominio Altamar','Casas de veraneo frente al mar.','Subida El Sol 10',6,5109,'https://storage.googleapis.com/pitagora/planos/altamar.pdf','2026-01-15','2029-01-15','Activa','2026-05-25 04:24:46'),(7,7,'Facultad Arquitectura','Remodelación tercer piso','Av San Joaquin 123',13,13129,NULL,'2020-05-13','2030-05-13','Activa','2026-06-02 03:26:47'),(8,8,'Baño inclusivo sede PAO','Remodelación del baño para permitir acceso a personas en condición de discapacidad motriz.\nAccesibilidad para silla de ruedas, mudador.','Padre Alonso de Ovalle 1586',13,13101,NULL,'2026-07-22','2036-07-22','Activa','2026-06-11 22:04:06');
/*!40000 ALTER TABLE `obras` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `obras_usuarios`
--

LOCK TABLES `obras_usuarios` WRITE;
/*!40000 ALTER TABLE `obras_usuarios` DISABLE KEYS */;
INSERT INTO `obras_usuarios` VALUES (1,2,'2026-05-25 04:24:46'),(2,1,'2026-05-25 04:24:46');
/*!40000 ALTER TABLE `obras_usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `observaciones`
--

DROP TABLE IF EXISTS `observaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `observaciones` (
  `id_observacion` int NOT NULL AUTO_INCREMENT,
  `id_ticket` int NOT NULL,
  `id_usuario_creador` int DEFAULT NULL,
  `id_categoria` int NOT NULL,
  `falla` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ubicacion_exacta` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion_problema` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `urgencia` enum('baja','media','alta') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'media',
  `estado_observacion` enum('pendiente','en observación','aplica','en proceso','en espera aceptación','terminado','no aplica') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente',
  `confirmacion_cliente` enum('pendiente','aceptado','rechazado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente',
  `fecha_confirmacion` timestamp NULL DEFAULT NULL,
  `comentario_cliente` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `comentario_admin` text COLLATE utf8mb4_unicode_ci,
  `costo` bigint DEFAULT '0',
  `token_aceptacion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `intentos_recordatorio` int DEFAULT '0',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_termino` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_observacion`),
  UNIQUE KEY `token_aceptacion` (`token_aceptacion`),
  KEY `id_ticket` (`id_ticket`),
  KEY `id_categoria` (`id_categoria`),
  KEY `fk_observaciones_usuario_creador` (`id_usuario_creador`),
  CONSTRAINT `fk_observaciones_usuario_creador` FOREIGN KEY (`id_usuario_creador`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `observaciones_ibfk_1` FOREIGN KEY (`id_ticket`) REFERENCES `tickets` (`id_ticket`) ON DELETE CASCADE,
  CONSTRAINT `observaciones_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observaciones`
--

LOCK TABLES `observaciones` WRITE;
/*!40000 ALTER TABLE `observaciones` DISABLE KEYS */;
INSERT INTO `observaciones` VALUES (1,1,NULL,1,'Llave gotea','Depto 402, baño principal','Llave de agua caliente gotea constantemente','alta','en proceso','pendiente',NULL,NULL,'mensaje fuera del detalle',1250000,'TK-774411',3,'2026-05-25 04:24:46',NULL),(2,2,NULL,2,'Pintura descascarada','Pasillo principal','Pintura del pasillo está descascarada','baja','aplica','pendiente',NULL,NULL,NULL,0,'TK-778801',0,'2026-05-25 04:24:46',NULL),(3,2,NULL,1,'Filtracion de agua','Bano principal, bajo el lavamanos','Filtracion bajo el lavamanos por caneria rota','media','pendiente','pendiente',NULL,NULL,NULL,85000,'74e1408f-e4b1-44a5-a8a9-0e2577c8d9ad',0,'2026-05-27 19:54:16',NULL),(15,1,1,1,'test','test','test','baja','pendiente','pendiente',NULL,NULL,NULL,980080,'d9e5e790-9695-4b6a-98ae-3d39af35c77e',0,'2026-05-27 22:36:05',NULL),(16,2,1,1,'test2','test2','test2','baja','pendiente','pendiente',NULL,NULL,NULL,NULL,'cbbddbf4-6eb8-404d-bd74-f56296e7c82e',0,'2026-05-27 22:36:15',NULL),(17,1,1,2,'Se rompió la ventana','En la sala 12','Se quebró la ventana','baja','pendiente','pendiente',NULL,NULL,NULL,51247,'ec1884aa-f30f-47ba-bfe6-ce8d00cf7e91',0,'2026-06-02 02:05:30',NULL),(18,3,1,1,'Rotura cañería','Cocina principal','Trizadura en la cañería de la cocina principal. Agua saliendo por montones. se cortó la red de agua de la cocina. Se necesita reparación urgente','alta','pendiente','pendiente',NULL,NULL,NULL,685475,'e4eb730a-a655-427f-91a2-39ef1253a38f',0,'2026-06-02 02:18:49',NULL),(19,1,2,2,'Filtracion de agua','Bano principal','La caneria se rompio','alta','pendiente','pendiente',NULL,NULL,NULL,NULL,'ef35c8b2-8a1c-4abf-8a98-11b4d16bf0ba',0,'2026-06-02 02:21:32',NULL),(20,4,1,2,'Grieta en la pared','Baño principal','Se nota una grita grande en la pared, por favor revisar.','alta','pendiente','pendiente',NULL,NULL,NULL,NULL,'041aacba-80ab-41a7-8599-655630daff7b',0,'2026-06-02 03:29:42',NULL),(21,5,10,1,'Filtración de agua en muro','Baño segundo piso, muro de lavamanos','Se observa humedad severa y desprendimiento de pintura en la base del muro. Al dar el agua del lavamanos, se filtra un flujo constante de agua desde la llave.','media','en espera aceptación','pendiente',NULL,NULL,'',NULL,'34295e62-bb62-44b2-b65a-515bcf4a7da2',0,'2026-06-08 21:43:52',NULL),(22,5,10,3,'Marcos de puertas descuadrados','Todas las puertas de las salas del ala oeste del segundo piso','Los marcos de las puertas están descuadrados, al intentar cerrar la puerta no logra cerrarse.','baja','terminado','aceptado','2026-06-09 00:46:22',NULL,'',NULL,'cd9107f0-6d67-456f-99e9-92d435787965',0,'2026-06-09 00:38:38','2026-06-09 00:46:22'),(23,5,10,3,'Ventana trizada','Sala de profesores tercer piso','El ventanal de la sala de profesores se encuentra trizado','media','terminado','aceptado','2026-06-09 00:52:01',NULL,'hola gissella como estas',NULL,'b2b8cfb8-6e64-435f-a193-78b979b16f0d',0,'2026-06-09 00:50:09','2026-06-09 00:56:42'),(24,6,1,4,'Prueba ticket cerrado','Prueba','Probando logica de ticket','baja','terminado','pendiente',NULL,NULL,'',NULL,'91447564-bf60-4cfb-a3c2-d1890559a339',0,'2026-06-11 19:26:30','2026-06-11 19:26:40'),(25,1,1,1,'asdas','asdas','sdgfsdf','media','pendiente','pendiente',NULL,NULL,NULL,NULL,'6e8067c6-e501-4da0-b94c-a0bf67daefab',0,'2026-06-11 19:32:37',NULL),(26,7,1,1,'aaa','baño','e','media','pendiente','pendiente',NULL,NULL,NULL,NULL,'21159254-1c0b-4e91-85f5-a62a46750151',0,'2026-06-11 19:55:35',NULL);
/*!40000 ALTER TABLE `observaciones` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `regiones`
--

LOCK TABLES `regiones` WRITE;
/*!40000 ALTER TABLE `regiones` DISABLE KEYS */;
INSERT INTO `regiones` VALUES (1,'Arica y Parinacota'),(2,'Tarapacá'),(3,'Antofagasta'),(4,'Atacama'),(5,'Coquimbo'),(6,'Valparaíso'),(7,'O\'Higgins'),(8,'Maule'),(9,'Ñuble'),(10,'Biobío'),(11,'Araucanía'),(12,'Los Ríos'),(13,'Metropolitana de Santiago'),(14,'Los Lagos'),(15,'Aysén'),(16,'Magallanes');
/*!40000 ALTER TABLE `regiones` ENABLE KEYS */;
UNLOCK TABLES;

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
  `costo_total` bigint DEFAULT '0',
  `estado_general` enum('abierto','en proceso','terminado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'abierto',
  PRIMARY KEY (`id_ticket`),
  KEY `id_obra` (`id_obra`),
  KEY `id_usuario_creador` (`id_usuario_creador`),
  KEY `fk_tickets_usuario` (`id_usuario`),
  CONSTRAINT `fk_tickets_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT,
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE,
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`id_usuario_creador`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,1,1,2,'2026-05-05 10:30:00',1331327,'en proceso'),(2,2,2,1,'2026-05-03 11:00:00',85000,'abierto'),(3,2,1,8,'2026-05-28 19:46:56',685475,'abierto'),(4,7,1,9,'2026-06-02 03:28:46',0,'abierto'),(5,7,10,10,'2026-06-08 21:15:14',0,'abierto'),(6,7,1,11,'2026-06-11 19:25:48',0,'terminado'),(7,7,1,11,'2026-06-11 19:33:32',0,'abierto');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `run` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido_paterno` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido_materno` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('admin','jefe_obra','cliente','tecnico','usuario') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cliente',
  `id_obra` int DEFAULT NULL,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion_calle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_region` int DEFAULT NULL,
  `id_comuna` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('Activo','Inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Activo',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `run` (`run`),
  UNIQUE KEY `correo` (`correo`),
  KEY `id_obra` (`id_obra`),
  KEY `id_region` (`id_region`),
  KEY `id_comuna` (`id_comuna`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE SET NULL,
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`id_region`) REFERENCES `regiones` (`id_region`),
  CONSTRAINT `usuarios_ibfk_3` FOREIGN KEY (`id_comuna`) REFERENCES `comunas` (`id_comuna`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'12.345.678-1','Pepe','Ramírez','López','pepe@pitagora.cl','admin123','admin',NULL,'912345678','Av. Andrés Bello 2500',13,13114,'2026-05-25 04:24:46','Activo'),(2,'13.456.789-2','Juan','Maestro','Soto','juan@pitagora.cl','usuario123','usuario',1,'912345678','Calle Los Robles 890',13,13123,'2026-05-25 04:24:46','Activo'),(7,'206936363','Gissella','Aguilar','Galindo','gissella.aguilar.galindo@gmail.com','admin123','admin',NULL,'932152834','Los Limoneros 3655',13,13118,'2026-05-27 17:30:42','Activo'),(8,'193106188','Alejandro','Reyes','Sanz','Alejandrorey@duocuc.cl','usuario123','usuario',2,'934567890','Avenida Vicuña Mackenna 340',13,13123,'2026-05-27 17:33:56','Activo'),(9,'104503845','Juan','Perez','Gonzalez','jo.galvezr@duocuc.cl','yFU%3F7%h6P#','usuario',7,'912345678','Av Alameda 321',13,13101,'2026-06-02 03:27:55','Activo'),(10,'19820420K','Sofia','Lagos','Tapia','gis.aguilar@duocuc.cl','DqbLPkoJPbSz','usuario',7,'943182773','Toesca 4321',13,13101,'2026-06-08 21:14:40','Activo'),(11,'52038065','Juan','Gonzalez','Perez','juan.gonzalez@pitagora.cl','7#H5jZ2XqtiI','usuario',7,'912345678','Av prueba 123',13,13118,'2026-06-11 19:25:21','Activo');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-11 23:35:29
