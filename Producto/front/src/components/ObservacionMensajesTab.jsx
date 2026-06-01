import React, { useRef } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaPaperclip, FaPaperPlane, FaTimes, FaUser } from 'react-icons/fa';
import ObservacionEstadoBar from './ObservacionEstadoBar';

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
  observacion,
  mensajes,
  loadingMensajes,
  nuevoMensaje,
  previewImagen,
  enviandoMensaje,
  guardandoEstado,
  nuevoEstado,
  comentarioAdmin,
  onNuevoMensajeChange,
  onImagenSelect,
  onClearImagen,
  onEnviarMensaje,
  onEstadoChange,
  onComentarioChange,
  onGuardarEstado,
}) => {
  const fileInputRef = useRef(null);
  const mensajesOrdenados = [...mensajes].reverse();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImagenSelect(file);
    }
    e.target.value = '';
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '400px' }}>
      <ObservacionEstadoBar
        falla={observacion?.falla}
        nuevoEstado={nuevoEstado}
        comentarioAdmin={comentarioAdmin}
        onEstadoChange={onEstadoChange}
        onComentarioChange={onComentarioChange}
        onGuardar={onGuardarEstado}
        guardandoEstado={guardandoEstado}
      />

      <div
        className="flex-grow-1 border rounded bg-white mb-3 p-3"
        style={{ maxHeight: '300px', overflowY: 'auto' }}
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

            return (
              <div key={msg.idMensaje || msg.id_mensaje} className="mb-3 pb-3 border-bottom">
                <div className="d-flex align-items-start gap-2">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 36, height: 36, fontSize: '12px', fontWeight: 'bold' }}
                  >
                    {getIniciales(nombre, apellido)}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <strong style={{ fontSize: '13px' }}>
                        {nombre} {apellido}
                      </strong>
                      <small className="text-muted" style={{ fontSize: '11px' }}>
                        {formatFecha(msg.fechaEnvio || msg.fecha_envio)}
                      </small>
                    </div>
                    {(msg.mensaje) && (
                      <p className="mb-1 text-dark" style={{ fontSize: '14px' }}>
                        {msg.mensaje}
                      </p>
                    )}
                    {urlArchivo && (
                      <a href={urlArchivo} target="_blank" rel="noopener noreferrer">
                        <img
                          src={urlArchivo}
                          alt="Adjunto"
                          className="rounded border mt-1"
                          style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                        />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {previewImagen && (
        <div className="mb-2 position-relative d-inline-block">
          <img
            src={previewImagen}
            alt="Vista previa"
            className="rounded border"
            style={{ maxHeight: '80px', maxWidth: '120px', objectFit: 'cover' }}
          />
          <Button
            variant="danger"
            size="sm"
            className="position-absolute top-0 end-0 p-0 px-1"
            style={{ fontSize: '10px', lineHeight: 1.5 }}
            onClick={onClearImagen}
          >
            <FaTimes />
          </Button>
        </div>
      )}

      <div className="border rounded p-2 bg-light">
        <textarea
          className="form-control form-control-sm mb-2"
          rows={2}
          placeholder="Escribe un mensaje..."
          value={nuevoMensaje}
          onChange={(e) => onNuevoMensajeChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onEnviarMensaje();
            }
          }}
        />
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="d-none"
              onChange={handleFileChange}
            />
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              title="Adjuntar imagen"
            >
              <FaPaperclip className="me-1" /> Adjuntar
            </Button>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={onEnviarMensaje}
            disabled={enviandoMensaje}
          >
            {enviandoMensaje ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <FaPaperPlane className="me-1" /> Enviar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ObservacionMensajesTab;
