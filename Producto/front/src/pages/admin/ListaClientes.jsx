import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaEye, FaPlus } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
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
    navigate(`/admin/clientes/${idCliente}`);
  };

  const handleCrearCliente = () => {
    navigate('/admin/crear-cliente');
  };

  const filteredClientes = clientes.filter((cliente) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      cliente.nombreEmpresa?.toLowerCase().includes(lowerSearch) ||
      cliente.contacto?.toLowerCase().includes(lowerSearch) ||
      cliente.correoContacto?.toLowerCase().includes(lowerSearch)
    );
  });

  // Contar obras por cliente
  const contarObras = (idCliente) => {
    // Esto sería dinámico si tenemos acceso a las obras
    // Por ahora lo dejamos como placeholder
    return '-';
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
      titulo="Gestión de Clientes" 
      handleVolver={handleVolver}
    >
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
                  placeholder="Buscar por nombre, contacto o correo..."
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
                  <th>Nombre Empresa</th>
                  <th>Contacto</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      <div className="mt-2">Cargando clientes...</div>
                    </td>
                  </tr>
                ) : filteredClientes.length > 0 ? (
                  filteredClientes.map((cliente) => (
                    <tr 
                      key={cliente.idCliente} 
                      style={{ fontSize: '14px', cursor: 'pointer' }}
                      onClick={() => handleVerDetalle(cliente.idCliente)}
                    >
                      <td className="fw-semibold">{cliente.nombreEmpresa}</td>
                      <td>{cliente.contacto || '-'}</td>
                      <td>{cliente.correoContacto || '-'}</td>
                      <td>{cliente.telefonoContacto || '-'}</td>
                      <td>
                        <button
                          className="btn btn-light btn-sm text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerDetalle(cliente.idCliente);
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
                    <td colSpan="5" className="text-center text-muted py-3">
                      No se encontraron clientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredClientes.length > 0 && (
            <div className="mt-3 text-muted" style={{ fontSize: '14px' }}>
              Mostrando {filteredClientes.length} de {clientes.length} clientes
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ListaClientes;

// Made with Bob
