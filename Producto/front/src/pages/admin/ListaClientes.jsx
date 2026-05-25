import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaEye, FaPlus, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import ClienteDetalleModal from '../../components/ClienteDetalleModal';
import { clientesService } from '../../services/clientesService';

const ListaClientes = () => {
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [showModalDetalle, setShowModalDetalle] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await clientesService.getAllClientes();
      setClientes(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/admin-dashboard');
  };

  const handleVerDetalle = (idCliente) => {
    setClienteSeleccionado(idCliente);
    setShowModalDetalle(true);
  };

  const handleCrearCliente = () => {
    navigate('/admin/crear-cliente');
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

  const filteredClientes = clientes.filter((cliente) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      (cliente.nombreEmpresa || cliente.nombre_empresa)?.toLowerCase().includes(lowerSearch) ||
      (cliente.correoContacto || cliente.correo_contacto)?.toLowerCase().includes(lowerSearch) ||
      (cliente.rut)?.toLowerCase().includes(lowerSearch)
    );
  });

  const sortedClientes = [...filteredClientes].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue, bValue;

    switch (sortColumn) {
      case 'nombre':
        aValue = (a.nombreEmpresa || a.nombre_empresa || '').toLowerCase();
        bValue = (b.nombreEmpresa || b.nombre_empresa || '').toLowerCase();
        break;
      case 'obras':
        // Ordenamiento numérico para obras
        aValue = a.numeroObras || 0;
        bValue = b.numeroObras || 0;
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      case 'observaciones':
        // Ordenamiento numérico para observaciones abiertas
        aValue = a.numeroObservacionesAbiertas || 0;
        bValue = b.numeroObservacionesAbiertas || 0;
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      case 'correo':
        aValue = (a.correoContacto || a.correo_contacto || '').toLowerCase();
        bValue = (b.correoContacto || b.correo_contacto || '').toLowerCase();
        break;
      case 'telefono':
        aValue = (a.telefono || '').toLowerCase();
        bValue = (b.telefono || '').toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

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
      titulo="Gestión de Clientes" 
      handleVolver={handleVolver}
    >
      <ClienteDetalleModal 
        show={showModalDetalle}
        onHide={() => setShowModalDetalle(false)}
        idCliente={clienteSeleccionado}
      />

      <div className="container py-4">
        <div className="card shadow-sm border-0 rounded-3 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Clientes Registrados</h5>
            <button 
              className="btn btn-primary"
              onClick={handleCrearCliente}
            >
              <FaPlus className="me-2" />
              Nuevo Cliente
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><FaSearch /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre, RUT o correo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light text-muted" style={{ fontSize: '14px' }}>
                <tr>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('nombre')}>
                    Nombre Empresa {getSortIcon('nombre')}
                  </th>
                  <th className="text-center" style={{ cursor: 'pointer' }} onClick={() => handleSort('obras')}>
                    N° Obras {getSortIcon('obras')}
                  </th>
                  <th className="text-center" style={{ cursor: 'pointer' }} onClick={() => handleSort('observaciones')}>
                    N° Obs. Abiertas {getSortIcon('observaciones')}
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('correo')}>
                    Correo {getSortIcon('correo')}
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('telefono')}>
                    Teléfono Contacto {getSortIcon('telefono')}
                  </th>
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
                      <div className="mt-2">Cargando clientes...</div>
                    </td>
                  </tr>
                ) : sortedClientes.length > 0 ? (
                  sortedClientes.map((cliente) => (
                    <tr
                      key={cliente.idCliente || cliente.id_cliente}
                      style={{ fontSize: '14px', cursor: 'pointer' }}
                      onClick={() => handleVerDetalle(cliente.idCliente || cliente.id_cliente)}
                    >
                      <td className="fw-semibold">{cliente.nombreEmpresa || cliente.nombre_empresa}</td>
                      <td className="text-center">
                        <span className="badge bg-info">
                          {cliente.numeroObras || 0}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${ (cliente.numeroObservacionesAbiertas || 0) > 0 ? 'bg-danger' : 'bg-secondary' }`}>
                          {cliente.numeroObservacionesAbiertas}
                        </span>
                      </td>
                      <td>{cliente.correoContacto || cliente.correo_contacto || '-'}</td>
                      {/* El backend devuelve 'telefono', no 'telefonoContacto' */}
                      <td>{cliente.telefono || '-'}</td>
                      <td>
                        <button
                          className="btn btn-light btn-sm text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerDetalle(cliente.idCliente || cliente.id_cliente);
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
                      No se encontraron clientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!loading && sortedClientes.length > 0 && (
            <div className="mt-3 text-muted" style={{ fontSize: '14px' }}>
              Mostrando {sortedClientes.length} de {clientes.length} clientes
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ListaClientes;

// Made with Bob
