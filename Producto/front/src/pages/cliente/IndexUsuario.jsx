import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarUsuario from '../../components/NavbarUsuario';
import Footer from '../../components/Footer';
import CardObservacion from '../../components/CardObservacion';
import ObservacionDetalleModal from '../../components/ObservacionDetalleModal';
import { ticketsService } from '../../services/ticketsService';
import { observacionesService } from '../../services/observacionesService';
import { puedeCrearTicketOuObservacion, mensajeBloqueoCreacion } from '../../utils/estadoEntidades';

const API_URL = 'http://localhost:8080/api';

const getTicketEstado = (ticket) =>
  (ticket.estadoGeneral || ticket.estado_general || '').toLowerCase();

const isTicketActivo = (ticket) => {
  const est = getTicketEstado(ticket);
  return est === 'abierto' || est === 'en proceso';
};

const isTicketTerminado = (ticket) => getTicketEstado(ticket) === 'terminado';

const getTicketId = (ticket) => ticket.idTicket || ticket.id_ticket;

const getTicketObraId = (ticket) => ticket.idObra || ticket.id_obra;

const getStatusStyle = (estado) => {
  switch (estado) {
    case 'abierto': return { backgroundColor: '#FFC107', color: '#000000' };
    case 'en proceso': return { backgroundColor: '#003860', color: '#FFFFFF' };
    case 'terminado': return { backgroundColor: '#28A745', color: '#FFFFFF' };
    default: return { backgroundColor: '#91ABC6', color: '#FFFFFF' };
  }
};

