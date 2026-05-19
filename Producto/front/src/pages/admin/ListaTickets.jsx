import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaEye, FaPlus, FaArrowLeft } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { ticketsService } from '../../services/ticketsService';

const ListaTickets = () => {
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Todos');

  useEffect(() => {
    cargarTickets();
  }, []);

  const cargarTickets = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await ticketsService.getAllTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/admin-dashboard');
  };

  const handleVerDetalle = (idTicket) => {
    navigate(`/admin/tickets/${idTicket}`);
  };

  const handleCrearTicket = () => {
    navigate('/crear-ticket');
  };

  const filteredTickets = tickets.filter((ticket) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      ticket.idTicket?.toString().includes(lowerSearch) ||
      ticket.idObra?.toString().includes(lowerSearch);

    if (activeTab === 'Todos') return matchesSearch;
    if (activeTab === 'Abiertos') return matchesSearch && ticket.estadoGeneral === 'abierto';
    if (activeTab === 'En Proceso') return matchesSearch && ticket.estadoGeneral === 'en proceso';
    if (activeTab === 'Terminados') return matchesSearch && ticket.estadoGeneral === 'terminado';
    return matchesSearch;
  });

  const getEstadoBadgeClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'abierto':
        return 'bg-primary';
      case 'en proceso':
        return 'bg-warning text-dark';
      case 'terminado':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <h5 className="mb-0">Tickets del Sistema</h5>
            <button 
              className="btn btn-primary"
              onClick={handleCrearTicket}
            >
              <FaPlus className="me-2" />
              Crear Ticket
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="row g-3 mb-4 align-items-center justify-content-between">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><FaSearch /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por ID de ticket u obra..."
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
                  <th>ID Ticket</th>
                  <th>ID Obra</th>
                  <th>Usuario Creador</th>
                  <th>Fecha Creación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      <div className="mt-2">Cargando tickets...</div>
                    </td>
                  </tr>
                ) : filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr 
                      key={ticket.idTicket} 
                      style={{ fontSize: '14px', cursor: 'pointer' }}
                      onClick={() => handleVerDetalle(ticket.idTicket)}
                    >
                      <td className="fw-semibold">#{ticket.idTicket}</td>
                      <td>Obra #{ticket.idObra}</td>
                      <td>Usuario #{ticket.idUsuarioCreador}</td>
                      <td>{formatFecha(ticket.fechaCreacion)}</td>
                      <td>
                        <span className={`badge ${getEstadoBadgeClass(ticket.estadoGeneral)}`}>
                          {ticket.estadoGeneral || 'Sin estado'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-light btn-sm text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerDetalle(ticket.idTicket);
                          }}
                        >
                          <FaEye className="me-1" />
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-3">
                      No se encontraron tickets.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredTickets.length > 0 && (
            <div className="mt-3 text-muted" style={{ fontSize: '14px' }}>
              Mostrando {filteredTickets.length} de {tickets.length} tickets
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ListaTickets;

// Made with Bob
