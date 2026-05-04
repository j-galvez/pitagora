# 🗄️ Tarea 2: Optimizaciones de Base de Datos

## 📋 Checklist General

- [ ] Crear índices para mejorar rendimiento
- [ ] Agregar triggers para auditoría
- [ ] Crear vistas útiles
- [ ] Implementar procedimientos almacenados
- [ ] Agregar datos de prueba

---

## 1️⃣ Crear Índices

### ✅ Tareas
- [ ] Índices en claves foráneas
- [ ] Índices en campos de búsqueda frecuente
- [ ] Índices compuestos para consultas comunes

### 📝 Código SQL

```sql
-- Índices en usuarios
CREATE INDEX idx_usuarios_correo ON usuarios(correo);
CREATE INDEX idx_usuarios_rut ON usuarios(rut);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

-- Índices en tickets
CREATE INDEX idx_tickets_usuario ON tickets(id_usuario);
CREATE INDEX idx_tickets_obra ON tickets(id_obra);
CREATE INDEX idx_tickets_estado ON tickets(estado_general);
CREATE INDEX idx_tickets_fecha ON tickets(fecha_creacion);

-- Índices en observaciones
CREATE INDEX idx_observaciones_ticket ON observaciones(id_ticket);
CREATE INDEX idx_observaciones_categoria ON observaciones(id_categoria);
CREATE INDEX idx_observaciones_estado ON observaciones(estado_observacion);

-- Índices en evidencias
CREATE INDEX idx_evidencias_observacion ON evidencias(id_observacion);

-- Índice compuesto para búsquedas comunes
CREATE INDEX idx_tickets_usuario_estado ON tickets(id_usuario, estado_general);
CREATE INDEX idx_observaciones_ticket_estado ON observaciones(id_ticket, estado_observacion);
```

### ⚠️ Consideraciones
- Los índices mejoran las consultas SELECT pero ralentizan INSERT/UPDATE
- No crear índices en tablas muy pequeñas (< 1000 registros)
- Monitorear el uso de índices con `EXPLAIN`

---

## 2️⃣ Triggers de Auditoría

### ✅ Tareas
- [ ] Trigger para cerrar ticket automáticamente
- [ ] Trigger para registrar cambios de estado
- [ ] Trigger para validaciones

### 📝 Código SQL

```sql
-- Trigger: Cerrar ticket cuando todas las observaciones estén terminadas
DELIMITER //

CREATE TRIGGER cerrar_ticket_automatico
AFTER UPDATE ON observaciones
FOR EACH ROW
BEGIN
    DECLARE observaciones_pendientes INT;
    
    -- Contar observaciones que no están terminadas
    SELECT COUNT(*) INTO observaciones_pendientes
    FROM observaciones
    WHERE id_ticket = NEW.id_ticket
    AND estado_observacion NOT IN ('Terminado', 'No aplica');
    
    -- Si no hay observaciones pendientes, cerrar el ticket
    IF observaciones_pendientes = 0 THEN
        UPDATE tickets
        SET estado_general = 'Cerrado'
        WHERE id_ticket = NEW.id_ticket;
    END IF;
END//

DELIMITER ;

-- Trigger: Reabrir ticket si se agrega una nueva observación
DELIMITER //

CREATE TRIGGER reabrir_ticket_nueva_observacion
AFTER INSERT ON observaciones
FOR EACH ROW
BEGIN
    UPDATE tickets
    SET estado_general = 'Abierto'
    WHERE id_ticket = NEW.id_ticket
    AND estado_general = 'Cerrado';
END//

DELIMITER ;
```

### ⚠️ Consideraciones
- Los triggers se ejecutan automáticamente
- Pueden afectar el rendimiento si son complejos
- Documentar bien su comportamiento

---

## 3️⃣ Vistas Útiles

### ✅ Tareas
- [ ] Vista de tickets con información completa
- [ ] Vista de estadísticas por obra
- [ ] Vista de observaciones pendientes

### 📝 Código SQL

