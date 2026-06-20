import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Badge, Table, Accordion } from 'react-bootstrap';
import { FaTimes, FaMapMarkerAlt, FaBuilding, FaCalendar, FaExclamationTriangle, FaCheckCircle, FaClock, FaUsers, FaUser } from 'react-icons/fa';
import { obrasService } from '../services/obrasService';
import { usuariosService } from '../services/usuariosService';
import UsuarioDetalleModal from './UsuarioDetalleModal';

const ObraDetalleModal = ({ show, onHide, idObra }) => {
  const [obra, setObra] = useState(null);
  const [observaciones, setObservaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUsuarioModal, setShowUsuarioModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    if (show && idObra) {
      cargarDatosObra();
    }
  }, [show, idObra]);

  const cargarDatosObra = async () => {
    setLoading(true);
    setError('');

    try {
      // Cargar datos de la obra
      const obraData = await obrasService.getObraById(idObra);
      setObra(obraData);

      try {
        const observacionesData = await obrasService.getObservacionesByObra(idObra);
        setObservaciones(observacionesData || []);
      } catch (obsError) {
        console.warn('No se pudieron cargar las observaciones:', obsError);
        setObservaciones([]);
      }

      try {
        const usuariosData = await usuariosService.getUsuariosByObra(idObra);
        setUsuarios(usuariosData || []);
      } catch (usuariosError) {
        console.warn('No se pudieron cargar los usuarios:', usuariosError);
        setUsuarios([]);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos de la obra');
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activa':
        return 'success';
      case 'garantía vencida':
        return 'warning';
      case 'inactiva':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  const getEstadoObservacionBadge = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'abierta':
        return <Badge bg="danger">Abierta</Badge>;
      case 'en proceso':
        return <Badge bg="warning" text="dark">En Proceso</Badge>;
      case 'cerrada':
        return <Badge bg="success">Cerrada</Badge>;
      default:
        return <Badge bg="secondary">{estado}</Badge>;
    }
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
        return <Badge bg="secondary">{urgencia}</Badge>;
    }
  };

  const handleVerUsuario = (idUsuario) => {
    setUsuarioSeleccionado(idUsuario);
    setShowUsuarioModal(true);
  };

  const getNombreCompleto = (u) => {
    const nombre = u.nombre || '';
    const apellidoP = u.apellidoPaterno || u.apellido_paterno || '';
    const apellidoM = u.apellidoMaterno || u.apellido_materno || '';
    return `${nombre} ${apellidoP} ${apellidoM}`.trim() || 'Sin nombre';
  };

  const getRolLabel = (rol) => {
    switch (rol?.toLowerCase()) {
      case 'admin':
        return 'Administrador';
      case 'cliente':
        return 'Cliente';
      case 'jefe_obra':
        return 'Jefe de obra';
      case 'tecnico':
        return 'Técnico';
      case 'usuario':
        return 'Usuario';
      default:
        return rol || '-';
    }
  };

  const getRolBadgeClass = (rol) => {
    switch (rol?.toLowerCase()) {
      case 'admin':
        return 'primary';
      case 'cliente':
        return 'success';
      case 'jefe_obra':
        return 'warning';
      case 'tecnico':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const observacionesAbiertas = observaciones.filter(obs => 
    obs.estadoObservacion?.toLowerCase() === 'abierta'
  );
  const observacionesEnProceso = observaciones.filter(obs => 
    obs.estadoObservacion?.toLowerCase() === 'en proceso'
  );
  const observacionesCerradas = observaciones.filter(obs => 
    obs.estadoObservacion?.toLowerCase() === 'cerrada'
  );

  return (
    <>
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header className="bg-primary text-white">
        <Modal.Title>
          <FaBuilding className="me-2" />
          Detalle de Obra
        </Modal.Title>
        <Button variant="link" className="text-white" onClick={onHide}>
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
        ) : obra ? (
          <>
            {/* Información General de la Obra */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">Información General</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaBuilding className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Nombre de la Obra</small>
                        <strong>{obra.nombreObra || obra.nombre_obra}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaBuilding className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Cliente</small>
                        <strong>{obra.nombreEmpresa || obra.nombre_empresa || '-'}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="d-flex align-items-start">
                      <FaMapMarkerAlt className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Dirección</small>
                        <strong>{obra.direccion || obra.direccionCalle || obra.direccion_calle || '-'}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaMapMarkerAlt className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Región</small>
                        <strong>{obra.nombreRegion || obra.nombre_region || '-'}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaMapMarkerAlt className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Comuna</small>
                        <strong>{obra.nombreComuna || obra.nombre_comuna || '-'}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaCalendar className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Fecha de Entrega</small>
                        <strong>{formatFecha(obra.fechaEntrega)}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaCalendar className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Garantía Expira</small>
                        <strong>{formatFecha(obra.garantiaExpira)}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="d-flex align-items-start">
                      <FaCheckCircle className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Estado</small>
                        <Badge bg={getEstadoBadgeClass(obra.estadoObra || obra.estado_obra)}>
                          {obra.estadoObra || obra.estado_obra || 'Sin estado'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usuarios asignados */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <FaUsers className="me-2" />
                  Usuarios asignados ({usuarios.length})
                </h5>
              </div>
              <div className="card-body">
                {usuarios.length > 0 ? (
                  <div className="row g-2">
                    {usuarios.map((u) => {
                      const userId = u.idUsuario || u.id_usuario;
                      return (
                        <div className="col-md-6" key={userId}>
                          <button
                            type="button"
                            className="w-100 text-start border rounded p-3 bg-white shadow-sm d-flex align-items-center gap-3"
                            style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                            onClick={() => handleVerUsuario(userId)}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0.25rem 0.5rem rgba(0,0,0,0.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ''; }}
                          >
                            <div
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{ width: 40, height: 40, fontSize: '14px', fontWeight: 'bold' }}
                            >
                              <FaUser />
                            </div>
                            <div className="flex-grow-1 min-w-0">
                              <div className="fw-semibold text-truncate">{getNombreCompleto(u)}</div>
                              <small className="text-muted d-block text-truncate">{u.correo || '-'}</small>
                              <div className="d-flex gap-1 mt-1 flex-wrap">
                                <Badge bg={getRolBadgeClass(u.rol)} style={{ fontSize: '10px' }}>
                                  {getRolLabel(u.rol)}
                                </Badge>
                                {u.estado && (
                                  <Badge bg={u.estado === 'Activo' ? 'success' : 'danger'} style={{ fontSize: '10px' }}>
                                    {u.estado}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted py-3">
                    <FaUsers className="mb-2 opacity-50" size={28} />
                    <p className="mb-0 small">No hay usuarios asignados a esta obra</p>
                  </div>
                )}
              </div>
            </div>

            {/* Resumen de Observaciones */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">Resumen de Observaciones</h5>
              </div>
              <div className="card-body">
                <div className="row text-center g-3">
                  <div className="col-md-4">
                    <div className="p-3 bg-success bg-opacity-10 rounded">
                      <h3 className="text-success mb-0">{observacionesAbiertas.length}</h3>
                      <small className="text-muted">Abiertas</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-warning bg-opacity-10 rounded">
                      <h3 className="text-warning mb-0">{observacionesEnProceso.length}</h3>
                      <small className="text-muted">En Proceso</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-danger bg-opacity-10 rounded">
                      <h3 className="text-danger mb-0">{observacionesCerradas.length}</h3>
                      <small className="text-muted">Cerradas</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Observaciones */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">Observaciones ({observaciones.length})</h5>
              </div>
              <div className="card-body">
                {observaciones.length > 0 ? (
                  <Accordion defaultActiveKey="0">
                    {observaciones.map((obs, index) => (
                      <Accordion.Item eventKey={index.toString()} key={obs.idObservacion || index}>
                        <Accordion.Header>
                          <div className="d-flex justify-content-between align-items-center w-100 me-3">
                            <div>
                              <strong className="me-2">#{obs.idObservacion}</strong>
                              <span className="text-muted">{obs.falla || obs.titulo || 'Sin título'}</span>
                            </div>
                            <div className="d-flex gap-2">
                              {getEstadoObservacionBadge(obs.estadoObservacion || obs.estado_observacion)}
                              {getUrgenciaBadge(obs.urgencia)}
                            </div>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className="row g-3">
                            <div className="col-md-12">
                              <small className="text-muted d-block">Descripción</small>
                              <p className="mb-2">{obs.descripcionProblema || obs.descripcion_problema || obs.descripcion || 'Sin descripción'}</p>
                            </div>
                            <div className="col-md-6">
                              <small className="text-muted d-block">Fecha de Registro</small>
                              <p className="mb-0">
                                <FaClock className="me-1" />
                                {formatFecha(obs.fechaRegistro || obs.fecha_registro || obs.fechaCreacion || obs.fecha_creacion)}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <small className="text-muted d-block">Categoría</small>
                              <p className="mb-0">{obs.nombreCategoria || obs.nombre_categoria || (obs.idCategoria ? `Cat. #${obs.idCategoria}` : '-')}</p>
                            </div>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center text-muted py-4">
                    <p className="mb-0">No hay observaciones registradas para esta obra</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>

    <UsuarioDetalleModal
      show={showUsuarioModal}
      onHide={() => setShowUsuarioModal(false)}
      idUsuario={usuarioSeleccionado}
    />
    </>
  );
};

export default ObraDetalleModal;

// Made with Bob