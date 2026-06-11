-- Tabla de desglose de costos por observación
USE sistema_postventa_pitagora;

CREATE TABLE IF NOT EXISTS costos_observacion (
  id_costo INT NOT NULL AUTO_INCREMENT,
  id_observacion INT NOT NULL,
  monto BIGINT NOT NULL DEFAULT 0,
  descripcion VARCHAR(255) NOT NULL,
  id_usuario INT DEFAULT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_costo),
  KEY idx_id_observacion (id_observacion),
  CONSTRAINT fk_costos_observacion
    FOREIGN KEY (id_observacion) REFERENCES observaciones(id_observacion) ON DELETE CASCADE,
  CONSTRAINT fk_costos_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);
