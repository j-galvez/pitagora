import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaArrowLeft, FaPlus, FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { ticketsService } from '../../services/ticketsService';
import { observacionesService } from '../../services/observacionesService';

const DetalleTicket = () => {
  const navigate = useNavigate();
  const { id_ticket } = useParams();
  
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  const [ticket, setTicket] = useState(null);
  const [observaciones, setObservaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDatos();
  }, [id_ticket]);

  const cargarDatos = async () => {
    setLoading(true);
    setError('');

    try {
      // Cargar ticket
      const ticketData = await ticketsService.getTicketById(id_ticket);
      setTicket(ticketData);

      // Cargar observaciones del ticket
      const observacionesData = await observacionesService.getObservacionesByTicket(id_ticket);
      setObservaciones(observacionesData);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los datos del ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/admin/tickets');
  };

  const handleAgregarObservacion = () => {
    navigate(`/crear-observacion/${id_ticket}`);
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'abierto':
        return 'bg-primary';
      case 'en proceso':
        return 'bg-warning text-dark';
      case 'terminado':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  const getUrgenciaBadgeClass = (urgencia) => {
    switch (urgencia?.toLowerCase()) {
      case 'alta':
        return 'bg-danger';
      case 'media':
        return 'bg-warning text-dark';
      case 'baja':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  const getEstadoObservacionBadge = (estado) => {
    const estadoLower = estado?.toLowerCase();
    const badges = {
      'pendiente': { class: 'bg-secondary', icon: <FaClock /> },
      'en observación': { class: 'bg-info', icon: <FaClock /> },
      'aplica': { class: 'bg-primary', icon: <FaCheckCircle /> },
      'en proceso': { class: 'bg-warning text-dark', icon: <FaClock /> },
      'en espera aceptación': { class: 'bg-warning text-dark', icon: <FaClock /> },
      'terminado': { class: 'bg-success', icon: <FaCheckCircle /> },
      'no aplica': { class: 'bg-dark', icon: <FaExclamationTriangle /> }
    };
    return badges[estadoLower] || { class: 'bg-secondary', icon: null };
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

  if (loading) {
    return (
      <AdminLayout 
        usuario={usuarioLogueado} 
        titulo="Detalle del Ticket" 
        handleVolver={handleVolver}
      >
        <div className="container py-4 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <div className="mt-2">Cargando información del ticket...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !ticket) {
    return (
      <AdminLayout 
        usuario={usuarioLogueado} 
        titulo="Detalle del Ticket" 
        handleVolver={handleVolver}
      >
        <div className="container py-4">
          <div className="alert alert-danger" role="alert">
            {error || 'No se pudo cargar el ticket'}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      usuario={usuarioLogueado} 
      titulo={`Ticket #${ticket.idTicket}`} 
      handleVolver={handleVolver}
    >
      <div className="container py-4">
        {/* Información del Ticket */}
        <div className="card shadow-sm border-0 rounded-3 mb-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h5 className="mb-0">Información del Ticket</h5>
              <span className={`badge ${getEstadoBadgeClass(ticket.estadoGeneral)} fs-6`}>
                {ticket.estadoGeneral || 'Sin estado'}
              </span>
            </div>

            <div className="row g-3">
              <div className="col-md-3">
                <div className="text-muted small">ID Ticket</div>
                <div className="fw-semibold">#{ticket.idTicket}</div>
              </div>
              <div className="col-md-3">
                <div className="text-muted small">ID Obra</div>
                <div className="fw-semibold">Obra #{ticket.idObra}</div>
              </div>
              <div className="col-md-3">
                <div className="text-muted small">Usuario Creador</div>
                <div className="fw-semibold">Usuario #{ticket.idUsuarioCreador}</div>
              </div>
              <div className="col-md-3">
                <div className="text-muted small">Fecha de Creación</div>
                <div className="fw-semibold">{formatFecha(ticket.fechaCreacion)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div className="card shadow-sm border-0 rounded-3">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">
                Observaciones 
                <span className="badge bg-secondary ms-2">{observaciones.length}</span>
              </h5>
              <button 
                className="btn btn-primary"
                onClick={handleAgregarObservacion}
              >
                <FaPlus className="me-2" />
                Nueva Observación
              </button>
            </div>

            {observaciones.length === 0 ? (
              <div className="text-center text-muted py-5">
                <FaExclamationTriangle size={48} className="mb-3 opacity-50" />
                <p className="mb-0">No hay observaciones registradas para este ticket.</p>
                <button 
                  className="btn btn-outline-primary mt-3"
                  onClick={handleAgregarObservacion}
                >
                  Crear Primera Observación
                </button>
              </div>
            ) : (
              <div className="row g-3">
                {observaciones.map((obs) => {
                  const estadoBadge = getEstadoObservacionBadge(obs.estadoObservacion);
                  return (
                    <div key={obs.idObservacion} className="col-12">
                      <div className="card border">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h6 className="mb-1">
                                <span className="text-muted">#</span>{obs.idObservacion} - {obs.falla}
                              </h6>
                              <small className="text-muted">
                                Registrado: {formatFecha(obs.fechaRegistro)}
                              </small>
                            </div>
                            <div className="d-flex gap-2">
                              <span className={`badge ${getUrgenciaBadgeClass(obs.urgencia)}`}>
                                {obs.urgencia || 'Sin urgencia'}
                              </span>
                              <span className={`badge ${estadoBadge.class}`}>
                                {estadoBadge.icon && <span className="me-1">{estadoBadge.icon}</span>}
                                {obs.estadoObservacion || 'Sin estado'}
                              </span>
                            </div>
                          </div>

                          <div className="mb-2">
                            <strong className="text-muted small">Ubicación:</strong>
                            <p className="mb-0">{obs.ubicacionExacta}</p>
                          </div>

                          <div className="mb-2">
                            <strong className="text-muted small">Descripción del Problema:</strong>
                            <p className="mb-0">{obs.descripcionProblema}</p>
                          </div>

                          {obs.comentarioCliente && (
                            <div className="mt-3 p-3 bg-light rounded">
                              <strong className="text-muted small">Comentario del Cliente:</strong>
                              <p className="mb-0 mt-1">{obs.comentarioCliente}</p>
                              {obs.fechaConfirmacion && (
                                <small className="text-muted">
                                  Confirmado: {formatFecha(obs.fechaConfirmacion)}
                                </small>
                              )}
                            </div>
                          )}

                          <div className="row mt-3 text-muted small">
                            <div className="col-md-4">
                              <strong>Categoría:</strong> #{obs.idCategoria}
                            </div>
                            <div className="col-md-4">
                              <strong>Confirmación Cliente:</strong> 
                              <span className={`ms-1 badge ${
                                obs.confirmacionCliente === 'aceptado' ? 'bg-success' :
                                obs.confirmacionCliente === 'rechazado' ? 'bg-danger' :
                                'bg-secondary'
                              }`}>
                                {obs.confirmacionCliente || 'Pendiente'}
                              </span>
                            </div>
                            {obs.fechaTermino && (
                              <div className="col-md-4">
                                <strong>Fecha Término:</strong> {formatFecha(obs.fechaTermino)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DetalleTicket;

// Made with Bob
