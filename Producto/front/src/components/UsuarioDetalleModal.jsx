import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Badge } from 'react-bootstrap';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendar, FaCheckCircle } from 'react-icons/fa';
import { usuariosService } from '../services/usuariosService';

const UsuarioDetalleModal = ({ show, onHide, idUsuario }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show && idUsuario) {
      cargarDatosUsuario();
    }
  }, [show, idUsuario]);

  const cargarDatosUsuario = async () => {
    setLoading(true);
    setError('');

    try {
      const usuarioData = await usuariosService.getUsuarioById(idUsuario);
      console.log('Datos del usuario recibidos:', usuarioData);
      setUsuario(usuarioData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos del usuario');
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

  const getRolBadgeClass = (rol) => {
    switch (rol?.toLowerCase()) {
      case 'admin':
        return 'primary';
      case 'cliente':
        return 'success';
      case 'usuario':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getRolLabel = (rol) => {
    switch (rol?.toLowerCase()) {
      case 'admin':
        return 'Administrador';
      case 'cliente':
        return 'Cliente';
      case 'usuario':
        return 'Usuario';
      default:
        return rol;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header className="bg-primary text-white">
        <Modal.Title>
          <FaUser className="me-2" />
          Detalle de Usuario
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
        ) : usuario ? (
          <>
            {console.log('Renderizando usuario:', usuario)}
            {/* Información General del Usuario */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">Información General</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaUser className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Nombre</small>
                        <strong>{usuario.nombre || '-'}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaUser className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Apellido Paterno</small>
                        <strong>{usuario.apellidoPaterno || usuario.apellido_paterno || '-'}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaUser className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Apellido Materno</small>
                        <strong>{usuario.apellidoMaterno || usuario.apellido_materno || '-'}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaEnvelope className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Correo</small>
                        <strong>{usuario.correo || usuario.email || '-'}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaPhone className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Teléfono</small>
                        <strong>{usuario.telefono || '-'}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaCheckCircle className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Rol</small>
                        <Badge bg={getRolBadgeClass(usuario.rol)}>
                          {getRolLabel(usuario.rol)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaCheckCircle className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Estado</small>
                        <Badge bg={getEstadoBadgeClass(usuario.estado)}>
                          {usuario.estado || 'Sin estado'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaCalendar className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Fecha de Creación</small>
                        <strong>{formatFecha(usuario.fechaCreacion || usuario.fecha_creacion)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información Adicional */}
            {usuario.direccion && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Información Adicional</h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-12">
                      <small className="text-muted d-block">Dirección</small>
                      <p className="mb-0">{usuario.direccion || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UsuarioDetalleModal;

// Made with Bob
