import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaEye, FaPlus, FaArrowLeft, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import ObraDetalleModal from '../../components/ObraDetalleModal';
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
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [selectedObraId, setSelectedObraId] = useState(null);

  useEffect(() => {
    cargarObras();
  }, []);

  const cargarObras = async () => {
    setLoading(true);
    setError('');

    try {
      // El backend ahora hace el trabajo mediante un DTO (findAllObrasConDetalles).
      // Envía los nombres exactos: nombreEmpresa, nombreRegion, nombreComuna.
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
    setSelectedObraId(idObra);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedObraId(null);
  };

  const handleCrearObra = () => {
    navigate('/admin/crear-obra');
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return <FaSort className="ms-1" style={{ opacity: 0.3 }} />;
    return sortDirection === 'asc' ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
  };

  const filteredObras = obras.filter((obra) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      (obra.nombreObra || obra.nombre_obra)?.toLowerCase().includes(lowerSearch) ||
      (obra.nombreEmpresa || obra.nombre_empresa)?.toLowerCase().includes(lowerSearch) ||
      (obra.nombreRegion || obra.nombre_region)?.toLowerCase().includes(lowerSearch) ||
      (obra.nombreComuna || obra.nombre_comuna)?.toLowerCase().includes(lowerSearch);

    if (activeTab === 'Todos') return matchesSearch;
    const estado = obra.estadoObra || obra.estado_obra;
    if (activeTab === 'Activas') return matchesSearch && estado === 'Activa';
    if (activeTab === 'Garantía Vencida') return matchesSearch && estado === 'Garantía Vencida';
    if (activeTab === 'Cerradas') return matchesSearch && estado === 'Cerrada';
    return matchesSearch;
  });

  const sortedObras = [...filteredObras].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue, bValue;

    switch (sortColumn) {
      case 'nombre':
        aValue = (a.nombreObra || a.nombre_obra || '').toLowerCase();
        bValue = (b.nombreObra || b.nombre_obra || '').toLowerCase();
        break;
      case 'cliente':
        aValue = (a.nombreEmpresa || a.nombre_empresa || '').toLowerCase();
        bValue = (b.nombreEmpresa || b.nombre_empresa || '').toLowerCase();
        break;
      case 'observaciones':
        // Ordenamiento numérico para observaciones abiertas
        aValue = a.numeroObservacionesAbiertas || 0;
        bValue = b.numeroObservacionesAbiertas || 0;
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      case 'region':
        aValue = (a.nombreRegion || a.nombre_region || '').toLowerCase();
        bValue = (b.nombreRegion || b.nombre_region || '').toLowerCase();
        break;
      case 'comuna':
        aValue = (a.nombreComuna || a.nombre_comuna || '').toLowerCase();
        bValue = (b.nombreComuna || b.nombre_comuna || '').toLowerCase();
        break;
      case 'estado':
        aValue = (a.estadoObra || a.estado_obra || '').toLowerCase();
        bValue = (b.estadoObra || b.estado_obra || '').toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
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
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('nombre')}>
                    Nombre de Obra {getSortIcon('nombre')}
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('cliente')}>
                    Cliente {getSortIcon('cliente')}
                  </th>
                  <th className="text-center" style={{ cursor: 'pointer' }} onClick={() => handleSort('observaciones')}>
                    N° Obs. Abiertas {getSortIcon('observaciones')}
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('region')}>
                    Región {getSortIcon('region')}
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('comuna')}>
                    Comuna {getSortIcon('comuna')}
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('estado')}>
                    Estado {getSortIcon('estado')}
                  </th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      <div className="mt-2">Cargando obras...</div>
                    </td>
                  </tr>
                ) : sortedObras.length > 0 ? (
                  sortedObras.map((obra) => (
                    <tr 
                      key={obra.idObra || obra.id_obra} 
                      style={{ fontSize: '14px', cursor: 'pointer' }}
                      onClick={() => handleVerDetalle(obra.idObra || obra.id_obra)}
                    >
                      <td className="fw-semibold">{obra.nombreObra || obra.nombre_obra}</td>
                      <td>{obra.nombreEmpresa || obra.nombre_empresa || '-'}</td>
                      <td className="text-center">
                        <span className={`badge ${ (obra.numeroObservacionesAbiertas || 0) > 0 ? 'bg-danger' : 'bg-secondary' }`}>
                          {obra.numeroObservacionesAbiertas || 0}
                        </span>
                      </td>
                      <td>{obra.nombreRegion || obra.nombre_region || '-'}</td>
                      <td>{obra.nombreComuna || obra.nombre_comuna || '-'}</td>
                      <td>
                        <span className={`badge ${getEstadoBadgeClass(obra.estadoObra || obra.estado_obra)}`}>
                          {obra.estadoObra || obra.estado_obra || 'Sin estado'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-light btn-sm text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerDetalle(obra.idObra || obra.id_obra);
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
                    <td colSpan="7" className="text-center text-muted py-3">
                      No se encontraron obras.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!loading && sortedObras.length > 0 && (
            <div className="mt-3 text-muted" style={{ fontSize: '14px' }}>
              Mostrando {sortedObras.length} de {obras.length} obras
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle de Obra */}
      <ObraDetalleModal
        show={showModal}
        onHide={handleCloseModal}
        idObra={selectedObraId}
      />
    </AdminLayout>
  );
};

export default ListaObras;

// Made with Bob