```sql
-- Vista: Tickets con información completa
CREATE VIEW vista_tickets_completos AS
SELECT 
    t.id_ticket,
    t.estado_general,
    t.fecha_creacion,
    u.nombre AS nombre_usuario,
    u.correo AS correo_usuario,
    o.nombre_obra,
    COUNT(obs.id_observacion) AS total_observaciones,
    SUM(CASE WHEN obs.estado_observacion = 'Terminado' THEN 1 ELSE 0 END) AS observaciones_terminadas,
    SUM(CASE WHEN obs.estado_observacion = 'Nuevo' THEN 1 ELSE 0 END) AS observaciones_nuevas,
    SUM(CASE WHEN obs.estado_observacion = 'En proceso' THEN 1 ELSE 0 END) AS observaciones_en_proceso
FROM tickets t
INNER JOIN usuarios u ON t.id_usuario = u.id_usuario
INNER JOIN obras o ON t.id_obra = o.id_obra
LEFT JOIN observaciones obs ON t.id_ticket = obs.id_ticket
GROUP BY t.id_ticket, t.estado_general, t.fecha_creacion, u.nombre, u.correo, o.nombre_obra;

-- Vista: Estadísticas por obra
CREATE VIEW vista_estadisticas_obras AS
SELECT 
    o.id_obra,
    o.nombre_obra,
    COUNT(DISTINCT t.id_ticket) AS total_tickets,
    COUNT(DISTINCT CASE WHEN t.estado_general = 'Abierto' THEN t.id_ticket END) AS tickets_abiertos,
    COUNT(DISTINCT CASE WHEN t.estado_general = 'Cerrado' THEN t.id_ticket END) AS tickets_cerrados,
    COUNT(obs.id_observacion) AS total_observaciones,
    SUM(CASE WHEN obs.estado_observacion = 'Terminado' THEN 1 ELSE 0 END) AS observaciones_terminadas
FROM obras o
LEFT JOIN tickets t ON o.id_obra = t.id_obra
LEFT JOIN observaciones obs ON t.id_ticket = obs.id_ticket
GROUP BY o.id_obra, o.nombre_obra;

-- Vista: Observaciones con detalles
CREATE VIEW vista_observaciones_detalladas AS
SELECT 
    obs.id_observacion,
    obs.ubicacion_exacta,
    obs.descripcion_problema,
    obs.estado_observacion,
    obs.fecha_hallazgo,
    obs.fecha_registro,
    c.nombre_categoria,
    t.id_ticket,
    t.estado_general AS estado_ticket,
    o.nombre_obra,
    u.nombre AS nombre_usuario,
    COUNT(e.id_evidencia) AS total_evidencias
FROM observaciones obs
INNER JOIN categorias c ON obs.id_categoria = c.id_categoria
INNER JOIN tickets t ON obs.id_ticket = t.id_ticket
INNER JOIN obras o ON t.id_obra = o.id_obra
INNER JOIN usuarios u ON t.id_usuario = u.id_usuario
LEFT JOIN evidencias e ON obs.id_observacion = e.id_observacion
GROUP BY obs.id_observacion, obs.ubicacion_exacta, obs.descripcion_problema, 
         obs.estado_observacion, obs.fecha_hallazgo, obs.fecha_registro,
         c.nombre_categoria, t.id_ticket, t.estado_general, o.nombre_obra, u.nombre;
```

### 🔧 Uso de Vistas

```sql
-- Consultar tickets completos
SELECT * FROM vista_tickets_completos WHERE estado_general = 'Abierto';

-- Ver estadísticas de una obra
SELECT * FROM vista_estadisticas_obras WHERE id_obra = 1;

-- Buscar observaciones pendientes
SELECT * FROM vista_observaciones_detalladas 
WHERE estado_observacion IN ('Nuevo', 'En proceso');
```

---

## 4️⃣ Procedimientos Almacenados

### ✅ Tareas
- [ ] Procedimiento para crear ticket completo
- [ ] Procedimiento para obtener dashboard
- [ ] Procedimiento para reportes

### 📝 Código SQL

