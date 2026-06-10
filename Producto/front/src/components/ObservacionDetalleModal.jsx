import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Spinner, Badge } from 'react-bootstrap';
import {
  FaTimes,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaClipboardList,
  FaTicketAlt,
  FaTag,
  FaUserCheck,
  FaInfoCircle,
  FaComments,
  FaImages,
  FaPaperclip,
  FaPaperPlane,
  FaTimes as FaTimesIcon,
} from 'react-icons/fa';
import { observacionesService } from '../services/observacionesService';
import { mensajesService } from '../services/mensajesService';
import { evidenciasService } from '../services/evidenciasService';
import ObservacionMensajesTab from './ObservacionMensajesTab';
import ObservacionEvidenciasTab from './ObservacionEvidenciasTab';
import ObservacionEstadoBar from './ObservacionEstadoBar';

const API_URL = 'http://localhost:8080/api';

const TABS = [
  { id: 'general', label: 'Información General', icon: FaInfoCircle },
  { id: 'mensajes', label: 'Mensajes', icon: FaComments },
  { id: 'evidencias', label: 'Evidencias', icon: FaImages },
];

const ObservacionDetalleModal = ({ show, onHide, idObservacion }) => {
  const [observacion, setObservacion] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('general');
  const [mensajes, setMensajes] = useState([]);
  const [evidencias, setEvidencias] = useState([]);
  const [loadingMensajes, setLoadingMensajes] = useState(false);
  const [loadingEvidencias, setLoadingEvidencias] = useState(false);

  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mensajeRapido, setMensajeRapido] = useState('');
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const [enviandoMensaje, setEnviandoMensaje] = useState(false);

  const [nuevoEstado, setNuevoEstado] = useState('');
  const [estadoOriginal, setEstadoOriginal] = useState('');

  const previewUrlRef = useRef(null);
  const fileInputRef = useRef(null);

  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {};
  const idUsuario = usuarioLogueado.idUsuario || usuarioLogueado.id_usuario;

  useEffect(() => {
    if (show && idObservacion) {
      setActiveTab('general');
      cargarDatos();
      cargarMensajes();
      cargarEvidencias();
    }
  }, [show, idObservacion]);

  const limpiarPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setImagenSeleccionada(null);
    setPreviewImagen(null);
  };

  const handleClose = () => {
    setObservacion(null);
    setCategoria(null);
    setError('');
    setActiveTab('general');
    setMensajes([]);
    setEvidencias([]);
    setNuevoMensaje('');
    setMensajeRapido('');
    limpiarPreview();
    setNuevoEstado('');
    setEstadoOriginal('');
    onHide();
  };

  const cargarDatos = async () => {
    setLoading(true);
    setError('');

    try {
      const obsData = await observacionesService.getObservacionById(idObservacion);
      setObservacion(obsData);
      const estado = obsData.estadoObservacion || obsData.estado_observacion || 'pendiente';
      setNuevoEstado(estado);
      setEstadoOriginal(estado);

      const idCategoria = obsData.idCategoria || obsData.id_categoria;
      if (idCategoria) {
        try {
          const res = await fetch(`${API_URL}/categorias/${idCategoria}`);
          if (res.ok) {
            setCategoria(await res.json());
          }
        } catch (catError) {
          console.warn('No se pudo cargar la categoría:', catError);
          setCategoria(null);
        }
      }
    } catch (err) {
      console.error('Error al cargar observación:', err);
      setError('Error al cargar los datos de la observación');
    } finally {
      setLoading(false);
    }
  };

  const cargarMensajes = async () => {
    setLoadingMensajes(true);
    try {
      const data = await mensajesService.getMensajesPorObservacion(idObservacion);
      setMensajes(data);
    } catch (err) {
      console.error('Error al cargar mensajes:', err);
    } finally {
      setLoadingMensajes(false);
    }
  };

  const cargarEvidencias = async () => {
    setLoadingEvidencias(true);
    try {
      const data = await evidenciasService.getEvidenciasPorObservacion(idObservacion);
      setEvidencias(data);
    } catch (err) {
      console.error('Error al cargar evidencias:', err);
    } finally {
      setLoadingEvidencias(false);
    }
  };

  const handleImagenSelect = (file) => {
    limpiarPreview();
    previewUrlRef.current = URL.createObjectURL(file);
    setImagenSeleccionada(file);
    setPreviewImagen(previewUrlRef.current);
  };

  const handleEnviarMensaje = async (texto, imagen) => {
    const mensajeTexto = (texto ?? nuevoMensaje).trim();
    const imagenFile = imagen !== undefined ? imagen : imagenSeleccionada;

    if (!mensajeTexto && !imagenFile) {
      return;
    }

    if (!idUsuario) {
      alert('No se pudo identificar al usuario. Inicia sesión nuevamente.');
      return;
    }

    // Confirmación y cambio de estado solo en pestaña Mensajes
    const estadoActual = (observacion?.estadoObservacion || observacion?.estado_observacion || estadoOriginal || '').toLowerCase();
    const estadoNuevo = (nuevoEstado || '').toLowerCase();

    if (activeTab === 'mensajes' && estadoActual && estadoNuevo && estadoActual !== estadoNuevo) {
      const ok = window.confirm(
        `El estado actual es \"${estadoActual}\" y el nuevo estado será \"${estadoNuevo}\". ¿Deseas continuar?`
      );
      if (!ok) return;
    }

    setEnviandoMensaje(true);
    try {
      await mensajesService.crearMensaje(
        { idObservacion, idUsuario, mensaje: mensajeTexto || null },
        imagenFile || null
      );

      if (activeTab === 'mensajes' && estadoActual && estadoNuevo && estadoActual !== estadoNuevo) {
        const idObs = observacion?.idObservacion || observacion?.id_observacion || idObservacion;
        const actualizada = await observacionesService.updateObservacion(idObs, {
          estadoObservacion: nuevoEstado,
        });
        setObservacion(actualizada);
        const nuevoEstadoPersistido = actualizada?.estadoObservacion || actualizada?.estado_observacion || nuevoEstado;
        setEstadoOriginal(nuevoEstadoPersistido);
      }

      setNuevoMensaje('');
      setMensajeRapido('');
      limpiarPreview();
      await Promise.all([cargarMensajes(), cargarEvidencias()]);
      setActiveTab('mensajes');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      alert(err.message || 'Error al enviar el mensaje');
    } finally {
      setEnviandoMensaje(false);
    }
  };

  const handleEnviarRapido = () => {
    const texto = mensajeRapido.trim();
    if (!texto) return;
    handleEnviarMensaje(texto, null);
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUrgenciaBadge = (urgencia) => {
    switch (urgencia?.toLowerCase()) {
      case 'alta':
        return <Badge bg="danger"><FaExclamationTriangle className="me-1" />Alta</Badge>;
      case 'media':
        return <Badge bg="warning" text="dark">Media</Badge>;
      case 'baja':
        return <Badge bg="info">Baja</Badge>;
      default:
        return <Badge bg="secondary">{urgencia || 'Sin urgencia'}</Badge>;
    }
  };

  const getEstadoObservacionBadge = (estado) => {
    const estadoLower = estado?.toLowerCase();
    const badges = {
      pendiente: { bg: 'secondary', icon: <FaClock className="me-1" /> },
      'en observación': { bg: 'info', icon: <FaClock className="me-1" /> },
      aplica: { bg: 'primary', icon: <FaCheckCircle className="me-1" /> },
      'en proceso': { bg: 'warning', text: 'dark', icon: <FaClock className="me-1" /> },
      'en espera aceptación': { bg: 'warning', text: 'dark', icon: <FaClock className="me-1" /> },
      terminado: { bg: 'success', icon: <FaCheckCircle className="me-1" /> },
      'no aplica': { bg: 'dark', icon: <FaExclamationTriangle className="me-1" /> },
    };
    const badge = badges[estadoLower] || { bg: 'secondary', icon: null };
    return (
      <Badge bg={badge.bg} text={badge.text}>
        {badge.icon}
        {estado || 'Sin estado'}
      </Badge>
    );
  };

  const getConfirmacionBadge = (confirmacion) => {
    switch (confirmacion?.toLowerCase()) {
      case 'aceptado':
        return <Badge bg="success">Aceptado</Badge>;
      case 'rechazado':
        return <Badge bg="danger">Rechazado</Badge>;
      default:
        return <Badge bg="secondary">Pendiente</Badge>;
    }
  };

  const obs = observacion;

  const renderGeneralTab = () => (
    <>
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-0">Información General</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="d-flex align-items-start">
                <FaClipboardList className="text-primary me-2 mt-1" />
                <div>
                  <small className="text-muted d-block">Falla</small>
                  <strong>{obs.falla || '-'}</strong>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-start">
                <FaTicketAlt className="text-primary me-2 mt-1" />
                <div>
                  <small className="text-muted d-block">Ticket Asociado</small>
                  <strong>#{obs.idTicket || obs.id_ticket || '-'}</strong>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-start">
                <FaMapMarkerAlt className="text-primary me-2 mt-1" />
                <div>
                  <small className="text-muted d-block">Ubicación Exacta</small>
                  <strong>{obs.ubicacionExacta || obs.ubicacion_exacta || '-'}</strong>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-start">
                <FaTag className="text-primary me-2 mt-1" />
                <div>
                  <small className="text-muted d-block">Categoría</small>
                  <strong>
                    {categoria?.nombreCategoria || categoria?.nombre_categoria ||
                      (obs.idCategoria || obs.id_categoria
                        ? `Cat. #${obs.idCategoria || obs.id_categoria}`
                        : '-')}
                  </strong>
                  {categoria?.subcategoria && (
                    <small className="text-muted d-block">{categoria.subcategoria}</small>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <small className="text-muted d-block">Urgencia</small>
              {getUrgenciaBadge(obs.urgencia)}
            </div>
            <div className="col-md-6">
              <small className="text-muted d-block">Estado de Reparación</small>
              {getEstadoObservacionBadge(obs.estadoObservacion || obs.estado_observacion)}
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-0">Descripción del Problema</h5>
        </div>
        <div className="card-body">
          <p className="mb-0">
            {obs.descripcionProblema || obs.descripcion_problema || 'Sin descripción'}
          </p>
        </div>
      </div>

      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            <FaUserCheck className="me-2" />
            Confirmación del Cliente
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <small className="text-muted d-block">Estado de Confirmación</small>
              {getConfirmacionBadge(obs.confirmacionCliente || obs.confirmacion_cliente)}
            </div>
            <div className="col-md-6">
              <small className="text-muted d-block">Fecha de Confirmación</small>
              <strong>{formatFecha(obs.fechaConfirmacion || obs.fecha_confirmacion)}</strong>
            </div>
            {(obs.comentarioCliente || obs.comentario_cliente) && (
              <div className="col-md-12">
                <small className="text-muted d-block">Comentario del Cliente</small>
                <p className="mb-0 mt-1 p-3 bg-light rounded">
                  {obs.comentarioCliente || obs.comentario_cliente}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-0">Seguimiento</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <small className="text-muted d-block">Fecha de Registro</small>
              <strong>
                <FaClock className="me-1 text-muted" />
                {formatFecha(obs.fechaRegistro || obs.fecha_registro)}
              </strong>
            </div>
            <div className="col-md-4">
              <small className="text-muted d-block">Fecha de Término</small>
              <strong>
                <FaCheckCircle className="me-1 text-muted" />
                {formatFecha(obs.fechaTermino || obs.fecha_termino)}
              </strong>
            </div>
            <div className="col-md-4">
              <small className="text-muted d-block">Intentos de Recordatorio</small>
              <strong>{obs.intentosRecordatorio ?? obs.intentos_recordatorio ?? 0}</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header className="bg-primary text-white border-0 pb-2">
        <Modal.Title>
          <FaClipboardList className="me-2" />
          Detalle de Observación
          {obs && ` #${obs.idObservacion || obs.id_observacion}`}
        </Modal.Title>
        <Button variant="link" className="text-white" onClick={handleClose}>
          <FaTimes size={20} />
        </Button>
      </Modal.Header>

      {!loading && !error && obs && (
        <div className="px-3 pt-2 pb-0 bg-white border-bottom">
          <div className="d-flex gap-1 flex-wrap">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={`btn btn-sm px-3 ${activeTab === id ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => setActiveTab(id)}
              >
                <Icon className="me-1" style={{ fontSize: '12px' }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <Modal.Body style={{ minHeight: '60vh', maxHeight: '60vh', overflowY: 'auto' }}>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Cargando información...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : obs ? (
          <>
            {activeTab === 'general' && renderGeneralTab()}
            {activeTab === 'mensajes' && (
              <ObservacionMensajesTab
                mensajes={mensajes}
                loadingMensajes={loadingMensajes}
                idUsuarioActual={idUsuario}
              />
            )}
            {activeTab === 'evidencias' && (
              <ObservacionEvidenciasTab
                evidencias={evidencias}
                loadingEvidencias={loadingEvidencias}
              />
            )}
          </>
        ) : null}
      </Modal.Body>

      <Modal.Footer className="d-flex flex-column gap-2 align-items-stretch">
        {activeTab === 'mensajes' ? (
          <>
            <ObservacionEstadoBar
              nuevoEstado={nuevoEstado}
              onEstadoChange={setNuevoEstado}
              estadoActual={observacion?.estadoObservacion || observacion?.estado_observacion || estadoOriginal}
            />

            {previewImagen && (
              <div className="d-flex align-items-center gap-2">
                <div className="position-relative d-inline-block">
                  <img
                    src={previewImagen}
                    alt="Vista previa"
                    className="rounded border"
                    style={{ maxHeight: '60px', maxWidth: '90px', objectFit: 'cover' }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0 p-0 px-1"
                    style={{ fontSize: '10px', lineHeight: 1.5 }}
                    onClick={limpiarPreview}
                    title="Quitar imagen"
                  >
                    <FaTimesIcon />
                  </Button>
                </div>
                <small className="text-muted">Imagen lista para enviar</small>
              </div>
            )}

            <textarea
              className="form-control form-control-sm"
              rows={2}
              placeholder="Escribe un mensaje..."
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleEnviarMensaje();
                }
              }}
              disabled={enviandoMensaje || !obs}
            />

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImagenSelect(file);
                    }
                    e.target.value = '';
                  }}
                />
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={enviandoMensaje || !obs}
                  title="Adjuntar imagen"
                >
                  <FaPaperclip className="me-1" /> Adjuntar
                </Button>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEnviarMensaje()}
                  disabled={enviandoMensaje || (!nuevoMensaje.trim() && !imagenSeleccionada) || !obs}
                >
                  {enviandoMensaje ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      <FaPaperPlane className="me-1" /> Enviar
                    </>
                  )}
                </Button>
                <Button variant="secondary" size="sm" onClick={handleClose}>
                  Cerrar
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="d-flex flex-wrap gap-2 align-items-center w-100">
            <input
              type="text"
              className="form-control form-control-sm flex-grow-1"
              placeholder="Escribe un mensaje rápido..."
              value={mensajeRapido}
              onChange={(e) => setMensajeRapido(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleEnviarRapido();
                }
              }}
              disabled={enviandoMensaje || !obs}
              style={{ minWidth: '180px' }}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleEnviarRapido}
              disabled={enviandoMensaje || !mensajeRapido.trim() || !obs}
            >
              {enviandoMensaje ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <>
                  <FaPaperPlane className="me-1" /> Enviar
                </>
              )}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleClose}>
              Cerrar
            </Button>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ObservacionDetalleModal;
