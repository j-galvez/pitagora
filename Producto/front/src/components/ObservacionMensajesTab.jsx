import React, { useEffect, useMemo, useRef } from 'react';
import { Spinner, Badge } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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

const getTipoNotificacionLabel = (tipo) => {
  const tipos = {
    'nueva_observacion': 'Nueva Observación',
    'cambio_estado': 'Cambio de Estado',
    'nuevo_mensaje': 'Nuevo Mensaje',
    'recordatorio': 'Recordatorio',
    'rechazo_aceptacion': 'Rechazo de Solución',
  };
  return tipos[tipo] || tipo;
};

const ObservacionMensajesTab = ({
  mensajes,
  loadingMensajes,
  idUsuarioActual,
}) => {
  const endRef = useRef(null);
  const mensajesOrdenados = useMemo(() => mensajes || [], [mensajes]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajesOrdenados.length, loadingMensajes]);

  const renderMensajeManual = (msg, index) => {
    const nombre = msg.nombreUsuario || msg.nombre_usuario || 'Usuario';
    const apellido = msg.apellidoPaterno || msg.apellido_paterno || '';
    const urlArchivo = msg.urlArchivo || msg.url_archivo;
    const idUsuarioMsg = msg.idUsuario || msg.id_usuario;
    const esPropio = idUsuarioActual && idUsuarioMsg && String(idUsuarioMsg) === String(idUsuarioActual);

    return (
      <div
        key={`msg-${msg.idMensaje || msg.id_mensaje}`}
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
  };

  const renderNotificacion = (notif) => {
    const esEnviado = notif.rol === 'sistema';
    return (
      <div
        key={`notif-${notif.fecha}`}
        className={`d-flex mb-3 ${esEnviado ? 'justify-content-start' : 'justify-content-end'}`}
      >
        <div
          className={`d-flex align-items-start gap-2`}
          style={{ maxWidth: '85%' }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-secondary text-white"
            style={{ width: 32, height: 32, fontSize: '14px' }}
            title="Notificación del Sistema"
          >
            <FaEnvelope />
          </div>

          <div
            className="px-3 py-2 rounded-3 shadow-sm bg-light text-dark"
            style={{
              borderTopLeftRadius: 0,
              border: '1px solid #dee2e6',
              backgroundColor: '#f8f9fa',
            }}
          >
            <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
              <div>
                <strong style={{ fontSize: '12px' }}>
                  {getTipoNotificacionLabel(notif.contenido.split('(')[0].trim())}
                </strong>
                <br />
                <small className="text-muted" style={{ fontSize: '10px' }}>
                  Para: {notif.remitente}
                </small>
              </div>
              <small className="text-muted" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                {formatFecha(notif.fecha)}
              </small>
            </div>

            {notif.asunto && (
              <div style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '4px' }}>
                <strong>Asunto:</strong> {notif.asunto}
              </div>
            )}

            {notif.aceptado && (
              <div className="d-flex align-items-center gap-2 mt-2">
                <FaCheckCircle className="text-success" size={14} />
                <span style={{ fontSize: '11px', color: '#28a745' }}>Aceptado por cliente</span>
              </div>
            )}
            {notif.rechazado && (
              <div className="d-flex align-items-center gap-2 mt-2">
                <FaTimesCircle className="text-danger" size={14} />
                <span style={{ fontSize: '11px', color: '#dc3545' }}>Rechazado por cliente</span>
              </div>
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
            <FaUser className="mb-2" size={24} />
            <p className="mb-0 small">No hay mensajes aún. Las notificaciones aparecerán aquí.</p>
          </div>
        ) : (
          mensajesOrdenados.map((item, index) => {
            if (item.tipo === 'mensaje_manual') {
              return renderMensajeManual(item, index);
            } else if (item.tipo === 'notificacion') {
              return renderNotificacion(item);
            }
            return null;
          })
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default ObservacionMensajesTab;