export default function IndexUsuario() {
  const [todosLosTickets, setTodosLosTickets] = useState([]);
  const [vistaActiva, setVistaActiva] = useState('activas');
  const [ticketSeleccionadoId, setTicketSeleccionadoId] = useState(null);
  const [nombresObra, setNombresObra] = useState({});
  const [obraUsuario, setObraUsuario] = useState(null);
  const [observaciones, setObservaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingObservaciones, setLoadingObservaciones] = useState(false);
  const [error, setError] = useState('');
  const [observacionSeleccionada, setObservacionSeleccionada] = useState(null);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const navigate = useNavigate();

  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {};
  const idUsuario = usuarioLogueado.idUsuario || usuarioLogueado.id_usuario;
  const idObraUsuario = usuarioLogueado.idObra || usuarioLogueado.id_obra;

  const puedeCrear = puedeCrearTicketOuObservacion(obraUsuario);
  const mensajeBloqueo = obraUsuario ? mensajeBloqueoCreacion(obraUsuario) : '';

  const ticketsActivos = todosLosTickets.filter(isTicketActivo);
  const ticketsTerminados = todosLosTickets.filter(isTicketTerminado);
  const ticketSeleccionado =
    todosLosTickets.find((t) => getTicketId(t) === ticketSeleccionadoId) ?? null;

  const cargarObraUsuario = async () => {
    if (!idObraUsuario) {
      setObraUsuario(null);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/obras/${idObraUsuario}`);
      if (response.ok) {
        setObraUsuario(await response.json());
      } else {
        setObraUsuario(null);
      }
    } catch {
      setObraUsuario(null);
    }
  };

  const cargarNombresObra = async (tickets) => {
    const desdeSesion =
      usuarioLogueado.nombre_obra ||
      usuarioLogueado.nombreObra ||
      usuarioLogueado.obraActual;

    const ids = [...new Set(tickets.map(getTicketObraId).filter(Boolean))];
    const cache = {};

    if (desdeSesion && ids.length === 1) {
      cache[ids[0]] = desdeSesion;
    }

    await Promise.all(
      ids.map(async (idObra) => {
        if (cache[idObra]) return;
        try {
          const response = await fetch(`${API_URL}/obras/${idObra}`);
          if (response.ok) {
            const data = await response.json();
            cache[idObra] = data.nombreObra || data.nombre_obra || `Obra #${idObra}`;
          } else {
            cache[idObra] = `Obra #${idObra}`;
          }
        } catch {
          cache[idObra] = `Obra #${idObra}`;
        }
      })
    );

    setNombresObra(cache);
  };

  const getNombreObra = (ticket) => {
    const idObra = getTicketObraId(ticket);
    if (!idObra) return '';
    return nombresObra[idObra] || `Obra #${idObra}`;
  };

  const cargarObservaciones = async (idTicket) => {
    setLoadingObservaciones(true);
    try {
      const data = await observacionesService.getObservacionesByTicket(idTicket);
      setObservaciones(data || []);
    } catch {
      setObservaciones([]);
    } finally {
      setLoadingObservaciones(false);
    }
  };

  const seleccionarTicket = async (idTicket) => {
    setTicketSeleccionadoId(idTicket);
    await cargarObservaciones(idTicket);
  };

  const cambiarVista = (nuevaVista) => {
    setVistaActiva(nuevaVista);
    const lista = nuevaVista === 'activas' ? ticketsActivos : ticketsTerminados;
    if (lista.length > 0) {
      seleccionarTicket(getTicketId(lista[0]));
    } else {
      setTicketSeleccionadoId(null);
      setObservaciones([]);
    }
  };

  const cargarDashboard = async () => {
    if (!idUsuario) {
      setError('No se pudo identificar al usuario.');
      return;
    }

    setLoading(true);
    setError('');
    setTodosLosTickets([]);
    setTicketSeleccionadoId(null);
    setObservaciones([]);
    setNombresObra({});

    try {
      await cargarObraUsuario();
      const data = await ticketsService.getTicketsByUsuario(idUsuario);
      const tickets = data || [];
      setTodosLosTickets(tickets);
      await cargarNombresObra(tickets);

      const activos = tickets.filter(isTicketActivo);
      setVistaActiva('activas');

      if (activos.length > 0) {
        await seleccionarTicket(getTicketId(activos[0]));
      }
    } catch {
      setError('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ticketId = ticketSeleccionado ? getTicketId(ticketSeleccionado) : null;
  const estadoTicket = ticketSeleccionado ? getTicketEstado(ticketSeleccionado) : '';
  const fechaCreacion = ticketSeleccionado
    ? new Date(ticketSeleccionado.fechaCreacion || ticketSeleccionado.fecha_creacion).toLocaleDateString()
    : '';
  const esTicketActivoSeleccionado = ticketSeleccionado && isTicketActivo(ticketSeleccionado);
  const mostrarAgregarObservacion = vistaActiva === 'activas' && esTicketActivoSeleccionado && puedeCrear;

  const renderObservaciones = () => {
    if (loadingObservaciones) {
      return (
        <div className="text-center p-4">
          <div className="spinner-border spinner-border-sm text-primary" role="status" style={{ color: '#003860' }}></div>
        </div>
      );
    }

    if (observaciones.length > 0) {
      return observaciones.map((obs) => (
        <CardObservacion
          key={obs.idObservacion || obs.id_observacion}
          observacion={obs}
          onVerDetalle={(idObservacion) => {
            setObservacionSeleccionada(idObservacion);
            setShowDetalleModal(true);
          }}
        />
      ));
    }

    if (mostrarAgregarObservacion) {
      return (
        <div className="alert alert-light border text-center py-4">
          <i className="bi bi-inbox fs-3 d-block mb-2 text-secondary"></i>
          <p className="mb-3">Aún no has registrado problemas en esta solicitud.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/crear-observacion/${ticketId}`)}
            style={{ backgroundColor: '#003860', borderColor: '#003860' }}
          >
            Agregar primera observación
          </button>
        </div>
      );
    }

    return (
      <div className="alert alert-light border text-center py-4">
        <i className="bi bi-inbox fs-3 d-block mb-2 text-secondary"></i>
        <p className="mb-0">Esta solicitud no tiene observaciones registradas.</p>
      </div>
    );
  };

  const renderDetalleTicket = (titulo) => (
    <>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
            <h2 className="h5 mb-0" style={{ color: '#003860', fontWeight: 'bold' }}>
              {titulo} — Ticket #{ticketId}
            </h2>
            <span className="badge rounded-pill px-3 py-2" style={getStatusStyle(estadoTicket)}>
              {estadoTicket}
            </span>
          </div>
          <div className="row">
            <div className="col-md-6 mb-2 mb-md-0">
              <h6 className="text-secondary small mb-1">Obra</h6>
              <p className="mb-0">{getNombreObra(ticketSeleccionado)}</p>
            </div>
            <div className="col-md-6">
              <h6 className="text-secondary small mb-1">Fecha de creación</h6>
              <p className="mb-0">{fechaCreacion}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <h2 className="h5 mb-0" style={{ color: '#003860', fontWeight: 'bold' }}>
          Observaciones ({observaciones.length})
        </h2>
      </div>

      {renderObservaciones()}
    </>
  );

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <NavbarUsuario usuario={usuarioLogueado} />

      <div className="d-flex flex-column flex-grow-1" style={{ height: '100vh', minWidth: 0 }}>
        <nav className="navbar navbar-dark flex-shrink-0" style={{ backgroundColor: '#002840' }}>
          <div className="container-fluid d-flex justify-content-between align-items-center py-2">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-light d-lg-none me-2"
                data-bs-toggle="offcanvas"
                data-bs-target="#navbarUsuarioOffcanvas"
                aria-controls="navbarUsuarioOffcanvas"
              >
                <i className="bi bi-list"></i> Menú
              </button>
              <h4 className="text-white mb-0">Mis Solicitudes</h4>
            </div>
          </div>
        </nav>

        <div className="flex-grow-1 overflow-auto" style={{ minHeight: 0 }}>
          <main className="p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
              <div>
                <h1 className="h3 mb-1" style={{ color: '#003860', fontWeight: 'bold' }}>Mis Solicitudes</h1>
                <p className="text-secondary mb-0">
                  Revisa tus solicitudes activas o consulta el historial de solicitudes terminadas.
                </p>
              </div>
              {mostrarAgregarObservacion ? (
                <button
                  className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
                  onClick={() => navigate(`/crear-observacion/${ticketId}`)}
                  style={{ backgroundColor: '#003860', borderColor: '#003860' }}
                >
                  <i className="bi bi-plus-lg"></i>
                  <span>Agregar Observación</span>
                </button>
              ) : vistaActiva === 'activas' && ticketsActivos.length === 0 && puedeCrear ? (
                <button
                  className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
                  onClick={() => navigate('/crear-ticket')}
                  style={{ backgroundColor: '#003860', borderColor: '#003860' }}
                >
                  <i className="bi bi-plus-lg"></i>
                  <span>Nuevo ticket</span>
                </button>
              ) : null}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && obraUsuario && !puedeCrear && (
              <div className="alert alert-warning d-flex align-items-start mb-4">
                <i className="bi bi-exclamation-triangle-fill me-2 mt-1"></i>
                <div>{mensajeBloqueo}</div>
              </div>
            )}

            {loading ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status" style={{ color: '#003860' }}></div>
              </div>
            ) : (
              <>
                <ul className="nav nav-tabs mb-4">
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${vistaActiva === 'activas' ? 'active' : ''}`}
                      onClick={() => cambiarVista('activas')}
                      style={vistaActiva === 'activas' ? { color: '#003860', fontWeight: '600' } : {}}
                    >
                      Activas ({ticketsActivos.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${vistaActiva === 'terminadas' ? 'active' : ''}`}
                      onClick={() => cambiarVista('terminadas')}
                      style={vistaActiva === 'terminadas' ? { color: '#003860', fontWeight: '600' } : {}}
                    >
                      Terminadas ({ticketsTerminados.length})
                    </button>
                  </li>
                </ul>

                {vistaActiva === 'activas' && (
                  esTicketActivoSeleccionado
                    ? renderDetalleTicket('Solicitud activa')
                    : (
                      <div className="alert alert-light border text-center py-5">
                        <i className="bi bi-file-earmark-plus fs-1 d-block mb-3 text-secondary"></i>
                        <p className="mb-3">No tienes un ticket activo en este momento.</p>
                        {puedeCrear ? (
                          <button
                            className="btn btn-primary"
                            onClick={() => navigate('/crear-ticket')}
                            style={{ backgroundColor: '#003860', borderColor: '#003860' }}
                          >
                            Crear nuevo ticket
                          </button>
                        ) : (
                          <p className="text-secondary mb-0 small">{mensajeBloqueo}</p>
                        )}
                      </div>
                    )
                )}

                {vistaActiva === 'terminadas' && (
                  ticketsTerminados.length === 0 ? (
                    <div className="alert alert-light border text-center py-5">
                      <i className="bi bi-inbox fs-1 d-block mb-3 text-secondary"></i>
                      <p className="mb-0">No tienes solicitudes terminadas.</p>
                    </div>
                  ) : (
                    <>
                      <div className="d-flex flex-column gap-2 mb-4">
                        {ticketsTerminados.map((ticket) => {
                          const id = getTicketId(ticket);
                          const seleccionado = id === ticketSeleccionadoId;
                          const fecha = new Date(
                            ticket.fechaCreacion || ticket.fecha_creacion
                          ).toLocaleDateString();

                          return (
                            <button
                              key={id}
                              type="button"
                              className={`card shadow-sm border-0 text-start w-100 ${seleccionado ? 'border border-2' : ''}`}
                              style={{
                                cursor: 'pointer',
                                borderColor: seleccionado ? '#003860' : undefined,
                              }}
                              onClick={() => seleccionarTicket(id)}
                            >
                              <div className="card-body py-3">
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                                  <div>
                                    <span className="fw-semibold" style={{ color: '#003860' }}>
                                      Ticket #{id}
                                    </span>
                                    <span className="text-secondary ms-2 small">{getNombreObra(ticket)}</span>
                                  </div>
                                  <div className="d-flex align-items-center gap-2">
                                    <span className="text-secondary small">{fecha}</span>
                                    <span
                                      className="badge rounded-pill px-2 py-1"
                                      style={getStatusStyle('terminado')}
                                    >
                                      terminado
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {ticketSeleccionado && isTicketTerminado(ticketSeleccionado) &&
                        renderDetalleTicket('Solicitud terminada')}
                    </>
                  )
                )}
              </>
            )}
          </main>

          <Footer />
        </div>
      </div>

      <ObservacionDetalleModal
        show={showDetalleModal}
        onHide={() => {
          setShowDetalleModal(false);
          setObservacionSeleccionada(null);
        }}
        idObservacion={observacionSeleccionada}
        allowEstadoChange={false}
      />
    </div>
  );
}
