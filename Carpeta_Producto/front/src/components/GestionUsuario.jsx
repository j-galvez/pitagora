import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import NavbarAdmin from './NavbarAdmin';

const GestionUsuarios = () => {
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  // Estado para la lista de usuarios (datos de ejemplo)
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Juan Pérez', correo: 'juan.perez@ejemplo.com', telefono: '+56 9 1234 5678', rol: 'Usuario', estado: 'Activo', fechaCreacion: '01/04/2026' },
    { id: 2, nombre: 'María González', correo: 'maria.gonzalez@pitagora.cl', telefono: '+56 9 8765 4321', rol: 'Admin', estado: 'Activo', fechaCreacion: '15/03/2026' },
    { id: 3, nombre: 'Carlos Rodríguez', correo: 'carlos.rodriguez@ejemplo.com', telefono: '+56 9 5555 6666', rol: 'Usuario', estado: 'Inactivo', fechaCreacion: '20/02/2026' },
    { id: 4, nombre: 'Ana Martínez', correo: 'ana.martinez@ejemplo.com', telefono: '+56 9 7777 8888', rol: 'Usuario', estado: 'Activo', fechaCreacion: '10/01/2026' }
  ]);

  // Estados para búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Todos');

  // Función para eliminar un usuario con confirmación
  const eliminarUsuario = (id) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      const nuevosUsuarios = usuarios.filter((u) => u.id !== id);
      setUsuarios(nuevosUsuarios);
    }
  };

  const handleCreateClick = () => {
    navigate('/admin/crear-usuarios');
  };

  const handleEditClick = (usuario) => {
    // Aquí puedes implementar la lógica para editar
    console.log('Editar usuario:', usuario);
  };

  // Filtrado de usuarios en base a la búsqueda y pestañas
  const filteredUsuarios = usuarios.filter((u) => {
    const matchesSearch = u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.telefono.includes(searchTerm);

    if (activeTab === 'Todos') return matchesSearch;
    if (activeTab === 'Admins') return matchesSearch && u.rol === 'Admin';
    if (activeTab === 'Usuarios') return matchesSearch && u.rol === 'Usuario';
    if (activeTab === 'Activos') return matchesSearch && u.estado === 'Activo';
    if (activeTab === 'Inactivos') return matchesSearch && u.estado === 'Inactivo';

    return matchesSearch;
  });

  return (
    <div className="d-flex">
      <NavbarAdmin usuario={usuarioLogueado} />
      <div className="flex-grow-1" style={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
        {/* Barra de Navegación Superior */}
        <nav className="navbar navbar-dark" style={{ backgroundColor: '#0B3B60' }}>
          <div className="container-fluid d-flex justify-content-between align-items-center py-2">
            <h4 className="text-white mb-0 ms-3">Gestión de Usuarios</h4>
            <div className="d-flex align-items-center">
              <button className="btn btn-outline-light me-3 d-flex align-items-center" onClick={handleCreateClick}>
                <FaUserPlus className="me-2" /> Nuevo Usuario
              </button>
              <img
                src="https://www.google.com/s2/favicons?domain=pitagora.cl&sz=64"
                alt="Logo Pitágora"
                className="bg-white p-1 rounded me-2"
                style={{ height: '38px' }}
              />
            </div>
          </div>
        </nav>

        {/* Contenido Principal */}
        <div className="container py-4">
          <div className="card shadow-sm border-0 rounded-3 p-4">
            <h5 className="mb-3">Usuarios del Sistema</h5>

            {/* Barra de búsqueda y filtros */}
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

            {/* Tabla de Usuarios */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light text-muted" style={{ fontSize: '14px' }}>
                  <tr>
                    <th>Nombre y Apellido</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Fecha Creación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.length > 0 ? (
                    filteredUsuarios.map((u) => (
                      <tr key={u.id} style={{ fontSize: '14px' }}>
                        <td className="fw-semibold">{u.nombre}</td>
                        <td>{u.correo}</td>
                        <td>{u.telefono}</td>
                        <td>
                          <span className={`badge ${u.rol === 'Admin' ? 'bg-primary' : 'bg-secondary'}`}>
                            {u.rol}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${u.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                            {u.estado}
                          </span>
                        </td>
                        <td>{u.fechaCreacion}</td>
                        <td>
                          <button
                            className="btn btn-light btn-sm text-primary me-2"
                            onClick={() => handleEditClick(u)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-light btn-sm text-danger"
                            onClick={() => eliminarUsuario(u.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
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
      </div>
    </div>
  );
};

export default GestionUsuarios;