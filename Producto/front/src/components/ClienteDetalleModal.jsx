import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Badge, Table } from 'react-bootstrap';
import { FaTimes, FaMapMarkerAlt, FaBuilding, FaPhone, FaEnvelope, FaCheckCircle, FaClock } from 'react-icons/fa';
import { clientesService } from '../services/clientesService';
import { obrasService } from '../services/obrasService';
import ObraDetalleModal from './ObraDetalleModal';

const ClienteDetalleModal = ({ show, onHide, idCliente }) => {
  const [cliente, setCliente] = useState(null);
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showObraModal, setShowObraModal] = useState(false);
  const [obraSeleccionada, setObraSeleccionada] = useState(null);

  useEffect(() => {
    if (show && idCliente) {
      cargarDatosCliente();
    }
  }, [show, idCliente]);

  const cargarDatosCliente = async () => {
    setLoading(true);
    setError('');

    try {
      // Cargar datos del cliente
      const clienteData = await clientesService.getClienteById(idCliente);
      console.log('Datos del cliente recibidos:', clienteData);
      setCliente(clienteData);

      // Cargar obras del cliente
      try {
        const obrasData = await obrasService.getObrasByCliente(idCliente);
        console.log('Obras recibidas:', obrasData);
        setObras(obrasData || []);
      } catch (obrasError) {
        console.warn('No se pudieron cargar las obras:', obrasError);
        setObras([]);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos del cliente');
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
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  const getEstadoObraBadge = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activa':
        return <Badge bg="success">Activa</Badge>;
      case 'garantía vencida':
        return <Badge bg="warning" text="dark">Garantía Vencida</Badge>;
      case 'cerrada':
        return <Badge bg="secondary">Cerrada</Badge>;
      default:
        return <Badge bg="primary">{estado}</Badge>;
    }
  };

  const obrasActivas = obras.filter(obra => 
    obra.estadoObra?.toLowerCase() === 'activa'
  );
  const obrasEnGarantia = obras.filter(obra => 
    obra.estadoObra?.toLowerCase() === 'garantía vencida'
  );
  const obrasCerradas = obras.filter(obra => 
    obra.estadoObra?.toLowerCase() === 'cerrada'
  );

  const handleVerObra = (idObra) => {
    setObraSeleccionada(idObra);
    setShowObraModal(true);
  };

  return (
    <>
      <ObraDetalleModal 
        show={showObraModal}
        onHide={() => setShowObraModal(false)}
        idObra={obraSeleccionada}
      />
      <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header className="bg-primary text-white">
        <Modal.Title>
          <FaBuilding className="me-2" />
          Detalle de Cliente
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
        ) : cliente ? (
          <>
            {console.log('Renderizando cliente:', cliente)}
            {/* Información General del Cliente */}
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
                        <small className="text-muted d-block">Nombre de Empresa</small>
                        <strong>{cliente.nombreEmpresa || cliente.nombre_empresa || '-'}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaCheckCircle className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">RUT</small>
                        <strong>{cliente.rut || '-'}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaEnvelope className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Correo Contacto</small>
                        <strong>{cliente.correoContacto || cliente.correo_contacto || '-'}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaPhone className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Teléfono</small>
                        <strong>{cliente.telefono || '-'}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaMapMarkerAlt className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Región</small>
                        <strong>{cliente.nombreRegion || cliente.nombre_region || '-'}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <FaMapMarkerAlt className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Comuna</small>
                        <strong>{cliente.nombreComuna || cliente.nombre_comuna || '-'}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="d-flex align-items-start">
                      <FaCheckCircle className="text-primary me-2 mt-1" />
                      <div>
                        <small className="text-muted d-block">Estado</small>
                        <Badge bg={getEstadoBadgeClass(cliente.estado)}>
                          {cliente.estado || 'Sin estado'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de Obras */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">Resumen de Obras</h5>
              </div>
              <div className="card-body">
                <div className="row text-center g-3">
                  <div className="col-md-4">
                    <div className="p-3 bg-success bg-opacity-10 rounded">
                      <h3 className="text-success mb-0">{obrasActivas.length}</h3>
                      <small className="text-muted">Activas</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-warning bg-opacity-10 rounded">
                      <h3 className="text-warning mb-0">{obrasEnGarantia.length}</h3>
                      <small className="text-muted">Garantía Vencida</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-secondary bg-opacity-10 rounded">
                      <h3 className="text-secondary mb-0">{obrasCerradas.length}</h3>
                      <small className="text-muted">Cerradas</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Obras */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">Obras ({obras.length})</h5>
              </div>
              <div className="card-body">
                {obras.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="align-middle" style={{ fontSize: '14px', marginBottom: 0 }}>
                      <thead className="table-light text-muted">
                        <tr>
                          <th>Nombre</th>
                          <th>Región</th>
                          <th>Comuna</th>
                          <th>Estado</th>
                          <th>Obs. Abiertas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {obras.map((obra) => (
                          <tr 
                            key={obra.idObra} 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleVerObra(obra.idObra)}
                            className="border-bottom"
                          >
                            <td className="fw-semibold">
                              #{obra.idObra} - {obra.nombreObra || obra.nombre_obra || 'Sin nombre'}
                            </td>
                            <td>{obra.nombreRegion || obra.nombre_region || '-'}</td>
                            <td>{obra.nombreComuna || obra.nombre_comuna || '-'}</td>
                            <td>
                              {getEstadoObraBadge(obra.estadoObra || obra.estado_obra)}
                            </td>
                            <td>
                              <Badge bg={obra.numeroObservacionesAbiertas > 0 ? 'danger' : 'success'}>
                                {obra.numeroObservacionesAbiertas || 0}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    <p className="mb-0">No hay obras registradas para este cliente</p>
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
    </>
  );
};

export default ClienteDetalleModal;

// Made with Bob
