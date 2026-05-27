import React, { useState, useEffect } from 'react';
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
  FaUserCheck
} from 'react-icons/fa';
import { observacionesService } from '../services/observacionesService';

const API_URL = 'http://localhost:8080/api';

const ObservacionDetalleModal = ({ show, onHide, idObservacion }) => {
  const [observacion, setObservacion] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show && idObservacion) {
      cargarDatos();
    }
  }, [show, idObservacion]);

  const handleClose = () => {
    setObservacion(null);
    setCategoria(null);
    setError('');
    onHide();
  };

  const cargarDatos = async () => {
    setLoading(true);
    setError('');

    try {
      const obsData = await observacionesService.getObservacionById(idObservacion);
      setObservacion(obsData);

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

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      'pendiente': { bg: 'secondary', icon: <FaClock className="me-1" /> },
      'en observación': { bg: 'info', icon: <FaClock className="me-1" /> },
      'aplica': { bg: 'primary', icon: <FaCheckCircle className="me-1" /> },
      'en proceso': { bg: 'warning', text: 'dark', icon: <FaClock className="me-1" /> },
      'en espera aceptación': { bg: 'warning', text: 'dark', icon: <FaClock className="me-1" /> },
      'terminado': { bg: 'success', icon: <FaCheckCircle className="me-1" /> },
      'no aplica': { bg: 'dark', icon: <FaExclamationTriangle className="me-1" /> }
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

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header className="bg-primary text-white">
        <Modal.Title>
          <FaClipboardList className="me-2" />
          Detalle de Observación
          {obs && ` #${obs.idObservacion || obs.id_observacion}`}
        </Modal.Title>
        <Button variant="link" className="text-white" onClick={handleClose}>
          <FaTimes size={20} />
        </Button>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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
                            (obs.idCategoria || obs.id_categoria ? `Cat. #${obs.idCategoria || obs.id_categoria}` : '-')}
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
        ) : null}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ObservacionDetalleModal;
