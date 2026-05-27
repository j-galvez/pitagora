-- ============================================
-- SCRIPT PARA LIMPIAR BASE DE DATOS
-- Sistema de Postventa - Pitagora
-- ============================================
-- Ejecutar en Cloud SQL Console
-- Base de datos: sistema_postventa_pitagora
-- ADVERTENCIA: Este script BORRA TODOS LOS DATOS
-- ============================================

USE `sistema_postventa_pitagora`;

-- Desactivar restricciones de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS=0;

-- ============================================
-- VACIAR TABLAS (en orden inverso de dependencias)
-- ============================================

-- Tablas sin dependencias de otras tablas
DELETE FROM `evidencias`;
DELETE FROM `historial_bitacora`;
DELETE FROM `mensajes`;

-- Tablas que dependen de observaciones
DELETE FROM `observaciones`;

-- Tablas que dependen de tickets
DELETE FROM `tickets`;

-- Tablas que dependen de obras
DELETE FROM `obras_usuarios`;
DELETE FROM `obras`;

-- Tablas que dependen de usuarios
DELETE FROM `usuarios`;

-- Tablas que dependen de clientes
DELETE FROM `clientes`;

-- Tablas base (sin dependencias)
DELETE FROM `comunas`;
DELETE FROM `categorias`;
DELETE FROM `regiones`;

-- Reactivar restricciones de claves foráneas
SET FOREIGN_KEY_CHECKS=1;

-- ============================================
-- RESETEAR AUTO_INCREMENT
-- ============================================
-- Esto hace que los IDs vuelvan a empezar desde 1

ALTER TABLE `categorias` AUTO_INCREMENT = 1;
ALTER TABLE `clientes` AUTO_INCREMENT = 1;
ALTER TABLE `comunas` AUTO_INCREMENT = 1;
ALTER TABLE `regiones` AUTO_INCREMENT = 1;
ALTER TABLE `evidencias` AUTO_INCREMENT = 1;
ALTER TABLE `historial_bitacora` AUTO_INCREMENT = 1;
ALTER TABLE `mensajes` AUTO_INCREMENT = 1;
ALTER TABLE `observaciones` AUTO_INCREMENT = 1;
ALTER TABLE `tickets` AUTO_INCREMENT = 1;
ALTER TABLE `obras_usuarios` AUTO_INCREMENT = 1;
ALTER TABLE `obras` AUTO_INCREMENT = 1;
ALTER TABLE `usuarios` AUTO_INCREMENT = 1;

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================

SELECT 'Base de datos limpiada exitosamente!' AS Resultado;
SELECT 'Todos los datos han sido eliminados' AS Info;

SELECT COUNT(*) AS 'Categorías' FROM `categorias`;
SELECT COUNT(*) AS 'Clientes' FROM `clientes`;
SELECT COUNT(*) AS 'Obras' FROM `obras`;
SELECT COUNT(*) AS 'Usuarios' FROM `usuarios`;
SELECT COUNT(*) AS 'Tickets' FROM `tickets`;
SELECT COUNT(*) AS 'Observaciones' FROM `observaciones`;
SELECT COUNT(*) AS 'Mensajes' FROM `mensajes`;
SELECT COUNT(*) AS 'Evidencias' FROM `evidencias`;
SELECT COUNT(*) AS 'Historial' FROM `historial_bitacora`;

-- Limpieza realizada: 22 de mayo de 2026
