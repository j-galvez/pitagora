import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarUsuario from '../../components/NavbarUsuario';
import Footer from '../../components/Footer';
import CardObservacion from '../../components/CardObservacion';
import ObservacionDetalleModal from '../../components/ObservacionDetalleModal';
import { ticketsService } from '../../services/ticketsService';
import { observacionesService } from '../../services/observacionesService';

const API_URL = 'http://localhost:8080/api';

const getTicketEstado = (ticket) =>
  (ticket.estadoGeneral || ticket.estado_general || '').toLowerCase();

const isTicketActivo = (ticket) => {
  const est = getTicketEstado(ticket);
  return est === 'abierto' || est === 'en proceso';
};

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
  const [ticketActivo, setTicketActivo] = useState(null);
  const [observaciones, setObservaciones] = useState([]);
  const [nombreObra, setNombreObra] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingObservaciones, setLoadingObservaciones] = useState(false);
  const [error, setError] = useState('');
  const [observacionSeleccionada, setObservacionSeleccionada] = useState(null);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const navigate = useNavigate();

  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {};
  const idUsuario = usuarioLogueado.idUsuario || usuarioLogueado.id_usuario;

  const resolverNombreObra = async (ticket) => {
    const desdeSesion =
      usuarioLogueado.nombre_obra ||
      usuarioLogueado.nombreObra ||
      usuarioLogueado.obraActual;

    if (desdeSesion) {
      setNombreObra(desdeSesion);
      return;
    }

    const idObra = getTicketObraId(ticket);
    if (!idObra) {
      setNombreObra('');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/obras/${idObra}`);
      if (response.ok) {
        const data = await response.json();
        setNombreObra(data.nombreObra || data.nombre_obra || `Obra #${idObra}`);
      } else {
        setNombreObra(`Obra #${idObra}`);
      }
    } catch {
      setNombreObra(`Obra #${idObra}`);
    }
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

  const cargarDashboard = async () => {
    if (!idUsuario) {
      setError('No se pudo identificar al usuario.');
      return;
    }

    setLoading(true);
    setError('');
    setTicketActivo(null);
    setObservaciones([]);
    setNombreObra('');

    try {
      const data = await ticketsService.getTicketsByUsuario(idUsuario);
      const activo = (data || []).find(isTicketActivo);

      if (activo) {
        setTicketActivo(activo);
        await resolverNombreObra(activo);
        await cargarObservaciones(getTicketId(activo));
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

  const ticketId = ticketActivo ? getTicketId(ticketActivo) : null;
  const estadoTicket = ticketActivo ? getTicketEstado(ticketActivo) : '';
  const fechaCreacion = ticketActivo
    ? new Date(ticketActivo.fechaCreacion || ticketActivo.fecha_creacion).toLocaleDateString()
    : '';

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      <NavbarUsuario usuario={usuarioLogueado} hasActiveTicket={!!ticketActivo} />

      <div className="d-flex flex-column flex-grow-1">
        <nav className="navbar navbar-dark" style={{ backgroundColor: '#002840' }}>
          <div className="container-fluid">
            <button className="btn btn-outline-light" data-bs-toggle="offcanvas" data-bs-target="#navbarUsuarioOffcanvas" aria-controls="navbarUsuarioOffcanvas">
              <i className="bi bi-list"></i> Menú
            </button>
          </div>
        </nav>
        <main className="p-4 flex-grow-1">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
            <div>
              <h1 className="h3 mb-1" style={{ color: '#003860', fontWeight: 'bold' }}>Mis Solicitudes</h1>
              <p className="text-secondary mb-0">Revisa el estado de tu solicitud activa y sus observaciones de postventa.</p>
            </div>
            {ticketActivo ? (
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-info d-flex align-items-center gap-2 shadow-sm text-white"
                  onClick={() => navigate(`/crear-observacion/${ticketId}`)}
                  style={{ backgroundColor: '#0056b3', borderColor: '#0056b3' }}
                >
                  <i className="bi bi-pencil-square"></i>
                  <span>Gestionar Solicitud</span>
                </button>
                <button
                  className="btn btn-outline-primary d-flex align-items-center gap-2 shadow-sm"
                  onClick={() => navigate(`/crear-observacion/${ticketId}`)}
                  style={{ borderColor: '#003860', color: '#003860' }}
                >
                  <i className="bi bi-plus-lg"></i>
                  <span>Agregar Observación</span>
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
                onClick={() => navigate('/crear-ticket')}
                style={{ backgroundColor: '#003860', borderColor: '#003860' }}
              >
                <i className="bi bi-plus-lg"></i>
                <span>Nueva Solicitud</span>
              </button>
            )}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status" style={{ color: '#003860' }}></div>
            </div>
          ) : ticketActivo ? (
            <>
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
                    <h2 className="h5 mb-0" style={{ color: '#003860', fontWeight: 'bold' }}>
                      Solicitud activa — Ticket #{ticketId}
                    </h2>
                    <span className="badge rounded-pill px-3 py-2" style={getStatusStyle(estadoTicket)}>
                      {estadoTicket}
                    </span>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-2 mb-md-0">
                      <h6 className="text-secondary small mb-1">Obra</h6>
                      <p className="mb-0">{nombreObra || `Obra #${getTicketObraId(ticketActivo)}`}</p>
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

              {loadingObservaciones ? (
                <div className="text-center p-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status" style={{ color: '#003860' }}></div>
                </div>
              ) : observaciones.length > 0 ? (
                observaciones.map((obs) => (
                  <CardObservacion
                    key={obs.idObservacion || obs.id_observacion}
                    observacion={obs}
                    onVerDetalle={(idObservacion) => {
                      setObservacionSeleccionada(idObservacion);
                      setShowDetalleModal(true);
                    }}
                  />
                ))
              ) : (
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
              )}
            </>
          ) : (
            <div className="alert alert-light border text-center py-5">
              <i className="bi bi-file-earmark-plus fs-1 d-block mb-3 text-secondary"></i>
              <p className="mb-3">No tienes una solicitud activa en este momento.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/crear-ticket')}
                style={{ backgroundColor: '#003860', borderColor: '#003860' }}
              >
                Crear nueva solicitud
              </button>
            </div>
          )}
        </main>

        <Footer />
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
