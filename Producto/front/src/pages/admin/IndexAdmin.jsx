import { useEffect, useState } from 'react';
import { FaTicketAlt, FaClipboardList, FaExclamationTriangle, FaChartBar } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import KPICard from '../../components/dashboard/KPICard';
import TopFallasChart from '../../components/dashboard/TopFallasChart';
import { obtenerEstadisticas, obtenerTopFallas } from '../../services/dashboardService';

export default function IndexAdmin() {
  const [stats, setStats] = useState({
    totalTickets: 0,
    ticketsAbiertos: 0,
    observacionesAbiertas: 0,
    observacionesAltaUrgencia: 0
  });
  const [topFallas, setTopFallas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Usuario de prueba o extraído de localStorage
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      // Cargar estadísticas y top fallas en paralelo
      const [estadisticas, fallas] = await Promise.all([
        obtenerEstadisticas(),
        obtenerTopFallas()
      ]);
      
      setStats(estadisticas);
      setTopFallas(fallas);
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout 
      usuario={usuarioLogueado} 
      titulo="Dashboard Administrador"
    >
      <div className="container-fluid py-4">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando estadísticas...</p>
          </div>
        ) : (
          <>
            {/* KPIs - Tarjetas de estadísticas */}
            <div className="row g-4 mb-4">
              <div className="col-12 col-sm-6 col-lg-3">
                <KPICard
                  titulo="Total de Tickets"
                  valor={stats.totalTickets}
                  icono={<FaTicketAlt />}
                  color="primary"
                />
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <KPICard
                  titulo="Tickets Abiertos"
                  valor={stats.ticketsAbiertos}
                  icono={<FaClipboardList />}
                  color="info"
                />
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <KPICard
                  titulo="Observaciones Abiertas"
                  valor={stats.observacionesAbiertas}
                  icono={<FaChartBar />}
                  color="success"
                />
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <KPICard
                  titulo="Alta Urgencia"
                  valor={stats.observacionesAltaUrgencia}
                  icono={<FaExclamationTriangle />}
                  color="danger"
                />
              </div>
            </div>

            {/* Gráfico de Top Fallas */}
            <div className="row g-4">
              <div className="col-12 col-lg-8">
                <TopFallasChart datos={topFallas} />
              </div>
              
              {/* Panel de acciones rápidas */}
              <div className="col-12 col-lg-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title mb-4">Acciones Rápidas</h5>
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-primary text-white"
                        style={{ backgroundColor: '#003860', borderColor: '#003860' }}
                        onClick={() => window.location.href = '/crear-obra'}
                      >
                        <FaTicketAlt className="me-2" />
                        Nueva Obra
                      </button>
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => window.location.href = '/crear-cliente'}
                      >
                        Nuevo Cliente
                      </button>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => window.location.href = '/crear-usuario'}
                      >
                        Nuevo Usuario
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resumen rápido */}
                <div className="card border-0 shadow-sm mt-4">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Resumen</h5>
                    <ul className="list-unstyled mb-0">
                      <li className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small">Tasa de Tickets Abiertos</span>
                        <span className="badge bg-info">
                          {stats.totalTickets > 0 
                            ? `${Math.round((stats.ticketsAbiertos / stats.totalTickets) * 100)}%`
                            : '0%'
                          }
                        </span>
                      </li>
                      <li className="d-flex justify-content-between align-items-center">
                        <span className="text-muted small">Observaciones Críticas</span>
                        <span className="badge bg-danger">
                          {stats.observacionesAltaUrgencia}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

// Made with Bob
