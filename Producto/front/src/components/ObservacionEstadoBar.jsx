import React from 'react';

const ESTADOS = [
  'pendiente',
  'en observación',
  'aplica',
  'en proceso',
  'en espera aceptación',
  'terminado',
  'no aplica',
];

const ObservacionEstadoBar = ({
  nuevoEstado,
  onEstadoChange,
  estadoActual,
}) => {
  const currentIndex = ESTADOS.findIndex(
    (estado) => estado === (estadoActual?.toLowerCase() || '')
  );
  let availableEstados = currentIndex >= 0
    ? ESTADOS.slice(currentIndex)
    : ESTADOS;

  const aplicaIndex = ESTADOS.indexOf('aplica');
  const noAplicaIndex = ESTADOS.indexOf('no aplica');
  if (currentIndex >= aplicaIndex && currentIndex < noAplicaIndex) {
    availableEstados = availableEstados.filter((estado) => estado !== 'no aplica');
  }

  return (
    <div>
      <label className="form-label fw-bold text-muted small text-uppercase mb-1">
        ESTADO ACTUAL
      </label>
      <select
        className="form-select form-select-sm"
        value={nuevoEstado}
        onChange={(e) => onEstadoChange(e.target.value)}
        style={{ borderLeft: '4px solid #003860' }}
      >
        {availableEstados.map((estado) => (
          <option key={estado} value={estado}>
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ObservacionEstadoBar;
