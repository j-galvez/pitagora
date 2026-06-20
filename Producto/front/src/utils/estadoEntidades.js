export const esClienteActivo = (clienteOrEstado) => {
  if (!clienteOrEstado) return false;
  const estado =
    typeof clienteOrEstado === 'string'
      ? clienteOrEstado
      : clienteOrEstado.estado || 'Activo';
  return estado === 'Activo';
};

export const esObraActiva = (obra) =>
  (obra?.estadoObra || obra?.estado_obra || 'Activa') === 'Activa';

export const esUsuarioActivo = (usuario) =>
  (usuario?.estado || 'Activo') === 'Activo';

export const puedeCrearTicketOuObservacion = (obra) => {
  if (!obra) return false;
  const estadoCliente = obra.estadoCliente || obra.estado_cliente || 'Activo';
  return esObraActiva(obra) && estadoCliente === 'Activo';
};

export const mensajeBloqueoCreacion = (obra) => {
  if (!obra) return 'No se pueden crear nuevas solicitudes en este momento.';

  const estadoObra = obra.estadoObra || obra.estado_obra || 'Activa';
  const estadoCliente = obra.estadoCliente || obra.estado_cliente || 'Activo';
  const nombreObra = obra.nombreObra || obra.nombre_obra || 'Tu obra';

  if (estadoCliente !== 'Activo') {
    const nombreCliente = obra.nombreEmpresa || obra.nombre_empresa || 'El cliente';
    return `${nombreCliente} está inactivo. No puedes crear nuevos tickets ni observaciones. Puedes consultar tus solicitudes existentes.`;
  }

  if (estadoObra !== 'Activa') {
    return `"${nombreObra}" tiene estado "${estadoObra}". No puedes crear nuevos tickets ni observaciones. Puedes consultar tus solicitudes existentes.`;
  }

  return '';
};
