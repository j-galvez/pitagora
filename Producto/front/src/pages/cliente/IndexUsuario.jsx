import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarUsuario from '../../components/NavbarUsuario';
import Footer from '../../components/Footer';
import CardTicket from '../../components/CardTicket';

export default function IndexUsuario() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Juan Pérez',
    obraActual: 'Edificio Los Almendros - Depto 305'
  };

  const cargarMisTickets = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulación o petición a endpoint específico de usuario
      const response = await fetch(`http://localhost:8080/api/tickets/usuario/${usuarioLogueado.id_usuario}?estado=abierto`);
      if (!response.ok) throw new Error('Error al cargar tickets');
      const data = await response.json();
      
      setTickets(data || []);
    } catch (err) {
      setError('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMisTickets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openTicket = tickets.find(t => t.estado_general === 'abierto' || t.estado_general === 'en proceso');

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      <NavbarUsuario usuario={usuarioLogueado} />

      <div className="d-flex flex-column flex-grow-1">
        <nav className="navbar navbar-dark" style={{ backgroundColor: '#002840' }}>
          <div className="container-fluid">
            <button className="btn btn-outline-light" data-bs-toggle="offcanvas" data-bs-target="#navbarUsuarioOffcanvas" aria-controls="navbarUsuarioOffcanvas">
              <i className="bi bi-list"></i> Menú
            </button>
          </div>
        </nav>
        <main className="p-4 flex-grow-1">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-1" style={{ color: '#003860', fontWeight: 'bold' }}>Mis Solicitudes</h1>
              <p className="text-secondary mb-0">Revisa el estado de tus tickets y observaciones de postventa.</p>
            </div>
            {openTicket ? (
              <button 
                className="btn btn-info d-flex align-items-center gap-2 shadow-sm text-white"
                onClick={() => navigate(`/crear-observacion/${openTicket.idTicket || openTicket.id_ticket}`)}
                style={{ backgroundColor: '#0056b3', borderColor: '#0056b3' }}
              >
                <i className="bi bi-pencil-square"></i>
                <span>Gestionar Solicitud Abierta</span>
              </button>
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
          ) : (
            <div className="row g-4">
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <div className="col-md-6 col-lg-4" key={ticket.id_ticket}>
                    <CardTicket ticket={ticket} />
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="alert alert-light border">No tienes solicitudes registradas actualmente.</div>
                </div>
              )}
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