```sql
-- Procedimiento: Crear ticket con observaciones
DELIMITER //

CREATE PROCEDURE crear_ticket_completo(
    IN p_id_usuario INT,
    IN p_id_obra INT,
    IN p_observaciones JSON
)
BEGIN
    DECLARE v_id_ticket INT;
    DECLARE v_index INT DEFAULT 0;
    DECLARE v_total INT;
    
    -- Iniciar transacción
    START TRANSACTION;
    
    -- Crear ticket
    INSERT INTO tickets (id_usuario, id_obra, estado_general)
    VALUES (p_id_usuario, p_id_obra, 'Abierto');
    
    SET v_id_ticket = LAST_INSERT_ID();
    
    -- Obtener cantidad de observaciones
    SET v_total = JSON_LENGTH(p_observaciones);
    
    -- Insertar observaciones
    WHILE v_index < v_total DO
        INSERT INTO observaciones (
            id_ticket,
            id_categoria,
            ubicacion_exacta,
            descripcion_problema,
            fecha_hallazgo
        )
        VALUES (
            v_id_ticket,
            JSON_EXTRACT(p_observaciones, CONCAT('$[', v_index, '].id_categoria')),
            JSON_UNQUOTE(JSON_EXTRACT(p_observaciones, CONCAT('$[', v_index, '].ubicacion'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_observaciones, CONCAT('$[', v_index, '].descripcion'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_observaciones, CONCAT('$[', v_index, '].fecha_hallazgo')))
        );
        
        SET v_index = v_index + 1;
    END WHILE;
    
    -- Confirmar transacción
    COMMIT;
    
    -- Retornar ID del ticket creado
    SELECT v_id_ticket AS id_ticket;
END//

DELIMITER ;

-- Procedimiento: Obtener datos para dashboard
DELIMITER //

CREATE PROCEDURE obtener_dashboard(IN p_id_usuario INT, IN p_rol VARCHAR(50))
BEGIN
    -- Si es admin, mostrar todo
    IF p_rol = 'Admin' THEN
        SELECT 
            (SELECT COUNT(*) FROM tickets) AS total_tickets,
            (SELECT COUNT(*) FROM tickets WHERE estado_general = 'Abierto') AS tickets_abiertos,
            (SELECT COUNT(*) FROM observaciones WHERE estado_observacion = 'Nuevo') AS observaciones_nuevas,
            (SELECT COUNT(*) FROM observaciones WHERE estado_observacion = 'En proceso') AS observaciones_en_proceso,
            (SELECT COUNT(*) FROM observaciones WHERE estado_observacion = 'Terminado') AS observaciones_terminadas;
    ELSE
        -- Si es cliente, solo sus tickets
        SELECT 
            (SELECT COUNT(*) FROM tickets WHERE id_usuario = p_id_usuario) AS total_tickets,
            (SELECT COUNT(*) FROM tickets WHERE id_usuario = p_id_usuario AND estado_general = 'Abierto') AS tickets_abiertos,
            (SELECT COUNT(*) FROM observaciones obs 
             INNER JOIN tickets t ON obs.id_ticket = t.id_ticket 
             WHERE t.id_usuario = p_id_usuario AND obs.estado_observacion = 'Nuevo') AS observaciones_nuevas,
            (SELECT COUNT(*) FROM observaciones obs 
             INNER JOIN tickets t ON obs.id_ticket = t.id_ticket 
             WHERE t.id_usuario = p_id_usuario AND obs.estado_observacion = 'En proceso') AS observaciones_en_proceso,
            (SELECT COUNT(*) FROM observaciones obs 
             INNER JOIN tickets t ON obs.id_ticket = t.id_ticket 
             WHERE t.id_usuario = p_id_usuario AND obs.estado_observacion = 'Terminado') AS observaciones_terminadas;
    END IF;
END//

DELIMITER ;
```

### 🔧 Uso de Procedimientos

```sql
-- Crear ticket con observaciones
CALL crear_ticket_completo(
    1, -- id_usuario
    1, -- id_obra
    '[
        {"id_categoria": 1, "ubicacion": "Baño principal", "descripcion": "Fuga de agua", "fecha_hallazgo": "2026-04-15"},
        {"id_categoria": 2, "ubicacion": "Cocina", "descripcion": "Puerta descuadrada", "fecha_hallazgo": "2026-04-15"}
    ]'
);

-- Obtener dashboard
CALL obtener_dashboard(1, 'Cliente');
```

---

## 5️⃣ Datos de Prueba

### ✅ Tareas
- [ ] Insertar obras de ejemplo
- [ ] Insertar categorías
- [ ] Crear usuarios de prueba
- [ ] Crear tickets de ejemplo

### 📝 Código SQL

