-- MySQL dump 10.13  Distrib 8.4.8, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: test
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
-- Current Database: `test`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `test` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `test`;

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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Instalaciones Sanitarias','Tuberías','Problemas con tuberías de agua potable y desagüe','2026-05-12 22:44:07'),(2,'Instalaciones Sanitarias','Grifería','Griferías defectuosas o con fugas','2026-05-12 22:44:07'),(3,'Instalaciones Sanitarias','Sanitarios','Inodoros, bidés, lavamanos','2026-05-12 22:44:07'),(4,'Instalaciones Eléctricas','Iluminación','Luminarias, focos, sistemas de iluminación','2026-05-12 22:44:07'),(5,'Instalaciones Eléctricas','Enchufes','Tomas de corriente y enchufes de pared','2026-05-12 22:44:07'),(6,'Instalaciones Eléctricas','Circuitos','Circuitos eléctricos y distribución de energía','2026-05-12 22:44:07'),(7,'Terminaciones','Cerámica','Pisos y azulejos','2026-05-12 22:44:07'),(8,'Terminaciones','Pintura','Pintura de muros y cielos','2026-05-12 22:44:07'),(9,'Terminaciones','Carpintería','Puertas, ventanas y molduras','2026-05-12 22:44:07'),(10,'Estructuras','Muros','Grietas, fisuras en muros','2026-05-12 22:44:07'),(11,'Estructuras','Pisos','Problemas de nivelación y fisuras en pisos','2026-05-12 22:44:07'),(12,'Estructuras','Techumbre','Problemas en cubiertas y techos','2026-05-12 22:44:07'),(13,'Sistemas Especiales','Climatización','Aire acondicionado, calefacción','2026-05-12 22:44:07'),(14,'Sistemas Especiales','Seguridad','Sistemas de seguridad, alarmas','2026-05-12 22:44:07'),(15,'Sistemas Especiales','Red de Datos','Cableado estructurado y redes','2026-05-12 22:44:07');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Pontificia Universidad Católica','80.989.741-1','contacto@uc.cl','+56225525000','Av. Libertador Bernardo O\'Higgins 340',13,13101,'2026-05-12 22:44:07','Activo'),(2,'Komatsu Chile S.A.','76.100.010-5','compras@komatsu.cl','+56225812000','Av. Presidente Kennedy 5757',13,13114,'2026-05-12 22:44:07','Activo'),(3,'Comercio S.A.','98.765.432-1','ventas@comercio.cl','+56229981000','Avenida Providencia 1200',13,13123,'2026-05-12 22:44:07','Activo'),(4,'Constructora BIM Ingeniería','12.345.678-9','info@bim.cl','+56227451234','Calle Los Laureles 450',13,13132,'2026-05-12 22:44:07','Activo'),(5,'jfh','192777542','ghd@fdgdf.com','765734543',NULL,15,11303,'2026-05-13 02:46:53','Activo');
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
INSERT INTO `comunas` VALUES (1101,'Iquique',2),(1107,'Alto Hospicio',2),(1401,'Pozo Almonte',2),(1402,'Camiña',2),(1403,'Colchane',2),(1404,'Huara',2),(1405,'Pica',2),(2101,'Antofagasta',3),(2102,'Mejillones',3),(2103,'Sierra Gorda',3),(2104,'Taltal',3),(2201,'Calama',3),(2202,'Ollagüe',3),(2203,'San Pedro de Atacama',3),(2301,'Tocopilla',3),(2302,'María Elena',3),(3101,'Copiapó',4),(3102,'Caldera',4),(3103,'Tierra Amarilla',4),(3201,'Chañaral',4),(3202,'Diego de Almagro',4),(3301,'Vallenar',4),(3302,'Alto del Carmen',4),(3303,'Freirina',4),(3304,'Huasco',4),(4101,'La Serena',5),(4102,'Coquimbo',5),(4103,'Andacollo',5),(4104,'La Higuera',5),(4105,'Paiguano',5),(4106,'Vicuña',5),(4201,'Illapel',5),(4202,'Canela',5),(4203,'Los Vilos',5),(4204,'Salamanca',5),(4301,'Ovalle',5),(4302,'Combarbalá',5),(4303,'Monte Patria',5),(4304,'Punitaqui',5),(4305,'Río Hurtado',5),(5101,'Valparaíso',6),(5102,'Casablanca',6),(5103,'Concón',6),(5104,'Juan Fernández',6),(5105,'Puchuncaví',6),(5107,'Quintero',6),(5109,'Viña del Mar',6),(5201,'Isla de Pascua',6),(5301,'Los Andes',6),(5302,'Calle Larga',6),(5303,'Rinconada',6),(5304,'San Esteban',6),(5401,'La Ligua',6),(5402,'Cabildo',6),(5403,'Papudo',6),(5404,'Petorca',6),(5405,'Zapallar',6),(5501,'Quillota',6),(5502,'Calera',6),(5503,'Hijuelas',6),(5504,'La Cruz',6),(5506,'Nogales',6),(5601,'San Antonio',6),(5602,'Algarrobo',6),(5603,'Cartagena',6),(5604,'El Quisco',6),(5605,'El Tabo',6),(5606,'Santo Domingo',6),(5701,'San Felipe',6),(5702,'Catemu',6),(5703,'Llaillay',6),(5704,'Panquehue',6),(5705,'Putaendo',6),(5706,'Santa María',6),(5801,'Quilpué',6),(5802,'Limache',6),(5803,'Olmué',6),(5804,'Villa Alemana',6),(6101,'Rancagua',7),(6102,'Codegua',7),(6103,'Coinco',7),(6104,'Coltauco',7),(6105,'Doñihue',7),(6106,'Graneros',7),(6107,'Las Cabras',7),(6108,'Machalí',7),(6109,'Malloa',7),(6110,'Mostazal',7),(6111,'Olivar',7),(6112,'Peumo',7),(6113,'Pichidegua',7),(6114,'Quinta de Tilcoco',7),(6115,'Rengo',7),(6116,'Requínoa',7),(6117,'San Vicente',7),(6201,'Pichilemu',7),(6202,'La Estrella',7),(6203,'Litueche',7),(6204,'Marchihue',7),(6205,'Navidad',7),(6206,'Paredones',7),(6301,'San Fernando',7),(6302,'Chépica',7),(6303,'Chimbarongo',7),(6304,'Lolol',7),(6305,'Nancagua',7),(6306,'Palmilla',7),(6307,'Peralillo',7),(6308,'Placilla',7),(6309,'Pumanque',7),(6310,'Santa Cruz',7),(7101,'Talca',8),(7102,'Constitución',8),(7103,'Curepto',8),(7104,'Empedrado',8),(7105,'Maule',8),(7106,'Pelarco',8),(7107,'Pencahue',8),(7108,'Río Claro',8),(7109,'San Clemente',8),(7110,'San Rafael',8),(7201,'Cauquenes',8),(7202,'Chanco',8),(7203,'Pelluhue',8),(7301,'Curicó',8),(7302,'Hualañé',8),(7303,'Licantén',8),(7304,'Molina',8),(7305,'Rauco',8),(7306,'Romeral',8),(7307,'Sagrada Familia',8),(7308,'Teno',8),(7309,'Vichuquén',8),(7401,'Linares',8),(7402,'Colbún',8),(7403,'Longaví',8),(7404,'Parral',8),(7405,'Retiro',8),(7406,'San Javier',8),(7407,'Villa Alegre',8),(7408,'Yerbas Buenas',8),(8101,'Concepción',10),(8102,'Coronel',10),(8103,'Chiguayante',10),(8104,'Florida',10),(8105,'Hualqui',10),(8106,'Lota',10),(8107,'Penco',10),(8108,'San Pedro de la Paz',10),(8109,'Santa Juana',10),(8110,'Talcahuano',10),(8111,'Tomé',10),(8112,'Hualpén',10),(8201,'Lebu',10),(8202,'Arauco',10),(8203,'Cañete',10),(8204,'Contulmo',10),(8205,'Curanilahue',10),(8206,'Los Álamos',10),(8207,'Tirúa',10),(8301,'Los Ángeles',10),(8302,'Antuco',10),(8303,'Cabrero',10),(8304,'Laja',10),(8305,'Mulchén',10),(8306,'Nacimiento',10),(8307,'Negrete',10),(8308,'Quilaco',10),(8309,'Quilleco',10),(8310,'San Rosendo',10),(8311,'Santa Bárbara',10),(8312,'Tucapel',10),(8313,'Yumbel',10),(8314,'Alto Biobío',10),(9101,'Temuco',11),(9102,'Carahue',11),(9103,'Cunco',11),(9104,'Curarrehue',11),(9105,'Freire',11),(9106,'Galvarino',11),(9107,'Gorbea',11),(9108,'Lautaro',11),(9109,'Loncoche',11),(9110,'Melipeuco',11),(9111,'Nueva Imperial',11),(9112,'Padre Las Casas',11),(9113,'Perquenco',11),(9114,'Pitrufquén',11),(9115,'Pucón',11),(9116,'Saavedra',11),(9117,'Teodoro Schmidt',11),(9118,'Toltén',11),(9119,'Vilún',11),(9120,'Villarrica',11),(9121,'Cholchol',11),(9201,'Angol',11),(9202,'Collipulli',11),(9203,'Curacautín',11),(9204,'Ercilla',11),(9205,'Lonquimay',11),(9206,'Los Sauces',11),(9207,'Lumaco',11),(9208,'Purén',11),(9209,'Renaico',11),(9210,'Traiguén',11),(9211,'Victoria',11),(10101,'Puerto Montt',14),(10102,'Calbuco',14),(10103,'Cochamó',14),(10104,'Fresia',14),(10105,'Frutillar',14),(10106,'Los Muermos',14),(10107,'Llanquihue',14),(10108,'Maullín',14),(10109,'Puerto Varas',14),(10201,'Castro',14),(10202,'Ancud',14),(10203,'Chonchi',14),(10204,'Curaco de Vélez',14),(10205,'Dalcahue',14),(10206,'Puqueldón',14),(10207,'Queilén',14),(10208,'Quellón',14),(10209,'Quemchi',14),(10210,'Quinchao',14),(10301,'Osorno',14),(10302,'Puerto Octay',14),(10303,'Purranque',14),(10304,'Puyehue',14),(10305,'Río Negro',14),(10306,'San Juan de la Costa',14),(10307,'San Pablo',14),(10401,'Chaitén',14),(10402,'Futaleufú',14),(10403,'Hualaihué',14),(10404,'Palena',14),(11101,'Coyhaique',15),(11102,'Lago Verde',15),(11201,'Aysén',15),(11202,'Cisnes',15),(11203,'Guaitecas',15),(11301,'Cochrane',15),(11302,'O\'Higgins',15),(11303,'Tortel',15),(11401,'Chile Chico',15),(11402,'Río Ibáñez',15),(12101,'Punta Arenas',16),(12102,'Laguna Blanca',16),(12103,'Río Verde',16),(12104,'San Gregorio',16),(12201,'Cabo de Hornos',16),(12202,'Antártica',16),(12301,'Porvenir',16),(12302,'Primavera',16),(12303,'Timaukel',16),(12401,'Natales',16),(12402,'Torres del Paine',16),(13101,'Santiago',13),(13102,'Cerrillos',13),(13103,'Cerro Navia',13),(13104,'Conchalí',13),(13105,'El Bosque',13),(13106,'Estación Central',13),(13107,'Huechuraba',13),(13108,'Independencia',13),(13109,'La Cisterna',13),(13110,'La Florida',13),(13111,'La Granja',13),(13112,'La Pintana',13),(13113,'La Reina',13),(13114,'Las Condes',13),(13115,'Lo Barnechea',13),(13116,'Lo Espejo',13),(13117,'Lo Prado',13),(13118,'Macul',13),(13119,'Maipú',13),(13120,'Ñuñoa',13),(13121,'Pedro Aguirre Cerda',13),(13122,'Peñalolén',13),(13123,'Providencia',13),(13124,'Pudahuel',13),(13125,'Quilicura',13),(13126,'Quinta Normal',13),(13127,'Recoleta',13),(13128,'Renca',13),(13129,'San Joaquín',13),(13130,'San Miguel',13),(13131,'San Ramón',13),(13132,'Vitacura',13),(13201,'Puente Alto',13),(13202,'Pirque',13),(13203,'San José de Maipo',13),(13301,'Colina',13),(13302,'Lampa',13),(13303,'Tiltil',13),(13401,'San Bernardo',13),(13402,'Buin',13),(13403,'Calera de Tango',13),(13404,'Paine',13),(13501,'Melipilla',13),(13502,'Alhué',13),(13503,'Curacaví',13),(13504,'María Pinto',13),(13505,'San Pedro',13),(13601,'Talagante',13),(13602,'El Monte',13),(13603,'Isla de Maipo',13),(13604,'Padre Hurtado',13),(13605,'Peñaflor',13),(14101,'Valdivia',12),(14102,'Corral',12),(14103,'Lanco',12),(14104,'Los Lagos',12),(14105,'Máfil',12),(14107,'Mariquina',12),(14108,'Paillaco',12),(14109,'Panguipulli',12),(14201,'La Unión',12),(14202,'Futrono',12),(14203,'Lago Ranco',12),(14204,'Río Bueno',12),(15101,'Arica',1),(15102,'Camarones',1),(15201,'Putre',1),(15202,'General Lagos',1),(16101,'Chillán',9),(16102,'Bulnes',9),(16103,'Chillán Viejo',9),(16104,'El Carmen',9),(16105,'Pemuco',9),(16106,'Pinto',9),(16107,'Quillón',9),(16108,'San Ignacio',9),(16109,'Yungay',9),(16201,'Quirihue',9),(16202,'Cobquecura',9),(16203,'Coelemu',9),(16204,'Ninhue',9),(16205,'Portezuelo',9),(16206,'Ránquil',9),(16207,'Trehuaco',9),(16301,'San Carlos',9),(16302,'Coihueco',9),(16303,'Ñiquén',9),(16304,'San Fabián',9),(16305,'San Nicolás',9);
/*!40000 ALTER TABLE `comunas` ENABLE KEYS */;
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
  `tipo_archivo` enum('imagen','video') NOT NULL,
  `momento` enum('antes','despues') DEFAULT 'antes',
  `fecha_subida` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_evidencia`),
  KEY `id_observacion` (`id_observacion`),
  CONSTRAINT `evidencias_ibfk_1` FOREIGN KEY (`id_observacion`) REFERENCES `observaciones` (`id_observacion`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evidencias`
