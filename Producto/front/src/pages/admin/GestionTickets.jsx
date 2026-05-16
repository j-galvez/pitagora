import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaSync, FaChevronDown, FaChevronUp, FaPlus, FaUser, FaBuilding, FaClock } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';

const GestionTickets = () => {
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  // Estados de datos
  const [tickets, setTickets] = useState([]);
  const [obras, setObras] = useState({}); 
  const [usuarios, setUsuarios] = useState({});
  const [todasObservaciones, setTodasObservaciones] = useState([]);
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Todos');
  const [ticketExpandido, setTicketExpandido] = useState(null);
  const [loadingAccion, setLoadingAccion] = useState(false);

  useEffect(() => {
    inicializarDatos();
  }, []);

  const inicializarDatos = async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([cargarObras(), cargarUsuarios(), cargarTickets(), cargarTodasObservaciones()]);
    } catch (err) {
      console.error('Error al inicializar datos:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const cargarObras = async () => {
    const res = await fetch('http://localhost:8080/api/obras');
    if (res.ok) {
      const data = await res.ok ? await res.json() : [];
      const mapa = {};
      data.forEach(o => mapa[o.idObra || o.id_obra] = o.nombreObra || o.nombre_obra);
      setObras(mapa);
    }
  };

  const cargarUsuarios = async () => {
    const res = await fetch('http://localhost:8080/api/usuarios');
    if (res.ok) {
      const data = await res.json();
      const mapa = {};
      data.forEach(u => mapa[u.idUsuario || u.id_usuario] = `${u.nombre} ${u.apellidoPaterno || ''}`);
      setUsuarios(mapa);
    }
  };

  const cargarTickets = async () => {
    const res = await fetch('http://localhost:8080/api/tickets');
    if (res.ok) setTickets(await res.json());
  };

  const cargarTodasObservaciones = async () => {
    const res = await fetch('http://localhost:8080/api/observaciones');
    if (res.ok) setTodasObservaciones(await res.json());
  };

  const cambiarEstadoObs = async (idObs, nuevoEstado) => {
    setLoadingAccion(true);
    try {
      const response = await fetch(`http://localhost:8080/api/observaciones/${idObs}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estadoObservacion: nuevoEstado })
      });
      if (response.ok) {
        setTodasObservaciones(prev => prev.map(o => 
          (o.idObservacion || o.id_observacion) === idObs ? { ...o, estadoObservacion: nuevoEstado } : o
        ));
      }
    } catch (err) { console.error(err); }
    setLoadingAccion(false);
  };

  const handleVolver = () => navigate('/admin-dashboard');

  const filteredTickets = tickets.filter((t) => {
    const query = searchTerm.toLowerCase();
    const idT = String(t.idTicket || t.id_ticket);
    const nombreObra = (obras[t.idObra || t.id_obra] || '').toLowerCase();
    const nombreUsuario = (usuarios[t.idUsuario || t.id_usuario] || '').toLowerCase();
    
    // Búsqueda en observaciones
    const obsDeEsteTicket = todasObservaciones.filter(o => (o.idTicket || o.id_ticket) === (t.idTicket || t.id_ticket));
    const coincideFalla = obsDeEsteTicket.some(o => (o.falla || '').toLowerCase().includes(query));

    const matchesSearch = idT.includes(query) || nombreObra.includes(query) || nombreUsuario.includes(query) || coincideFalla;

    const estado = t.estadoGeneral || t.estado_general;
    if (activeTab === 'Todos') return matchesSearch;
    if (activeTab === 'Abiertos') return matchesSearch && estado === 'abierto';
    if (activeTab === 'En Proceso') return matchesSearch && estado === 'en proceso';
    if (activeTab === 'Terminados') return matchesSearch && estado === 'terminado';
    return matchesSearch;
  });

  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'abierto': return 'bg-warning text-dark';
      case 'en proceso': return 'bg-primary';
      case 'terminado': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  return (
    <AdminLayout 
      usuario={usuarioLogueado} 
      titulo="Gestión de Tickets" 
      handleVolver={handleVolver}
    >
      <div className="container py-4">
        <div className="card shadow-sm border-0 rounded-3 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Tickets de Postventa</h5>
            <button className="btn btn-sm btn-outline-primary" onClick={inicializarDatos}>
              <FaSync className="me-1" /> Actualizar
            </button>
          </div>

          <p className="text-muted mb-4" style={{ fontSize: '14px' }}>
            Administra los tickets de obra y supervisa el estado de cada observación reportada.
          </p>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Filtros Estilo Gestión Usuarios */}
          <div className="row g-3 mb-4 align-items-center justify-content-between">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><FaSearch /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ID, obra, usuario o nombre de falla..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 d-flex justify-content-md-end gap-1 flex-wrap">
              {['Todos', 'Abiertos', 'En Proceso', 'Terminados'].map((tab) => (
                <button
                  key={tab}
                  className={`btn btn-sm px-3 ${activeTab === tab ? 'btn-dark' : 'btn-outline-secondary'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light text-muted" style={{ fontSize: '14px' }}>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Proyecto / Obra</th>
                  <th>Usuario Asignado</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="spinner-border text-primary" role="status"></div>
                      <div className="mt-2 text-muted">Cargando tickets...</div>
                    </td>
                  </tr>
                ) : filteredTickets.length > 0 ? (
                  filteredTickets.map((t) => {
                    const ticketId = t.idTicket || t.id_ticket;
                    const isExpanded = ticketExpandido === ticketId;
                    const obsTicket = todasObservaciones.filter(o => (o.idTicket || o.id_ticket) === ticketId);

                    return (
                      <React.Fragment key={ticketId}>
                        <tr 
                          style={{ fontSize: '14px', cursor: 'pointer' }} 
                          onClick={() => setTicketExpandido(isExpanded ? null : ticketId)}
                          className={isExpanded ? 'table-light' : ''}
                        >
                          <td className="fw-bold text-secondary">#{ticketId}</td>
                          <td>
                            <div className="fw-semibold"><FaBuilding className="me-1 text-muted" style={{ fontSize: '12px' }}/> {obras[t.idObra || t.id_obra] || `ID: ${t.idObra || t.id_obra}`}</div>
                          </td>
                          <td>
                            <div className="text-dark"><FaUser className="me-1 text-muted" style={{ fontSize: '12px' }}/> {usuarios[t.idUsuario || t.id_usuario] || `ID: ${t.idUsuario || t.id_usuario}`}</div>
                          </td>
                          <td>
                            <div className="text-muted"><FaClock className="me-1 text-muted" style={{ fontSize: '12px' }}/> {new Date(t.fechaCreacion || t.fecha_creacion).toLocaleDateString('es-ES')}</div>
                          </td>
                          <td>
                            <span className={`badge ${getBadgeClass(t.estadoGeneral || t.estado_general)}`}>
                              {(t.estadoGeneral || t.estado_general).toUpperCase()}
                            </span>
                          </td>
                          <td className="text-end">
                            <button className="btn btn-light btn-sm text-primary">
                              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                          </td>
                        </tr>

                        {/* Fila de Detalle Expandible (Observations) */}
                        {isExpanded && (
                          <tr>
                            <td colSpan="6" className="p-0 border-0">
                              <div className="bg-light p-4 border-start border-primary border-4 shadow-inner">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <h6 className="mb-0 fw-bold" style={{ fontSize: '15px' }}>
                                    Observaciones Registradas ({obsTicket.length})
                                  </h6>
                                  <button 
                                    className="btn btn-dark btn-sm d-flex align-items-center"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = `/crear-observacion/${ticketId}`;
                                    }}
                                  >
                                    <FaPlus className="me-1" style={{ fontSize: '10px' }}/> Crear observación
                                  </button>
                                </div>

                                {obsTicket.length === 0 ? (
                                  <div className="text-center py-3 text-muted border rounded bg-white" style={{ fontSize: '13px' }}>
                                    No hay observaciones para este ticket.
                                  </div>
                                ) : (
                                  <div className="table-responsive rounded shadow-sm border bg-white">
                                    <table className="table table-sm table-borderless mb-0 align-middle">
                                      <thead className="bg-dark text-white" style={{ fontSize: '12px' }}>
                                        <tr>
                                          <th className="ps-3 py-2">FALLA</th>
                                          <th className="py-2">UBICACIÓN</th>
                                          <th className="py-2">URGENCIA</th>
                                          <th className="py-2 pe-3">ESTADO REPARACIÓN</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {obsTicket.map(obs => (
                                          <tr key={obs.idObservacion || obs.id_observacion} className="border-bottom">
                                            <td className="ps-3 py-3">
                                              <div className="fw-bold text-primary" style={{ fontSize: '14px' }}>{obs.falla}</div>
                                              <div className="text-muted small" style={{ maxWidth: '300px' }}>{obs.descripcionProblema || obs.descripcion_problema}</div>
                                            </td>
                                            <td style={{ fontSize: '13px' }}>
                                              <span className="badge bg-light text-dark border fw-normal">{obs.ubicacionExacta || obs.ubicacion_exacta}</span>
                                            </td>
                                            <td>
                                              <span className={`badge ${obs.urgencia === 'alta' ? 'bg-danger' : obs.urgencia === 'media' ? 'bg-warning text-dark' : 'bg-info text-dark'}`} style={{ fontSize: '11px' }}>
                                                {obs.urgencia.toUpperCase()}
                                              </span>
                                            </td>
                                            <td className="pe-3">
                                              <select 
                                                className="form-select form-select-sm"
                                                value={obs.estadoObservacion || obs.estado_observacion}
                                                onChange={(e) => {
                                                  e.stopPropagation();
                                                  cambiarEstadoObs(obs.idObservacion || obs.id_observacion, e.target.value);
                                                }}
                                                disabled={loadingAccion}
                                                style={{ fontSize: '13px', borderLeft: '3px solid #003860' }}
                                              >
                                                <option value="pendiente">Pendiente</option>
                                                <option value="en observación">En Observación</option>
                                                <option value="aplica">Aplica</option>
                                                <option value="en proceso">En Proceso</option>
                                                <option value="en espera aceptación">En Espera Aceptación</option>
                                                <option value="terminado">Terminado</option>
                                                <option value="no aplica">No Aplica</option>
                                              </select>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No se encontraron tickets que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GestionTickets;
