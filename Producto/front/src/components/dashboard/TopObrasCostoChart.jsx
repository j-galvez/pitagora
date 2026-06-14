import React from 'react';
import PropTypes from 'prop-types';

const formatMoneda = (valor) => {
  if (valor === null || valor === undefined) return '$ 0';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(valor);
};

const TopObrasCostoChart = ({ datos }) => {
  if (!datos || datos.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Top 5 Obras con Mayor Costo</h5>
          <p className="text-muted text-center py-4">No hay costos registrados</p>
        </div>
      </div>
    );
  }

  const maxMonto = Math.max(...datos.map((item) => item.montoTotal));

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-4">Top 5 Obras con Mayor Costo</h5>
        <div className="d-flex flex-column gap-3">
          {datos.map((obra, index) => {
            const porcentaje = maxMonto > 0 ? (obra.montoTotal / maxMonto) * 100 : 0;
            const colores = ['primary', 'info', 'success', 'warning', 'secondary'];
            const color = colores[index % colores.length];

            return (
              <div key={obra.idObra ?? index}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="small fw-semibold text-truncate" style={{ maxWidth: '70%' }}>
                    {obra.nombreObra}
                  </span>
                  <span className={`badge bg-${color}`}>
                    {formatMoneda(obra.montoTotal)}
                  </span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className={`progress-bar bg-${color}`}
                    role="progressbar"
                    style={{ width: `${porcentaje}%` }}
                    aria-valuenow={obra.montoTotal}
                    aria-valuemin="0"
                    aria-valuemax={maxMonto}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

TopObrasCostoChart.propTypes = {
  datos: PropTypes.arrayOf(
    PropTypes.shape({
      idObra: PropTypes.number,
      nombreObra: PropTypes.string.isRequired,
      montoTotal: PropTypes.number.isRequired
    })
  )
};

export default TopObrasCostoChart;