```sql
-- Insertar obras
INSERT INTO obras (nombre_obra, estado_obra) VALUES
('Edificio Los Robles', TRUE),
('Condominio Vista Mar', TRUE),
('Casa Particular - Av. Providencia 123', TRUE),
('Edificio Empresarial Torre Norte', TRUE);

-- Insertar categorías
INSERT INTO categorias (nombre_categoria, estado_categoria) VALUES
('Gasfitería', TRUE),
('Carpintería', TRUE),
('Electricidad', TRUE),
('Pintura', TRUE),
('Albañilería', TRUE),
('Cerrajería', TRUE),
('Vidriería', TRUE),
('Climatización', TRUE);

-- Insertar usuarios de prueba (contraseña temporal: 12345678-9)
-- Hash generado con bcrypt para "123456789"
INSERT INTO usuarios (nombre, correo, rut, password_hash, rol, telefono, primera_vez) VALUES
('Admin Sistema', 'admin@pitagora.cl', '11111111-1', '$2b$10$rKZLvXz5qVqX5qVqX5qVqOeKZLvXz5qVqX5qVqX5qVqX5qVqX5qVq', 'Admin', '+56912345678', FALSE),
('Juan Pérez', 'juan.perez@example.com', '12345678-9', '$2b$10$rKZLvXz5qVqX5qVqX5qVqOeKZLvXz5qVqX5qVqX5qVqX5qVqX5qVq', 'Cliente', '+56987654321', TRUE),
('María González', 'maria.gonzalez@example.com', '98765432-1', '$2b$10$rKZLvXz5qVqX5qVqX5qVqOeKZLvXz5qVqX5qVqX5qVqX5qVqX5qVq', 'Cliente', '+56911223344', TRUE),
('Pedro Silva', 'pedro.silva@example.com', '11223344-5', '$2b$10$rKZLvXz5qVqX5qVqX5qVqOeKZLvXz5qVqX5qVqX5qVqX5qVqX5qVq', 'Jefe de Obra', '+56955667788', FALSE);

-- Insertar tickets de ejemplo
INSERT INTO tickets (id_usuario, id_obra, estado_general) VALUES
(2, 1, 'Abierto'),
(3, 2, 'Abierto'),
(2, 3, 'Cerrado');

-- Insertar observaciones de ejemplo
INSERT INTO observaciones (id_ticket, id_categoria, ubicacion_exacta, descripcion_problema, estado_observacion, fecha_hallazgo) VALUES
(1, 1, 'Baño principal - Depto 301', 'Fuga de agua en llave del lavamanos', 'Nuevo', '2026-04-15 10:30:00'),
(1, 2, 'Dormitorio principal - Depto 301', 'Puerta del closet descuadrada', 'En proceso', '2026-04-15 10:45:00'),
(2, 3, 'Living - Casa 15', 'Enchufe sin corriente', 'Nuevo', '2026-04-14 15:20:00'),
(3, 4, 'Fachada exterior', 'Pintura descascarada', 'Terminado', '2026-04-10 09:00:00');

-- Insertar evidencias de ejemplo (URLs ficticias)
INSERT INTO evidencias (id_observacion, url_archivo) VALUES
(1, 'https://storage.googleapis.com/pitagora-evidencias/ticket1-obs1-foto1.jpg'),
(1, 'https://storage.googleapis.com/pitagora-evidencias/ticket1-obs1-foto2.jpg'),
(2, 'https://storage.googleapis.com/pitagora-evidencias/ticket1-obs2-foto1.jpg'),
(3, 'https://storage.googleapis.com/pitagora-evidencias/ticket2-obs1-foto1.jpg');
```

### 🔧 Verificar Datos

```sql
-- Ver todos los tickets con sus observaciones
SELECT * FROM vista_tickets_completos;

-- Ver estadísticas por obra
SELECT * FROM vista_estadisticas_obras;

-- Ver observaciones pendientes
SELECT * FROM vista_observaciones_detalladas 
WHERE estado_observacion IN ('Nuevo', 'En proceso');
```

---

## 6️⃣ Backup y Restauración

### ✅ Tareas
- [ ] Crear script de backup
- [ ] Documentar proceso de restauración
- [ ] Configurar backups automáticos

### 🔧 Comandos de Backup

```bash
# Backup completo de la base de datos
mysqldump -u root -p sistema_postventa_pitagora > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup solo de estructura (sin datos)
mysqldump -u root -p --no-data sistema_postventa_pitagora > estructura_$(date +%Y%m%d).sql

# Backup solo de datos
mysqldump -u root -p --no-create-info sistema_postventa_pitagora > datos_$(date +%Y%m%d).sql

# Backup de tablas específicas
mysqldump -u root -p sistema_postventa_pitagora usuarios tickets observaciones > backup_core_$(date +%Y%m%d).sql
```

### 🔧 Comandos de Restauración

```bash
# Restaurar desde backup
mysql -u root -p sistema_postventa_pitagora < backup_20260416_120000.sql

# Crear nueva base de datos y restaurar
mysql -u root -p -e "CREATE DATABASE sistema_postventa_pitagora_restore;"
mysql -u root -p sistema_postventa_pitagora_restore < backup_20260416_120000.sql
```

### 📝 Script de Backup Automático

```bash
#!/bin/bash
# Archivo: backup_automatico.sh

# Configuración
DB_USER="root"
DB_NAME="sistema_postventa_pitagora"
BACKUP_DIR="/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Crear directorio si no existe
mkdir -p $BACKUP_DIR

# Realizar backup
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Eliminar backups antiguos
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completado: backup_$DATE.sql.gz"
```

### ⚠️ Consideraciones
- Programar backups diarios con cron
- Guardar backups en ubicación segura (fuera del servidor)
- Probar restauraciones periódicamente
- Encriptar backups si contienen datos sensibles

---

## ✅ Checklist Final

- [ ] Índices creados y probados
- [ ] Triggers implementados
- [ ] Vistas creadas
- [ ] Procedimientos almacenados funcionando
- [ ] Datos de prueba insertados
- [ ] Script de backup configurado
- [ ] Proceso de restauración documentado
- [ ] Rendimiento verificado con EXPLAIN

---

## 🎯 Próximos Pasos

Continuar con:
- **[03_Backend_API.md](03_Backend_API.md)** - Endpoints completos del backend

---

**Última actualización:** 2026-04-16