import React, { useEffect, useMemo, useRef } from 'react';
import { Spinner } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';

const formatFecha = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getIniciales = (nombre, apellido) => {
  const n = nombre?.charAt(0) || '';
  const a = apellido?.charAt(0) || '';
  return (n + a).toUpperCase() || '?';
};

const ObservacionMensajesTab = ({
  mensajes,
  loadingMensajes,
  idUsuarioActual,
}) => {
  const endRef = useRef(null);
  const mensajesOrdenados = useMemo(() => mensajes, [mensajes]); // backend ya viene ASC (antiguo -> nuevo)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajesOrdenados.length, loadingMensajes]);

  return (
    <div className="d-flex flex-column h-100">
      <div
        className="flex-grow-1 border rounded bg-white p-3"
        style={{ overflowY: 'auto' }}
      >
        {loadingMensajes ? (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" variant="primary" />
            <p className="mt-2 text-muted small mb-0">Cargando mensajes...</p>
          </div>
        ) : mensajesOrdenados.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <FaUser className="mb-2" size={24} />
            <p className="mb-0 small">No hay mensajes aún. Sé el primero en escribir.</p>
          </div>
        ) : (
          mensajesOrdenados.map((msg) => {
            const nombre = msg.nombreUsuario || msg.nombre_usuario || 'Usuario';
            const apellido = msg.apellidoPaterno || msg.apellido_paterno || '';
            const urlArchivo = msg.urlArchivo || msg.url_archivo;
            const idUsuarioMsg = msg.idUsuario || msg.id_usuario;
            const esPropio = idUsuarioActual && idUsuarioMsg && String(idUsuarioMsg) === String(idUsuarioActual);

            return (
              <div
                key={msg.idMensaje || msg.id_mensaje}
                className={`d-flex mb-2 ${esPropio ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  className={`d-flex align-items-start gap-2 ${esPropio ? 'flex-row-reverse' : ''}`}
                  style={{ maxWidth: '85%' }}
                >
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${esPropio ? 'bg-dark text-white' : 'bg-primary text-white'}`}
                    style={{ width: 32, height: 32, fontSize: '11px', fontWeight: 'bold' }}
                    title={`${nombre} ${apellido}`.trim()}
                  >
                    {getIniciales(nombre, apellido)}
                  </div>

                  <div
                    className={`px-3 py-2 rounded-3 shadow-sm ${esPropio ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                    style={{
                      borderTopRightRadius: esPropio ? 0 : undefined,
                      borderTopLeftRadius: esPropio ? undefined : 0,
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start gap-3 mb-1">
                      {!esPropio && (
                        <strong style={{ fontSize: '12px' }}>
                          {nombre} {apellido}
                        </strong>
                      )}
                      <small className={`${esPropio ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '11px' }}>
                        {formatFecha(msg.fechaEnvio || msg.fecha_envio)}
                      </small>
                    </div>

                    {msg.mensaje && (
                      <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                        {msg.mensaje}
                      </div>
                    )}

                    {urlArchivo && (
                      <a href={urlArchivo} target="_blank" rel="noopener noreferrer">
                        <img
                          src={urlArchivo}
                          alt="Adjunto"
                          className="rounded border mt-2"
                          style={{ maxWidth: '240px', maxHeight: '180px', objectFit: 'cover' }}
                        />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default ObservacionMensajesTab;