--

LOCK TABLES `evidencias` WRITE;
/*!40000 ALTER TABLE `evidencias` DISABLE KEYS */;
INSERT INTO `evidencias` VALUES (5,4,'https://storage.google.com/pitagora/luminarias-oscuras.jpg','imagen','antes','2026-05-12 22:44:07'),(6,7,'https://storage.google.com/pitagora/tuberia-fuga-antes.jpg','imagen','antes','2026-05-12 22:44:07'),(7,7,'https://storage.google.com/pitagora/tuberia-reparada-despues.jpg','imagen','despues','2026-05-12 22:44:07');
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_bitacora`
--

LOCK TABLES `historial_bitacora` WRITE;
/*!40000 ALTER TABLE `historial_bitacora` DISABLE KEYS */;
INSERT INTO `historial_bitacora` VALUES (9,4,1,'2026-05-12 22:44:07','Creación de observación','Nueva observación por Francisco Castillo',NULL,'2026-05-12 22:44:07'),(10,4,5,'2026-05-12 22:44:07','Cambio de estado','Estado cambiado a en proceso por Ana Martínez',NULL,'2026-05-12 22:44:07'),(11,4,6,'2026-05-12 22:44:07','Confirmación del cliente','Observación aceptada por Roberto Silva (UC)',NULL,'2026-05-12 22:44:07'),(12,4,5,'2026-05-12 22:44:07','Reemplazo de luminarias','Se reemplazaron 3 luminarias LED por nuevas',NULL,'2026-05-12 22:44:07'),(13,8,1,'2026-05-12 22:44:07','Creación de observación','Nueva observación por Francisco Castillo',NULL,'2026-05-12 22:44:07'),(14,8,7,'2026-05-12 22:44:07','Rechazo de observación','Observación rechazada por Patricia Jiménez (Komatsu)','No aplica. La desnivelación es menor a lo permitido en norma técnica','2026-05-12 22:44:07'),(15,8,1,'2026-05-12 22:44:07','Cambio de estado','Estado cambiado a no aplica','Cliente rechazó la reparación. Desnivelación dentro de tolerancia técnica','2026-05-12 22:44:07'),(16,10,1,'2026-05-12 22:44:07','Creación de observación','Nueva observación por Francisco Castillo',NULL,'2026-05-12 22:44:07'),(17,10,4,'2026-05-12 22:44:07','Cambio de estado','Estado cambiado a en proceso por Carlos López',NULL,'2026-05-12 22:44:07'),(18,10,4,'2026-05-12 22:44:07','Reparación completada','Grieta sellada con productos de calidad',NULL,'2026-05-12 22:44:07'),(19,10,1,'2026-05-12 22:44:07','Cambio de estado','Estado cambiado a terminado',NULL,'2026-05-12 22:44:07'),(20,10,1,'2026-05-12 22:44:07','Envío de confirmación','Email enviado al cliente para confirmación final',NULL,'2026-05-12 22:44:07');
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
  `mensaje` text NOT NULL,
  `fecha_envio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_mensaje`),
  KEY `id_observacion` (`id_observacion`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`id_observacion`) REFERENCES `observaciones` (`id_observacion`) ON DELETE CASCADE,
  CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajes`
