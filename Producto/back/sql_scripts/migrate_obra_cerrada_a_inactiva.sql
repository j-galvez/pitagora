-- Renombra el estado de obra Cerrada -> Inactiva
UPDATE obras SET estado_obra = 'Inactiva' WHERE estado_obra = 'Cerrada';

ALTER TABLE obras MODIFY estado_obra
  ENUM('Activa','Garantía Vencida','Inactiva') DEFAULT 'Activa';
