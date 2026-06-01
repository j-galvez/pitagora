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
}) => {
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
        {ESTADOS.map((estado) => (
          <option key={estado} value={estado}>
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ObservacionEstadoBar;
