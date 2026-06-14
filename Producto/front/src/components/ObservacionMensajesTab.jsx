import React, { useEffect, useMemo, useRef } from 'react';
import { Spinner } from 'react-bootstrap';
import { FaComments } from 'react-icons/fa';

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

const isMensajeChat = (item) => {
  if (item.tipo === 'notificacion') return false;
  return (
    item.tipo === 'mensaje_manual' ||
    item.idMensaje != null ||
    item.id_mensaje != null ||
    item.mensaje != null ||
    item.contenido != null ||
    item.urlArchivo != null ||
    item.url_archivo != null
  );
};

const ObservacionMensajesTab = ({
  mensajes,
  loadingMensajes,
  idUsuarioActual,
}) => {
  const endRef = useRef(null);
  const mensajesOrdenados = useMemo(
    () => (mensajes || []).filter(isMensajeChat),
    [mensajes]
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajesOrdenados.length, loadingMensajes]);

  const renderMensaje = (msg, index) => {
    const remitente = msg.remitente || '';
    const nombre =
      msg.nombreUsuario ||
      msg.nombre_usuario ||
      (remitente && !msg.apellidoPaterno && !msg.apellido_paterno ? remitente : 'Usuario');
    const apellido = msg.apellidoPaterno || msg.apellido_paterno || '';
    const texto = msg.mensaje ?? msg.contenido;
    const urlArchivo = msg.urlArchivo || msg.url_archivo;
    const idUsuarioMsg = msg.idUsuario || msg.id_usuario;
    const fecha = msg.fechaEnvio || msg.fecha_envio || msg.fecha;
    const esPropio = idUsuarioActual && idUsuarioMsg && String(idUsuarioMsg) === String(idUsuarioActual);

    return (
      <div
        key={`msg-${msg.idMensaje || msg.id_mensaje || index}`}
        className={`d-flex mb-3 ${esPropio ? 'justify-content-end' : 'justify-content-start'}`}
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
                {formatFecha(fecha)}
              </small>
            </div>

            {texto && (
              <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                {texto}
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
  };

  return (
    <div className="d-flex flex-column h-100">
      <div
        className="flex-grow-1 border rounded bg-white p-3"
        style={{ overflowY: 'auto' }}
      >
        {loadingMensajes ? (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" variant="primary" />
            <p className="mt-2 text-muted small mb-0">Cargando conversación...</p>
          </div>
        ) : mensajesOrdenados.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <FaComments className="mb-2" size={24} />
            <p className="mb-0 small">No hay mensajes aún. Escribe el primero abajo.</p>
          </div>
        ) : (
          mensajesOrdenados.map((item, index) => renderMensaje(item, index))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default ObservacionMensajesTab;
