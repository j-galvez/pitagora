import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';

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
  falla,
  nuevoEstado,
  comentarioAdmin,
  onEstadoChange,
  onComentarioChange,
  onGuardar,
  guardandoEstado,
}) => {
  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-header bg-light py-2">
        <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Actualizar Estado</h6>
      </div>
      <div className="card-body p-3">
        {falla && (
          <div className="mb-2">
            <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '11px' }}>
              Falla / Observación
            </small>
            <div className="p-2 bg-light rounded border text-primary fw-bold" style={{ fontSize: '13px' }}>
              {falla}
            </div>
          </div>
        )}

        <div className="mb-2">
          <label className="form-label fw-bold text-muted small text-uppercase mb-1">
            Nuevo Estado
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

        <div className="mb-3">
          <label className="form-label fw-bold text-muted small text-uppercase mb-1">
            Comentario Administrativo
          </label>
          <textarea
            className="form-control form-control-sm"
            rows={3}
            placeholder="Describe el avance o motivo del cambio de estado..."
            value={comentarioAdmin}
            onChange={(e) => onComentarioChange(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-end">
          <Button
            variant="primary"
            size="sm"
            onClick={onGuardar}
            disabled={guardandoEstado}
          >
            {guardandoEstado ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Guardando...
              </>
            ) : (
              <>
                <FaSave className="me-1" /> Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ObservacionEstadoBar;
