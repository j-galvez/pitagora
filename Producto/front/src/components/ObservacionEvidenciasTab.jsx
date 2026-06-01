import React from 'react';
import { Spinner } from 'react-bootstrap';
import { FaImages } from 'react-icons/fa';

const formatFecha = (fecha) => {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getNombreUsuario = (evidencia) => {
  const nombre = evidencia.nombreUsuario || evidencia.nombre_usuario;
  const apellido = evidencia.apellidoPaterno || evidencia.apellido_paterno;
  if (nombre) {
    return `${nombre} ${apellido || ''}`.trim();
  }
  return 'Usuario desconocido';
};

const ObservacionEvidenciasTab = ({ evidencias, loadingEvidencias }) => {
  if (loadingEvidencias) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Cargando evidencias...</p>
      </div>
    );
  }

  if (evidencias.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <FaImages size={40} className="mb-3 opacity-50" />
        <p className="mb-0">No hay evidencias registradas</p>
      </div>
    );
  }

  return (
    <div className="row row-cols-2 row-cols-md-3 g-3">
      {evidencias.map((ev) => {
        const url = ev.urlArchivo || ev.url_archivo;
        const id = ev.idEvidencia || ev.id_evidencia;

        return (
          <div key={id} className="col">
            <div className="card border-0 shadow-sm h-100 overflow-hidden">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                <div
                  style={{
                    height: '180px',
                    overflow: 'hidden',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  <img
                    src={url}
                    alt={`Evidencia ${id}`}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover', cursor: 'pointer' }}
                    onError={(e) => {
                      e.target.style.objectFit = 'contain';
                      e.target.style.padding = '1rem';
                    }}
                  />
                </div>
              </a>
              <div className="card-body p-2">
                <small className="text-muted d-block" style={{ fontSize: '11px' }}>
                  {formatFecha(ev.fechaSubida || ev.fecha_subida)}
                </small>
                <small className="fw-semibold text-dark d-block text-truncate" style={{ fontSize: '12px' }}>
                  {getNombreUsuario(ev)}
                </small>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ObservacionEvidenciasTab;
