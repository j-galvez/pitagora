import React from 'react';
import PropTypes from 'prop-types';

const TopFallasChart = ({ datos }) => {
  if (!datos || datos.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Top 5 Fallas Más Reportadas</h5>
          <p className="text-muted text-center py-4">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  // Calcular el máximo para escalar las barras
  const maxCantidad = Math.max(...datos.map(item => item.cantidad));

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-4">Top 5 Fallas Más Reportadas</h5>
        <div className="d-flex flex-column gap-3">
          {datos.map((falla, index) => {
            const porcentaje = (falla.cantidad / maxCantidad) * 100;
            const colores = ['primary', 'info', 'success', 'warning', 'secondary'];
            const color = colores[index % colores.length];
            
            return (
              <div key={index}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="small fw-semibold text-truncate" style={{ maxWidth: '70%' }}>
                    {falla.nombreCategoria}
                  </span>
                  <span className={`badge bg-${color}`}>
                    {falla.cantidad}
                  </span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className={`progress-bar bg-${color}`}
                    role="progressbar"
                    style={{ width: `${porcentaje}%` }}
                    aria-valuenow={falla.cantidad}
                    aria-valuemin="0"
                    aria-valuemax={maxCantidad}
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

TopFallasChart.propTypes = {
  datos: PropTypes.arrayOf(
    PropTypes.shape({
      nombreCategoria: PropTypes.string.isRequired,
      cantidad: PropTypes.number.isRequired
    })
  )
};

export default TopFallasChart;

// Made with Bob
