import React from 'react';

export default function CardObservacion({ observacion, onVerDetalle }) {
  const estadoObservacion = observacion.estadoObservacion || observacion.estado_observacion;
  const ubicacion = observacion.ubicacionExacta || observacion.ubicacion_exacta;
  const descripcion = observacion.descripcionProblema || observacion.descripcion_problema;
  const confirmacion = observacion.confirmacionCliente || observacion.confirmacion_cliente;
  const categoriaNombre =
    observacion.categoria?.nombreCategoria ||
    observacion.categoria?.nombre_categoria ||
    'N/A';

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

  const idObservacion = observacion.idObservacion || observacion.id_observacion;

  return (
    <div
      className="card mb-3 shadow-sm border-0"
      style={onVerDetalle ? { cursor: 'pointer' } : undefined}
      onClick={onVerDetalle ? () => onVerDetalle(idObservacion) : undefined}
      onKeyDown={onVerDetalle ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onVerDetalle(idObservacion);
        }
      } : undefined}
      role={onVerDetalle ? 'button' : undefined}
      tabIndex={onVerDetalle ? 0 : undefined}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="card-title text-primary mb-0" style={{ color: '#003860', fontWeight: 'bold' }}>
            {observacion.falla}
          </h6>
          <div>
            <span className="badge me-2" style={getBadgeStyle('estado', estadoObservacion)}>
              {estadoObservacion}
            </span>
            <span className="badge" style={getBadgeStyle('urgencia', observacion.urgencia)}>
              {observacion.urgencia}
            </span>
          </div>
        </div>
        
        <p className="text-muted small mb-1">
          <i className="bi bi-geo-alt-fill me-1"></i> {ubicacion}
        </p>
        <p className="text-muted small mb-1">
          <strong>Categoría:</strong> {categoriaNombre}
        </p>
        <p className="card-text small mt-2">
          {descripcion}
        </p>

        {confirmacion && (
          <div className="mt-3 pt-2 border-top">
            <small className="text-secondary">
              Confirmación cliente: <strong>{confirmacion}</strong>
            </small>
          </div>
        )}

        {onVerDetalle && (
          <div className="mt-3 pt-2 border-top d-flex justify-content-end">
            <small className="text-primary fw-semibold">
              <i className="bi bi-eye me-1"></i>
              Ver detalle, mensajes y evidencias
            </small>
          </div>
        )}
      </div>
    </div>
  );
}