--

LOCK TABLES `mensajes` WRITE;
/*!40000 ALTER TABLE `mensajes` DISABLE KEYS */;
INSERT INTO `mensajes` VALUES (4,4,3,'Las luminarias LED están parpadando. Se debe revisar el circuito.','2026-05-12 22:44:07'),(5,4,5,'He cambiado las luminarias por nuevas. El problema persiste en una de ellas.','2026-05-12 22:44:07'),(6,4,1,'Se requiere verificar el circuito completo.','2026-05-12 22:44:07'),(7,7,1,'Se detectó fuga en tubería principal del sótano.','2026-05-12 22:44:07'),(8,7,4,'He revisado la tubería. Se requiere soldadura de la unión.','2026-05-12 22:44:07'),(9,7,7,'Autorizo proceder con la reparación.','2026-05-12 22:44:07');
/*!40000 ALTER TABLE `mensajes` ENABLE KEYS */;
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
-- Dumping data for table `obras`
--

LOCK TABLES `obras` WRITE;
/*!40000 ALTER TABLE `obras` DISABLE KEYS */;
INSERT INTO `obras` VALUES (1,1,'Biblioteca Central UC - Piso 3','Remodelación de espacios de estudio, áreas comunes y baños','Av. Libertador Bernardo O\'Higgins 340',13,13101,'https://storage.google.com/pitagora/uc-biblioteca-p3-planos.pdf','2025-06-30','2028-06-30','Activa','2026-05-12 22:44:07'),(2,1,'Laboratorio de Computación - Edificio W','Instalación de sistemas de climatización y red de datos','Campus San Joaquín, Av. Vicuña Mackenna 4860',13,13119,'https://storage.google.com/pitagora/uc-lab-comp-planos.pdf','2025-07-15','2028-07-15','Activa','2026-05-12 22:44:07'),(3,2,'Oficinas Komatsu - Las Condes','Construcción de 5 pisos de oficinas con estacionamiento subterráneo','Av. Presidente Kennedy 5757',13,13114,'https://storage.google.com/pitagora/komatsu-oficinas-planos.pdf','2025-08-30','2028-08-30','Activa','2026-05-12 22:44:07'),(4,3,'Local Comercial Centro - Providencia','Remodelación integral de local comercial de retail','Avenida Providencia 1200',13,13123,'https://storage.google.com/pitagora/comercio-local-planos.pdf','2025-05-20','2028-05-20','Activa','2026-05-12 22:44:07'),(5,4,'Vivienda Unifamiliar Vitacura','Casa de 3 pisos con piscina y quincho','Calle Los Laureles 450',13,13132,'https://storage.google.com/pitagora/bim-vivienda-planos.pdf','2025-09-10','2028-09-10','Activa','2026-05-12 22:44:07');
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
INSERT INTO `obras_usuarios` VALUES (1,2,'2026-05-12 22:44:07'),(1,4,'2026-05-12 22:44:07'),(1,6,'2026-05-12 22:44:07'),(2,3,'2026-05-12 22:44:07'),(2,5,'2026-05-12 22:44:07'),(2,6,'2026-05-12 22:44:07'),(3,2,'2026-05-12 22:44:07'),(3,4,'2026-05-12 22:44:07'),(3,7,'2026-05-12 22:44:07'),(4,3,'2026-05-12 22:44:07'),(4,5,'2026-05-12 22:44:07'),(5,2,'2026-05-12 22:44:07'),(5,4,'2026-05-12 22:44:07');
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observaciones`
--

LOCK TABLES `observaciones` WRITE;
/*!40000 ALTER TABLE `observaciones` DISABLE KEYS */;
INSERT INTO `observaciones` VALUES (4,2,1,'Fuga en tubería de agua','Sótano, zona de estacionamiento','Goteo en tubería principal de agua potable','alta','aplica','aceptado',NULL,NULL,'TOKEN_KOM_OF_001',0,'2026-05-12 22:44:07',NULL),(5,2,11,'Piso desnivelado','Piso 2, oficina gerencial','El piso tiene desnivel de aproximadamente 2cm en la esquina','media','pendiente','rechazado',NULL,NULL,'TOKEN_KOM_OF_002',0,'2026-05-12 22:44:07',NULL),(6,2,1,'jd','ghd','hdg','media','pendiente','pendiente',NULL,NULL,'80925789-750f-40a6-9c62-7182788a8e87',0,'2026-05-13 00:03:12',NULL),(7,3,1,'hjg','567','jtyfj','media','pendiente','pendiente',NULL,NULL,'b9cbcced-1ac2-47cd-9324-4357c41ce72a',0,'2026-05-13 02:36:22',NULL),(8,3,1,'aaa','aa','aa','media','pendiente','pendiente',NULL,NULL,'b6f81f2f-27e3-48bd-8c87-e79343ef8589',0,'2026-05-13 02:39:55',NULL),(9,3,7,'bbb','bb','bb','baja','pendiente','pendiente',NULL,NULL,'6ce45647-c5bf-41fb-a8e7-562ebe2a1121',0,'2026-05-13 02:39:55',NULL),(10,3,10,'test','banio','problema 123','alta','pendiente','pendiente',NULL,NULL,'18dc93f4-1ebe-4fea-bc78-582b4736e032',0,'2026-05-14 18:08:05',NULL);
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
INSERT INTO `regiones` VALUES (1,'Arica y Parinacota'),(2,'Tarapacá'),(3,'Antofagasta'),(4,'Atacama'),(5,'Coquimbo'),(6,'Valparaíso'),(7,'O’Higgins'),(8,'Maule'),(9,'Ñuble'),(10,'Biobío'),(11,'Araucanía'),(12,'Los Ríos'),(13,'Metropolitana de Santiago'),(14,'Los Lagos'),(15,'Aysén'),(16,'Magallanes');
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
  `id_usuario` int NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado_general` enum('abierto','en proceso','terminado') COLLATE utf8mb4_unicode_ci DEFAULT 'abierto',
  PRIMARY KEY (`id_ticket`),
  KEY `id_obra` (`id_obra`),
  KEY `id_usuario_creador` (`id_usuario_creador`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id_obra`) ON DELETE CASCADE,
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`id_usuario_creador`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT,
  CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (2,3,2,7,'2026-05-12 22:44:07','abierto'),(3,2,6,6,'2026-05-13 00:17:04','abierto');
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
  `run` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido_paterno` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido_materno` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('admin','jefe_obra','cliente','tecnico') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cliente',
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'12.345.678-k','Francisco','Castillo','Araya','francisco.castillo@pitagora.cl','hashed_password_123','admin',NULL,'+56912345678','Av. Siempre Viva 123',13,13101,'2026-05-12 22:44:07','Activo'),(2,'13.456.789-0','Juan','Pérez','González','juan.perez@pitagora.cl','hashed_password_456','tecnico',1,'+56923456789','Calle Falsa 456',13,13114,'2026-05-12 22:44:07','Activo'),(3,'14.567.890-1','María','García','López','maria.garcia@pitagora.cl','hashed_password_789','jefe_obra',NULL,'+56934567890','Pasaje Los Alerces 789',13,13123,'2026-05-12 22:44:07','Activo'),(4,'15.678.901-2','Carlos','López','Soto','carlos.lopez@pitagora.cl','hashed_password_012','tecnico',NULL,'+56945678901','Avenida Central 012',13,13132,'2026-05-12 22:44:07','Activo'),(5,'16.789.012-3','Ana','Martínez','Rojas','ana.martinez@pitagora.cl','hashed_password_345','tecnico',NULL,'+56956789012','Calle Los Pinos 345',13,13101,'2026-05-12 22:44:07','Activo'),(6,'17.890.123-4','Roberto','Silva','Castro','roberto.silva@uc.cl','hashed_password_678','cliente',2,'+56967890123','Calle Los Olivos 678',13,13119,'2026-05-12 22:44:07','Activo'),(7,'18.901.234-5','Patricia','Jiménez','Muñoz','patricia.jimenez@komatsu.cl','hashed_password_901','cliente',3,'+56978901234','Avenida Las Condes 901',13,13114,'2026-05-12 22:44:07','Activo');
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

-- Dump completed on 2026-05-14 19:22:59
