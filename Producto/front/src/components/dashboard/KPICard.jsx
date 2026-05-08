import React from 'react';
import PropTypes from 'prop-types';

const KPICard = ({ titulo, valor, icono, color = 'primary' }) => {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-uppercase text-secondary small mb-1 fw-semibold">
              {titulo}
            </p>
            <h2 className={`display-6 mb-0 fw-bold text-${color}`}>
              {valor !== null && valor !== undefined ? valor : '-'}
            </h2>
          </div>
          {icono && (
            <div className={`fs-1 text-${color} opacity-25`}>
              {icono}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

KPICard.propTypes = {
  titulo: PropTypes.string.isRequired,
  valor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  icono: PropTypes.element,
  color: PropTypes.string
};

export default KPICard;

// Made with Bob
