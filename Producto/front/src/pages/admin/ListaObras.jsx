import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaEye, FaPlus, FaArrowLeft } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { obrasService } from '../../services/obrasService';

const ListaObras = () => {
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Todos');

  useEffect(() => {
    cargarObras();
  }, []);

  const cargarObras = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await obrasService.getAllObras();
      setObras(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar las obras');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/admin-dashboard');
  };

  const handleVerDetalle = (idObra) => {
    navigate(`/admin/obras/${idObra}`);
  };

  const handleCrearObra = () => {
    navigate('/admin/crear-obra');
  };

  const filteredObras = obras.filter((obra) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      obra.nombreObra?.toLowerCase().includes(lowerSearch) ||
      obra.nombreEmpresa?.toLowerCase().includes(lowerSearch) ||
      obra.nombreRegion?.toLowerCase().includes(lowerSearch) ||
      obra.nombreComuna?.toLowerCase().includes(lowerSearch);

    if (activeTab === 'Todos') return matchesSearch;
    if (activeTab === 'Activas') return matchesSearch && obra.estadoObra === 'Activa';
    if (activeTab === 'Garantía Vencida') return matchesSearch && obra.estadoObra === 'Garantía Vencida';
    if (activeTab === 'Cerradas') return matchesSearch && obra.estadoObra === 'Cerrada';
    return matchesSearch;
  });

  const getEstadoBadgeClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activa':
        return 'bg-success';
      case 'garantía vencida':
        return 'bg-warning text-dark';
      case 'cerrada':
        return 'bg-secondary';
      default:
        return 'bg-primary';
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <AdminLayout 
      usuario={usuarioLogueado} 
      titulo="Gestión de Obras" 
      handleVolver={handleVolver}
    >
      <div className="container py-4">
        <div className="card shadow-sm border-0 rounded-3 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Obras Registradas</h5>
            <button 
              className="btn btn-primary"
              onClick={handleCrearObra}
            >
              <FaPlus className="me-2" />
              Nueva Obra
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
                  placeholder="Buscar por nombre, cliente, región o comuna..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 d-flex justify-content-md-end gap-1 flex-wrap">
              {['Todos', 'Activas', 'Garantía Vencida', 'Cerradas'].map((tab) => (
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
                  <th>Nombre de Obra</th>
                  <th>Cliente</th>
                  <th>Región</th>
                  <th>Comuna</th>
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
                      <div className="mt-2">Cargando obras...</div>
                    </td>
                  </tr>
                ) : filteredObras.length > 0 ? (
                  filteredObras.map((obra) => (
                    <tr 
                      key={obra.idObra} 
                      style={{ fontSize: '14px', cursor: 'pointer' }}
                      onClick={() => handleVerDetalle(obra.idObra)}
                    >
                      <td className="fw-semibold">{obra.nombreObra}</td>
                      <td>{obra.nombreEmpresa || '-'}</td>
                      <td>{obra.nombreRegion || '-'}</td>
                      <td>{obra.nombreComuna || '-'}</td>
                      <td>
                        <span className={`badge ${getEstadoBadgeClass(obra.estadoObra)}`}>
                          {obra.estadoObra || 'Sin estado'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-light btn-sm text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerDetalle(obra.idObra);
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
                      No se encontraron obras.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredObras.length > 0 && (
            <div className="mt-3 text-muted" style={{ fontSize: '14px' }}>
              Mostrando {filteredObras.length} de {obras.length} obras
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ListaObras;

// Made with Bob
