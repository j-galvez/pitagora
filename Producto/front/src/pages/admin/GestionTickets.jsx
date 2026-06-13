import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaSync, FaChevronDown, FaChevronUp, FaPlus, FaUser, FaBuilding, FaClock, FaEye, FaEdit } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import ObservacionDetalleModal from '../../components/ObservacionDetalleModal';
import CostosObservacionModal from '../../components/CostosObservacionModal';

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
  const [ticketsExpandidos, setTicketsExpandidos] = useState(new Set());
  const [loadingAccion, setLoadingAccion] = useState(false);
  
  // Estado para Modal de Detalle (Compañero)
  const [showObsModal, setShowObsModal] = useState(false);
  const [obsIdSeleccionada, setObsIdSeleccionada] = useState(null);

  // Estados para el Modal de Cambio de Estado (Nuevo)
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [obsParaCambio, setObsParaCambio] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [comentarioAdmin, setComentarioAdmin] = useState('');

  // Estados para Modal de Costos
  const [showCostosModal, setShowCostosModal] = useState(false);
  const [obsParaCostos, setObsParaCostos] = useState(null);

  useEffect(() => {
    inicializarDatos();
  }, []);

  const getNombreObra = (idObra) => {
    const obra = obras[idObra];
    if (!obra) return `ID: ${idObra}`;
    return obra.nombreObra || `ID: ${idObra}`;
  };

  const getNombreCliente = (idObra) => {
    const obra = obras[idObra];
    return obra?.nombreEmpresa || 'Sin cliente';
  };

  const observacionCoincideBusqueda = (obs, query) => {
    const q = query.toLowerCase();
    return ['falla', 'descripcionProblema', 'descripcion_problema', 'ubicacionExacta', 'ubicacion_exacta']
      .some((campo) => (obs[campo] || '').toLowerCase().includes(q));
  };

  const getTimestampObservacion = (obs) => {
    const fecha = obs.fechaRegistro || obs.fecha_registro;
    if (!fecha) return 0;
    const ts = new Date(fecha).getTime();
    return Number.isNaN(ts) ? 0 : ts;
  };

  const ordenarObservaciones = (lista) =>
    [...lista].sort((a, b) => {
      const diff = getTimestampObservacion(b) - getTimestampObservacion(a);
      if (diff !== 0) return diff;
      return (b.idObservacion || b.id_observacion || 0) - (a.idObservacion || a.id_observacion || 0);
    });

  const formatFechaObservacion = (obs) => {
    const fecha = obs.fechaRegistro || obs.fecha_registro;
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getObservacionesParaMostrar = (ticketId) => {
    const obsDeTicket = todasObservaciones.filter(
      (o) => (o.idTicket || o.id_ticket) === ticketId
    );
    const ordenadas = ordenarObservaciones(obsDeTicket);
    const query = searchTerm.trim().toLowerCase();
    if (!query) return ordenadas;

    const coincidentes = ordenadas.filter((o) => observacionCoincideBusqueda(o, query));
    if (coincidentes.length > 0) return coincidentes;

    return ordenadas;
  };

  const highlightText = (text, highlight) => {
    if (!text) return '';
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="p-0 bg-warning bg-opacity-50">{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const toggleTicketExpandido = (ticketId) => {
    setTicketsExpandidos((prev) => {
      const next = new Set(prev);
      if (next.has(ticketId)) next.delete(ticketId);
      else next.add(ticketId);
      return next;
    });
  };

  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return;

    const idsConObsCoincidentes = tickets
      .filter((t) => {
        const ticketId = t.idTicket || t.id_ticket;
        const obsDeTicket = todasObservaciones.filter(
          (o) => (o.idTicket || o.id_ticket) === ticketId
        );
        return obsDeTicket.some((o) => observacionCoincideBusqueda(o, query));
      })
      .map((t) => t.idTicket || t.id_ticket);

    if (idsConObsCoincidentes.length > 0) {
      setTicketsExpandidos((prev) => new Set([...prev, ...idsConObsCoincidentes]));
    }
  }, [searchTerm, tickets, todasObservaciones]);

  // Formatear número a moneda chilena (sin decimales, con separador de miles)
  const formatMoneda = (valor) => {
    if (valor === null || valor === undefined) return '$ 0';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  // Calcular el total de un ticket sumando sus observaciones
  const calcularTotalTicket = (idTicket) => {
    return todasObservaciones
      .filter(o => (o.idTicket || o.id_ticket) === idTicket)
      .reduce((acc, o) => acc + (o.costo || 0), 0);
  };

  const calcularEstadoGeneralTicket = (idTicket, observaciones) => {
    const obsDeTicket = observaciones.filter(o => (o.idTicket || o.id_ticket) === idTicket);
    if (obsDeTicket.length === 0) return 'abierto';
    const todasCerradas = obsDeTicket.every(o => {
      const estado = (o.estadoObservacion || o.estado_observacion || '').toLowerCase();
      return estado === 'terminado' || estado === 'no aplica';
    });
    return todasCerradas ? 'terminado' : 'en proceso';
  };

  const sincronizarEstadoTicket = (idTicket, observacionesActualizadas) => {
    const nuevoEstado = calcularEstadoGeneralTicket(idTicket, observacionesActualizadas);
    setTickets(prev => prev.map(t =>
      (t.idTicket || t.id_ticket) === idTicket
        ? { ...t, estadoGeneral: nuevoEstado }
        : t
    ));
  };

  const ESTADOS = [
    'pendiente',
    'en observación',
    'aplica',
    'en proceso',
    'en espera aceptación',
    'terminado',
    'no aplica',
  ];

  const getAvailableStateOptions = (estadoActual) => {
    const index = ESTADOS.findIndex((estado) => estado === (estadoActual || '').toLowerCase());
    let availableEstados = index >= 0 ? ESTADOS.slice(index) : ESTADOS;
    const aplicaIndex = ESTADOS.indexOf('aplica');
    const noAplicaIndex = ESTADOS.indexOf('no aplica');
    if (index >= aplicaIndex && index < noAplicaIndex) {
      availableEstados = availableEstados.filter((estado) => estado !== 'no aplica');
    }
    return availableEstados;
  };

  const abrirModalCostos = (e, obs) => {
    e.stopPropagation();
    setObsParaCostos(obs);
    setShowCostosModal(true);
  };

  const cerrarModalCostos = () => {
    setShowCostosModal(false);
    setObsParaCostos(null);
  };

  const handleCostosActualizados = (idObs, nuevoTotal) => {
    setTodasObservaciones(prev => prev.map(o =>
      (o.idObservacion || o.id_observacion) === idObs ? { ...o, costo: nuevoTotal } : o
    ));
  };

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
      const data = await res.json();
      const mapa = {};
      data.forEach((o) => {
        mapa[o.idObra || o.id_obra] = {
          nombreObra: o.nombreObra || o.nombre_obra,
          nombreEmpresa: o.nombreEmpresa || o.nombre_empresa || '',
        };
      });
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

  const handleVolver = () => navigate('/admin-dashboard');

  // Funciones Modal Detalle (Compañero)
  const handleVerObservacion = (e, idObs) => {
    if (window.getSelection().toString().length > 0) return; // Evitar abrir modal si se está seleccionando texto
    e.stopPropagation();
    setObsIdSeleccionada(idObs);
    setShowObsModal(true);
  };

  const handleCerrarObsModal = () => {
    setShowObsModal(false);
    setObsIdSeleccionada(null);
  };

  const handleObservacionActualizada = async (observacionActualizada) => {
    const idObs = observacionActualizada.idObservacion || observacionActualizada.id_observacion;
    const idTicket = observacionActualizada.idTicket || observacionActualizada.id_ticket;
    const actualizadas = todasObservaciones.map(o =>
      (o.idObservacion || o.id_observacion) === idObs ? { ...o, ...observacionActualizada } : o
    );
    setTodasObservaciones(actualizadas);
    if (idTicket) sincronizarEstadoTicket(idTicket, actualizadas);
    await cargarTickets();
  };

  // Funciones Modal Cambio de Estado
  const abrirModalEstado = (e, obs) => {
    if (window.getSelection().toString().length > 0) return; // Evitar abrir modal si se está seleccionando texto
    e.stopPropagation();
    setObsParaCambio(obs);
    setNuevoEstado(obs.estadoObservacion || obs.estado_observation);
    setComentarioAdmin(obs.comentarioAdmin || obs.comentario_admin || '');
    setShowStatusModal(true);
  };

  const guardarCambioEstado = async () => {
    if (!obsParaCambio) return;
    
    setLoadingAccion(true);
    const idObs = obsParaCambio.idObservacion || obsParaCambio.id_observacion;
    
    try {
      const response = await fetch(`http://localhost:8080/api/observaciones/${idObs}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          estadoObservacion: nuevoEstado,
          comentarioAdmin: comentarioAdmin
        })
      });
      
      if (response.ok) {
        const idTicket = obsParaCambio.idTicket || obsParaCambio.id_ticket;
        const actualizadas = todasObservaciones.map(o =>
          (o.idObservacion || o.id_observacion) === idObs
            ? { ...o, estadoObservacion: nuevoEstado, comentarioAdmin: comentarioAdmin }
            : o
        );
        setTodasObservaciones(actualizadas);
        if (idTicket) sincronizarEstadoTicket(idTicket, actualizadas);
        await cargarTickets();
        setShowStatusModal(false);
      } else {
        alert('Error al actualizar el estado');
      }
    } catch (err) { 
      console.error(err);
      alert('Error de conexión al actualizar');
    } finally {
      setLoadingAccion(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const query = searchTerm.toLowerCase();
    const idT = String(t.idTicket || t.id_ticket);
    const idObra = t.idObra || t.id_obra;
    const nombreObra = getNombreObra(idObra).toLowerCase();
    const nombreCliente = getNombreCliente(idObra).toLowerCase();
    const nombreUsuario = (usuarios[t.idUsuario || t.id_usuario] || '').toLowerCase();

    const obsDeEsteTicket = todasObservaciones.filter(
      (o) => (o.idTicket || o.id_ticket) === (t.idTicket || t.id_ticket)
    );
    const coincideObservacion = obsDeEsteTicket.some((o) => observacionCoincideBusqueda(o, query));

    const matchesSearch =
      idT.includes(query) ||
      nombreObra.includes(query) ||
      nombreCliente.includes(query) ||
      nombreUsuario.includes(query) ||
      coincideObservacion;

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
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-primary" onClick={inicializarDatos}>
                <FaSync className="me-1" /> Actualizar
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/crear-ticket')}
              >
                <FaPlus className="me-1" /> Crear Ticket
              </button>
            </div>
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
                  placeholder="ID, obra, cliente, usuario u observación..."
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
                  <th>Cliente</th>
                  <th>Usuario Asignado</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th className="text-end">Costo Total</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <div className="spinner-border text-primary" role="status"></div>
                      <div className="mt-2 text-muted">Cargando tickets...</div>
                    </td>
                  </tr>
                ) : filteredTickets.length > 0 ? (
                  filteredTickets.map((t) => {
                    const ticketId = t.idTicket || t.id_ticket;
                    const idObra = t.idObra || t.id_obra;
                    const isExpanded = ticketsExpandidos.has(ticketId);
                    const obsTicket = getObservacionesParaMostrar(ticketId);

                    return (
                      <React.Fragment key={ticketId}>
                        <tr 
                          style={{ fontSize: '14px', cursor: 'pointer' }} 
                          onClick={() => toggleTicketExpandido(ticketId)}
                          className={isExpanded ? 'table-light' : ''}
                        >
                          <td className="fw-bold text-secondary">#{ticketId}</td>
                          <td>
                            <div className="fw-semibold"><FaBuilding className="me-1 text-muted" style={{ fontSize: '12px' }}/> {getNombreObra(idObra)}</div>
                          </td>
                          <td>
                            <div className="text-dark">{getNombreCliente(idObra)}</div>
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
                          <td className="text-end fw-bold text-success" style={{ fontSize: '13px' }}>
                            {formatMoneda(calcularTotalTicket(ticketId))}
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
                            <td colSpan="8" className="p-0 border-0">
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
                                          <th className="ps-3 py-2" style={{ width: '30%' }}>FALLA</th>
                                          <th className="py-2" style={{ width: '14%' }}>FECHA</th>
                                          <th className="py-2" style={{ width: '18%' }}>UBICACIÓN</th>
                                          <th className="py-2" style={{ width: '10%' }}>URGENCIA</th>
                                          <th className="py-2 text-center" style={{ width: '18%' }}>COSTO</th>
                                          <th className="py-2 pe-3 text-center" style={{ width: '10%' }}>ESTADO</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {obsTicket.map(obs => (
                                          <tr
                                            key={obs.idObservacion || obs.id_observacion}
                                            className="border-bottom"
                                          >
                                            <td className="ps-3 py-3">
                                              <div 
                                                className="fw-bold text-primary d-flex align-items-center gap-2" 
                                                style={{ fontSize: '14px', cursor: 'pointer', width: 'fit-content' }}
                                                onClick={(e) => handleVerObservacion(e, obs.idObservacion || obs.id_observacion)}
                                              >
                                                {searchTerm.trim()
                                                  ? highlightText(obs.falla, searchTerm.trim())
                                                  : obs.falla}
                                                <FaEye className="text-muted" style={{ fontSize: '11px' }} title="Ver detalle" />
                                              </div>
                                              <div className="text-muted small" style={{ maxWidth: '300px' }}>
                                                {searchTerm.trim()
                                                  ? highlightText(obs.descripcionProblema || obs.descripcion_problema, searchTerm.trim())
                                                  : (obs.descripcionProblema || obs.descripcion_problema)}
                                              </div>
                                            </td>
                                            <td style={{ fontSize: '12px' }} className="text-muted text-nowrap">
                                              <FaClock className="me-1" style={{ fontSize: '10px' }} />
                                              {formatFechaObservacion(obs)}
                                            </td>
                                            <td style={{ fontSize: '13px' }}>
                                              <span className="badge bg-light text-dark border fw-normal">
                                                {searchTerm.trim()
                                                  ? highlightText(obs.ubicacionExacta || obs.ubicacion_exacta, searchTerm.trim())
                                                  : (obs.ubicacionExacta || obs.ubicacion_exacta)}
                                              </span>
                                            </td>
                                            <td>
                                              <span className={`badge ${obs.urgencia === 'alta' ? 'bg-danger' : obs.urgencia === 'media' ? 'bg-warning text-dark' : 'bg-info text-dark'}`} style={{ fontSize: '11px' }}>
                                                {obs.urgencia.toUpperCase()}
                                              </span>
                                            </td>
                                            <td className="text-center" style={{ width: '20%' }}>
                                              <div
                                                className="d-flex align-items-center justify-content-center gap-2 px-2"
                                                onClick={(e) => e.stopPropagation()}
                                              >
                                                <span className="fw-bold text-success" style={{ fontSize: '13px' }}>
                                                  {formatMoneda(obs.costo || 0)}
                                                </span>
                                                <button
                                                  className="btn btn-sm btn-outline-success py-0 px-2"
                                                  onClick={(e) => abrirModalCostos(e, obs)}
                                                  title="Gestionar costos"
                                                >
                                                  <FaPlus style={{ fontSize: '11px' }} />
                                                </button>
                                              </div>
                                            </td>
                                            <td className="pe-3 text-center" style={{ width: '15%' }}>
                                              <div className="d-flex flex-column align-items-center gap-1">
                                                <span className="badge bg-light text-dark border w-100" style={{ fontSize: '11px', borderLeft: '3px solid #003860' }}>
                                                  {(obs.estadoObservacion || obs.estado_observacion).toUpperCase()}
                                                </span>
                                                <button 
                                                  className="btn btn-sm btn-primary w-100 py-1"
                                                  onClick={(e) => abrirModalEstado(e, obs)}
                                                  disabled={loadingAccion}
                                                  style={{ fontSize: '11px' }}
                                                >
                                                  <FaEdit className="me-1" /> Editar
                                                </button>
                                              </div>
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
                    <td colSpan="8" className="text-center text-muted py-4">
                      No se encontraron tickets que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Detalle (Compañero) */}
      <ObservacionDetalleModal
        show={showObsModal}
        onHide={handleCerrarObsModal}
        idObservacion={obsIdSeleccionada}
        onObservacionActualizada={handleObservacionActualizada}
      />

      {/* Modal de Costos */}
      <CostosObservacionModal
        show={showCostosModal}
        onHide={cerrarModalCostos}
        observacion={obsParaCostos}
        onCostosActualizados={handleCostosActualizados}
      />

      {/* Modal Cambio de Estado (Nuestro) */}
      {showStatusModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">Actualizar Estado de Observación</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowStatusModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small text-uppercase">Falla / Observación</label>
                  <div className="p-2 bg-light rounded border text-primary fw-bold">
                    {obsParaCambio?.falla}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small text-uppercase">Nuevo Estado</label>
                  <select 
                    className="form-select"
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value)}
                    style={{ borderLeft: '4px solid #003860' }}
                  >
                    {getAvailableStateOptions(obsParaCambio?.estadoObservacion || obsParaCambio?.estado_observacion || nuevoEstado).map((estado) => (
                      <option key={estado} value={estado}>
                        {estado.charAt(0).toUpperCase() + estado.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-0">
                  <label className="form-label fw-bold text-muted small text-uppercase">Comentario Administrativo</label>
                  <textarea 
                    className="form-control"
                    rows="4"
                    placeholder="Describe el avance o motivo del cambio de estado..."
                    value={comentarioAdmin}
                    onChange={(e) => setComentarioAdmin(e.target.value)}
                  ></textarea>
                  <div className="form-text mt-2">
                    Este comentario quedará registrado en la bitácora de la observación.
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light border-0">
                <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowStatusModal(false)}>
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary px-4" 
                  onClick={guardarCambioEstado}
                  disabled={loadingAccion}
                >
                  {loadingAccion ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default GestionTickets;
