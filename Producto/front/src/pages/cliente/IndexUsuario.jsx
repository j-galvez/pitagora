import { useEffect, useState } from 'react';
import NavbarUsuario from '../../components/NavbarUsuario';
import Footer from '../../components/Footer';
import CardTicket from '../../components/CardTicket';

export default function IndexUsuario() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Juan Pérez',
    obraActual: 'Edificio Los Almendros - Depto 305'
  };

  const cargarMisTickets = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulación o petición a endpoint específico de usuario
      const response = await fetch(`/api/tickets/usuario/${usuarioLogueado.id_usuario}`);
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
          <div className="mb-4">
            <h1 className="h3 mb-1" style={{ color: '#003860', fontWeight: 'bold' }}>Mis Solicitudes</h1>
            <p className="text-secondary mb-0">Revisa el estado de tus tickets y observaciones de postventa.</p>
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