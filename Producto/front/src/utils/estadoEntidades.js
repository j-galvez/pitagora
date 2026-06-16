export const esClienteActivo = (cliente) =>
  (cliente?.estado || 'Activo') === 'Activo';

export const esObraActiva = (obra) =>
  (obra?.estadoObra || obra?.estado_obra || 'Activa') === 'Activa';

export const esUsuarioActivo = (usuario) =>
  (usuario?.estado || 'Activo') === 'Activo';
