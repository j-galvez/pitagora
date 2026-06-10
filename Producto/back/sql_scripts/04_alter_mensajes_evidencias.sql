-- Migración: vincular mensajes con evidencias y simplificar tabla evidencias
-- Ejecutar en Cloud SQL sobre sistema_postventa_pitagora

USE sistema_postventa_pitagora;

-- Paso 1: Simplificar evidencias (eliminar columnas obsoletas)
ALTER TABLE evidencias
  DROP COLUMN tipo_archivo,
  DROP COLUMN momento;

-- Paso 2: Permitir mensajes solo con imagen (texto opcional)
ALTER TABLE mensajes
  MODIFY COLUMN mensaje TEXT NULL;

-- Paso 3: Vincular mensaje con evidencia (imagen en GCP)
ALTER TABLE mensajes
  ADD COLUMN id_evidencia INT NULL AFTER id_usuario,
  ADD KEY idx_id_evidencia (id_evidencia),
  ADD CONSTRAINT mensajes_ibfk_3
    FOREIGN KEY (id_evidencia) REFERENCES evidencias(id_evidencia)
    ON DELETE SET NULL;
