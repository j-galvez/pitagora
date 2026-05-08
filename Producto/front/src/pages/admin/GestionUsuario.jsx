import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaArrowLeft } from 'react-icons/fa';
import NavbarAdmin from '../../components/NavbarAdmin';
import AdminLayout from '../../components/AdminLayout';

const GestionUsuario = () => {
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Todos');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/usuarios');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        setError('Error al cargar los usuarios');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id_usuario) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${id_usuario}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await cargarUsuarios();
        alert('Usuario eliminado exitosamente');
      } else {
        const errorMessage = await response.text();
        alert(errorMessage || 'Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    }
  };

  const handleVolver = () => {
    console.log('Volver a la lista de usuarios');
    navigate('/admin-dashboard');
  };

  const handleCancel = () => {
    navigate('/admin/usuarios');
  };

  const handleCreateClick = () => {
    navigate('/admin/crear-usuarios');
  };

  const handleEditClick = (usuario) => {
    const userId = usuario.id_usuario || usuario.idUsuario;
    navigate(`/admin/usuarios/${userId}`);
  };

  const filteredUsuarios = usuarios.filter((u) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      `${u.nombre || ''} ${u.apellidoPaterno || ''} ${u.apellidoMaterno || ''}`.toLowerCase().includes(lowerSearch) ||
      u.correo?.toLowerCase().includes(lowerSearch) ||
      u.telefono?.includes(lowerSearch);

    if (activeTab === 'Todos') return matchesSearch;
    if (activeTab === 'Admins') return matchesSearch && u.rol === 'admin';
    if (activeTab === 'Usuarios') return matchesSearch && u.rol === 'usuario';
    if (activeTab === 'Activos') return matchesSearch && u.estado === 'Activo';
    if (activeTab === 'Inactivos') return matchesSearch && u.estado === 'Inactivo';
    return matchesSearch;
  });

  return (
    <AdminLayout 
      usuario={usuarioLogueado} 
      titulo="Gestión de Usuarios" 
      handleVolver={handleVolver}
    >

        <div className="container py-4">
          <div className="card shadow-sm border-0 rounded-3 p-4">
            <h5 className="mb-3">Usuarios del Sistema</h5>

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
                    placeholder="Buscar por nombre, correo o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 d-flex justify-content-md-end gap-1 flex-wrap">
                {['Todos', 'Admins', 'Usuarios', 'Activos', 'Inactivos'].map((tab) => (
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
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Fecha Creación</th>
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
                        <div className="mt-2">Cargando usuarios...</div>
                      </td>
                    </tr>
                  ) : filteredUsuarios.length > 0 ? (
                    filteredUsuarios.map((u) => {
                      const userId = u.id_usuario || u.idUsuario;
                      const fullName = `${u.nombre || ''} ${u.apellidoPaterno || ''} ${u.apellidoMaterno || ''}`.trim();
                      const roleLabel = u.rol === 'admin' ? 'Admin' : u.rol === 'cliente' ? 'Cliente' : u.rol;

                      return (
                        <tr key={userId} style={{ fontSize: '14px' }}>
                          <td className="fw-semibold">{fullName || '-'} </td>
                          <td>{u.correo || '-'}</td>
                          <td>{u.telefono || '-'}</td>
                          <td>
                            <span className={`badge ${u.rol === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                              {roleLabel}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${u.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                              {u.estado || '-'}
                            </span>
                          </td>
                          <td>{u.fecha_creacion ? new Date(u.fecha_creacion).toLocaleDateString('es-ES') : '-'}</td>
                          <td>
                            <button
                              className="btn btn-light btn-sm text-primary me-2"
                              onClick={() => handleEditClick(u)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-light btn-sm text-danger"
                              onClick={() => eliminarUsuario(userId)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-3">
                        No se encontraron usuarios.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </AdminLayout>
  );
};

export default GestionUsuario;
