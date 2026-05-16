import { useEffect, useState } from 'react';
import { FaSync, FaChevronDown, FaChevronUp, FaFilter, FaSearch, FaUser, FaTools } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';

export default function GestionTickets() {
  const [tickets, setTickets] = useState([]);
  const [obras, setObras] = useState({}); 
  const [usuarios, setUsuarios] = useState({}); // Mapa de {idUsuario: nombreCompleto}
  const [todasObservaciones, setTodasObservaciones] = useState([]); // Todas para búsqueda global
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para filtros y UI
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroObra, setFiltroObra] = useState('');
  const [busquedaGeneral, setBusquedaGeneral] = useState('');
  const [ticketExpandido, setTicketExpandido] = useState(null);
  const [loadingAccion, setLoadingAccion] = useState(false);

  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Admin' };

  useEffect(() => {
    inicializarDatos();
  }, []);

  const inicializarDatos = async () => {
    setLoading(true);
    await Promise.all([cargarObras(), cargarUsuarios(), cargarTickets(), cargarTodasObservaciones()]);
    setLoading(false);
  };

  const cargarObras = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/obras');
      if (response.ok) {
        const data = await response.json();
        const mapa = {};
        data.forEach(o => mapa[o.idObra] = o.nombreObra);
        setObras(mapa);
      }
    } catch (err) { console.error("Error cargando obras:", err); }
  };

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/usuarios');
      if (response.ok) {
        const data = await response.json();
        const mapa = {};
        data.forEach(u => mapa[u.idUsuario] = `${u.nombre} ${u.apellidoPaterno}`);
        setUsuarios(mapa);
      }
    } catch (err) { console.error("Error cargando usuarios:", err); }
  };

  const cargarTickets = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/tickets');
      if (!response.ok) throw new Error('Error al conectar con el servidor');
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const cargarTodasObservaciones = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/observaciones');
      if (response.ok) {
        const data = await response.json();
        setTodasObservaciones(data);
      }
    } catch (err) { console.error("Error cargando todas las observaciones:", err); }
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
        // Actualizar el estado local de todas las observaciones
        setTodasObservaciones(prev => prev.map(o => 
          o.idObservacion === idObs ? { ...o, estadoObservacion: nuevoEstado } : o
        ));
      }
    } catch (err) { alert("No se pudo actualizar el estado"); }
    setLoadingAccion(false);
  };

  const getStatusBadge = (estado) => {
    const estilos = {
      'abierto': 'bg-warning text-dark',
      'en proceso': 'bg-primary text-white',
      'terminado': 'bg-success text-white'
    };
    return <span className={`badge rounded-pill ${estilos[estado] || 'bg-secondary'}`}>{estado.toUpperCase()}</span>;
  };

  const ticketsFiltrados = tickets.filter(t => {
    const cumpleEstado = !filtroEstado || t.estadoGeneral === filtroEstado;
    const cumpleObra = !filtroObra || String(t.idObra) === filtroObra;
    
    // Búsqueda por ID de ticket, nombre de obra, nombre de usuario o nombre de falla
    const query = busquedaGeneral.toLowerCase();
    const coincideTicket = String(t.idTicket).includes(query);
    const coincideObra = (obras[t.idObra] || '').toLowerCase().includes(query);
    const coincideUsuario = (usuarios[t.idUsuario] || '').toLowerCase().includes(query);
    
    // Buscar si alguna observación de este ticket coincide con la falla
    const obsDeEsteTicket = todasObservaciones.filter(o => o.idTicket === t.idTicket);
    const coincideFalla = obsDeEsteTicket.some(o => (o.falla || '').toLowerCase().includes(query));

    return cumpleEstado && cumpleObra && (coincideTicket || coincideObra || coincideUsuario || coincideFalla);
  });

  return (
    <AdminLayout usuario={usuarioLogueado} titulo="Panel de Gestión de Tickets y Fallas">
      <div className="container-fluid">
        
        {/* Barra de Búsqueda y Filtros Potenciada */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body py-3">
            <div className="row align-items-center g-3">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted"/></span>
                  <input 
                    type="text" 
                    className="form-control border-start-0" 
                    placeholder="Buscar por ID, Obra, Usuario o Falla..." 
                    value={busquedaGeneral}
                    onChange={(e) => setBusquedaGeneral(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select className="form-select" value={filtroObra} onChange={(e) => setFiltroObra(e.target.value)}>
                  <option value="">Todas las Obras</option>
                  {Object.entries(obras).map(([id, nombre]) => (
                    <option key={id} value={id}>{nombre}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                  <option value="">Todos los Estados</option>
                  <option value="abierto">Abiertos</option>
                  <option value="en proceso">En Proceso</option>
                  <option value="terminado">Terminados</option>
                </select>
              </div>
              <div className="col-md-2 text-end">
                <button className="btn btn-primary w-100" onClick={inicializarDatos}>
                  <FaSync className="me-2"/> Refrescar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Tickets */}
        <div className="row">
          <div className="col-12">
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : ticketsFiltrados.length === 0 ? (
              <div className="text-center py-5 bg-white rounded shadow-sm border">
                <FaTools className="fs-1 text-light mb-3" />
                <p className="text-muted mb-0">No se encontraron tickets que coincidan con tu búsqueda.</p>
              </div>
            ) : (
              ticketsFiltrados.map(t => (
                <div key={t.idTicket} className="card border-0 shadow-sm mb-3 overflow-hidden">
                  {/* Cabecera del Ticket */}
                  <div 
                    className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center cursor-pointer"
                    onClick={() => setTicketExpandido(ticketExpandido === t.idTicket ? null : t.idTicket)}
                    style={{ cursor: 'pointer', borderLeft: ticketExpandido === t.idTicket ? '5px solid #003860' : '5px solid transparent' }}
                  >
                    <div className="row flex-grow-1 align-items-center">
                      <div className="col-md-1">
                        <span className="text-muted small d-block">ID</span>
                        <span className="fw-bold">#{t.idTicket}</span>
                      </div>
                      <div className="col-md-3">
                        <span className="text-muted small d-block">PROYECTO / OBRA</span>
                        <span className="fw-semibold text-primary">{obras[t.idObra] || `Cargando... (ID ${t.idObra})`}</span>
                      </div>
                      <div className="col-md-3">
                        <span className="text-muted small d-block">USUARIO ASIGNADO</span>
                        <span className="fw-semibold"><FaUser className="me-1 text-secondary small"/> {usuarios[t.idUsuario] || `Cargando... (ID ${t.idUsuario})`}</span>
                      </div>
                      <div className="col-md-2 d-none d-md-block text-center">
                        <span className="text-muted small d-block">FECHA CREACIÓN</span>
                        <span className="small">{new Date(t.fechaCreacion).toLocaleDateString()}</span>
                      </div>
                      <div className="col-md-2 text-end pe-4">
                        {getStatusBadge(t.estadoGeneral)}
                      </div>
                    </div>
                    <div className="ms-2">
                      {ticketExpandido === t.idTicket ? <FaChevronUp className="text-muted"/> : <FaChevronDown className="text-muted"/>}
                    </div>
                  </div>

                  {/* Detalle de Observaciones */}
                  {ticketExpandido === t.idTicket && (
                    <div className="card-body bg-light border-top p-4">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h6 className="mb-0 fw-bold text-dark"><FaFilter className="me-2 text-primary"/>Observaciones Registradas</h6>
                        <button 
                          className="btn btn-sm btn-dark px-3"
                          onClick={() => window.location.href = `/crear-observacion/${t.idTicket}`}
                        >
                          + Crear observación
                        </button>
                      </div>

                      {todasObservaciones.filter(o => o.idTicket === t.idTicket).length === 0 ? (
                        <div className="alert alert-light border text-center py-4 mb-0 shadow-sm">
                          <p className="mb-0 text-muted">Aún no hay fallas detalladas para este ticket.</p>
                        </div>
                      ) : (
                        <div className="table-responsive shadow-sm rounded">
                          <table className="table table-hover align-middle mb-0 bg-white">
                            <thead className="table-dark">
                              <tr>
                                <th className="ps-3" style={{ fontSize: '12px' }}>FALLA</th>
                                <th style={{ fontSize: '12px' }}>DESCRIPCIÓN</th>
                                <th style={{ fontSize: '12px' }}>UBICACIÓN</th>
                                <th style={{ fontSize: '12px' }}>URGENCIA</th>
                                <th className="pe-3" style={{ fontSize: '12px' }}>ESTADO REPARACIÓN</th>
                              </tr>
                            </thead>
                            <tbody>
                              {todasObservaciones.filter(o => o.idTicket === t.idTicket).map(obs => (
                                <tr key={obs.idObservacion}>
                                  <td className="ps-3 fw-bold">{obs.falla}</td>
                                  <td><div className="small text-muted" style={{ maxWidth: '300px' }}>{obs.descripcionProblema}</div></td>
                                  <td><span className="badge bg-light text-dark border fw-normal">{obs.ubicacionExacta}</span></td>
                                  <td>
                                    <span className={`badge ${obs.urgencia === 'alta' ? 'bg-danger' : obs.urgencia === 'media' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
                                      {obs.urgencia.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="pe-3">
                                    <select 
                                      className="form-select form-select-sm"
                                      value={obs.estadoObservacion}
                                      onChange={(e) => cambiarEstadoObs(obs.idObservacion, e.target.value)}
                                      disabled={loadingAccion}
                                      style={{ minWidth: '160px', borderLeft: '3px solid #003860' }}
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
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
