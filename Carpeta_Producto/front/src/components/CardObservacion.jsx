import React from 'react';

export default function CardObservacion({ observacion }) {
  // Función para definir colores según el estado y urgencia
  const getBadgeStyle = (tipo, valor) => {
    if (tipo === 'urgencia') {
      switch (valor) {
        case 'alta': return { backgroundColor: '#ED1C25', color: '#FFFFFF' };
        case 'media': return { backgroundColor: '#91ABC6', color: '#003860' };
        default: return { backgroundColor: '#E0E0E0', color: '#333333' };
      }
    }
    // Estado de la observación
    switch (valor) {
      case 'en proceso': return { backgroundColor: '#003860', color: '#FFFFFF' };
      case 'terminado': return { backgroundColor: '#28A745', color: '#FFFFFF' };
      default: return { backgroundColor: '#FFC107', color: '#000000' };
    }
  };

  return (
    <div className="card mb-3 shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="card-title text-primary mb-0" style={{ color: '#003860', fontWeight: 'bold' }}>
            {observacion.falla}
          </h6>
          <div>
            <span className="badge me-2" style={getBadgeStyle('estado', observacion.estado_observacion)}>
              {observacion.estado_observacion}
            </span>
            <span className="badge" style={getBadgeStyle('urgencia', observacion.urgencia)}>
              {observacion.urgencia}
            </span>
          </div>
        </div>
        
        <p className="text-muted small mb-1">
          <i className="bi bi-geo-alt-fill me-1"></i> {observacion.ubicacion_exacta}
        </p>
        <p className="text-muted small mb-1">
          <strong>Categoría:</strong> {observacion.categoria?.nombre_categoria || 'N/A'}
        </p>
        <p className="card-text small mt-2">
          {observacion.descripcion_problema}
        </p>

        {observacion.confirmacion_cliente && (
          <div className="mt-3 pt-2 border-top">
            <small className="text-secondary">
              Confirmación cliente: <strong>{observacion.confirmacion_cliente}</strong>
            </small>
          </div>
        )}
      </div>
    </div>
  );
}