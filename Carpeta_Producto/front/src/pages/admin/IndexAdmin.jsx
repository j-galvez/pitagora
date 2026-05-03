import { useEffect, useMemo, useState } from 'react';
import NavbarAdmin from '../../components/NavbarAdmin';
import Footer from '../../components/Footer';
import CardTicket from '../../components/CardTicket';

export default function IndexAdmin() {
  const [obraId, setObraId] = useState('1');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Usuario de prueba o extraído de localStorage
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  const totalObservaciones = useMemo(
    () => tickets.reduce((acc, ticket) => acc + (ticket.observaciones?.length || 0), 0),
    [tickets]
  );

  const cargarTickets = async (idObra) => {
    setLoading(true);
    setError('');
    try {
      // Ajusta este endpoint a tu ruta de backend
      const response = await fetch(`/api/tickets/detalle/obra/${idObra}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'No se pudieron cargar los tickets');
      }

      setTickets(data.data || []);
    } catch (err) {
      setTickets([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTickets(obraId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    cargarTickets(obraId);
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      {/* Barra lateral */}
      <NavbarAdmin usuario={usuarioLogueado} />

      {/* Contenido Principal */}
      <div className="d-flex flex-column flex-grow-1">
        <main className="p-4 flex-grow-1">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-1" style={{ color: '#003860', fontWeight: 'bold' }}>Panel de Control</h1>
              <p className="text-secondary mb-0">Vista general del sistema de postventa</p>
            </div>
          </div>

          {/* Buscador por ID Obra */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <form className="row g-3 align-items-end" onSubmit={handleSubmit}>
                <div className="col-md-6 col-lg-4">
                  <label className="form-label fw-semibold" htmlFor="obraId">ID de Obra</label>
                  <input
                    id="obraId"
                    type="number"
                    min="1"
                    className="form-control"
                    value={obraId}
                    onChange={(e) => setObraId(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-auto">
                  <button className="btn btn-primary w-100 text-white" type="submit" style={{ backgroundColor: '#003860', borderColor: '#003860' }} disabled={loading}>
                    {loading ? 'Cargando...' : 'Buscar tickets'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-uppercase text-secondary small mb-1">Tickets encontrados</p>
                  <p className="display-6 mb-0 fw-bold">{tickets.length}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-uppercase text-secondary small mb-1">Observaciones Totales</p>
                  <p className="display-6 mb-0 fw-bold">{totalObservaciones}</p>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Listado de tickets */}
          <div className="row g-4">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div className="col-md-6 col-lg-4" key={ticket.id_ticket}>
                  <CardTicket ticket={ticket} />
                </div>
              ))
            ) : (
              !loading && <div className="alert alert-light border">No hay tickets para esta obra en el sistema.</div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}