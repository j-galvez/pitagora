import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserPlus, FaSyncAlt, FaArrowLeft } from 'react-icons/fa';
import NavbarAdmin from './NavbarAdmin';

const CrearUsuario = () => {
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    contrasena: 'oEPwxvJFVfP&',
    rol: 'Usuario',
    estado: 'Activo'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generarContrasena = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&%';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, contrasena: result });
  };

  const handleVolver = () => {
    navigate('/admin/usuarios');
  };

  const handleCrearUsuario = (usuarioData) => {
    // Aquí puedes implementar la lógica para crear el usuario
    console.log('Crear usuario:', usuarioData);
    // Después de crear, volver a la lista
    navigate('/admin/usuarios');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCrearUsuario(formData);
    // Limpiar formulario
    setFormData({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      contrasena: 'oEPwxvJFVfP&',
      rol: 'Usuario',
      estado: 'Activo'
    });
  };

  return (
    <div className="d-flex">
      <NavbarAdmin usuario={usuarioLogueado} />
      <div className="flex-grow-1" style={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
        {/* Barra de Navegación Superior */}
        <nav className="navbar navbar-dark" style={{ backgroundColor: '#0B3B60' }}>
          <div className="container-fluid d-flex justify-content-between align-items-center py-2">
            <div className="d-flex align-items-center">
              <button className="btn btn-link text-white me-3 text-decoration-none" onClick={handleVolver}>
                <FaArrowLeft className="me-1" /> Volver
              </button>
              <h4 className="text-white mb-0">Crear Nuevo Usuario</h4>
            </div>
            <img
              src="https://www.google.com/s2/favicons?domain=pitagora.cl&sz=64"
              alt="Logo Pitágora"
              className="bg-white p-1 rounded"
              style={{ height: '38px' }}
            />
          </div>
        </nav>

        {/* Contenido del Formulario */}
        <div className="container py-4">
          <div className="card shadow-sm border-0 rounded-3 p-4 mx-auto" style={{ maxWidth: '750px' }}>

            <div className="mb-4 border-bottom pb-3">
              <h5 className="text-dark mb-1">Información del Usuario</h5>
              <span className="text-muted" style={{ fontSize: '13px' }}>Completa los datos del nuevo usuario</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Juan"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Apellido</label>
                  <input
                    type="text"
                    className="form-control"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    placeholder="Pérez"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Correo Electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="+56 9 1234 5678"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Contraseña (Generada automáticamente)</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={formData.contrasena}
                    readOnly
                  />
                  <button className="btn btn-outline-secondary" type="button" onClick={generarContrasena}>
                    <FaSyncAlt />
                  </button>
                </div>
                <small className="text-muted fst-italic d-block mt-1" style={{ fontSize: '12px' }}>
                  Esta contraseña será enviada al usuario por correo electrónico
                </small>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Rol</label>
                  <select
                    className="form-select"
                    name="rol"
                    value={formData.rol}
                    onChange={handleInputChange}
                  >
                    <option value="Usuario">Usuario</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Estado</label>
                  <select
                    className="form-select"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 border-top pt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={handleVolver}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn px-4 text-white" style={{ backgroundColor: '#0B3B60' }}>
                  <FaUserPlus className="me-2" /> Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearUsuario;