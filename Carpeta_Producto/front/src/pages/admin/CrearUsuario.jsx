import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserPlus, FaSyncAlt, FaArrowLeft } from 'react-icons/fa';
import NavbarAdmin from '../../components/NavbarAdmin';
import AdminLayout from '../../components/AdminLayout';

const CrearUsuario = () => {
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    password: 'oEPwxvJFVfP&',
    rol: 'usuario',
    estado: 'Activo'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [telefonoError, setTelefonoError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telefono') {
      // Permitir solo números
      const soloNumeros = value.replace(/\D/g, '');

      // Validar que comience con '9'
      if (soloNumeros.length > 0 && !soloNumeros.startsWith('9')) {
        setTelefonoError('El teléfono debe comenzar con 9.');
      } else if (soloNumeros.length > 9) {
        // Limitar a 9 caracteres (9 + 8 dígitos)
        return; 
      } else {
        setTelefonoError('');
      }

      setFormData({ ...formData, [name]: soloNumeros });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validación al salir del campo de texto
  const handleTelefonoBlur = () => {
    if (formData.telefono.length > 0 && formData.telefono.length !== 9) {
      setTelefonoError('El teléfono debe tener exactamente 8 números después del 9 (9 dígitos en total).');
    } else {
      setTelefonoError('');
    }
  };

  const generarContrasena = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&%';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: result });
  };

  const handleVolver = () => {
    navigate('/admin-dashboard');
  };

  const handleCancel = () => {
    navigate('/admin/usuarios');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación final antes de enviar
    if (formData.telefono.length !== 9 || !formData.telefono.startsWith('9')) {
      setTelefonoError('El teléfono debe iniciar con 9 y contener exactamente 9 dígitos.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Usuario creado exitosamente');
        navigate('/admin/usuarios');
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || 'Error al crear el usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout 
      usuario={usuarioLogueado} 
      titulo="Creación de Usuario" 
      handleVolver={handleVolver}
    >
      <div className="container py-4" style={{ overflowX: 'auto', overflowY: 'auto', maxWidth: '100%' }}>
        <div className="card shadow-sm border-0 rounded-3 p-4 mx-auto overflow-auto" style={{ maxWidth: '750px', minWidth: 0, maxHeight: 'calc(100vh - 180px)' }}>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="mb-4 border-bottom pb-3">
            <h5 className="text-dark mb-1">Información del Usuario</h5>
            <span className="text-muted" style={{ fontSize: '13px' }}>Completa los datos del nuevo usuario</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Nombre Completo</label>
              <input
                type="text"
                className="form-control"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Juan Pérez González"
                required
              />
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
                className={`form-control ${telefonoError ? 'is-invalid' : ''}`}
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                onBlur={handleTelefonoBlur}
                placeholder="9 12345678"
                required
              />
              {/* Mensaje de error dinámico */}
              {telefonoError && (
                <div className="invalid-feedback">
                  {telefonoError}
                </div>
              )}
              {!telefonoError && (
                <small className="form-text text-muted">
                  Debe iniciar con 9 y tener 9 dígitos en total (Ej. 912345678).
                </small>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Contraseña (Generada automáticamente)</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-light"
                  value={formData.password}
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
                  <option value="usuario">Usuario</option>
                  <option value="admin">Admin</option>
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
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              <button type="submit" className="btn px-4 text-white" style={{ backgroundColor: '#0B3B60' }} disabled={loading}>
                {loading ? 'Creando...' : <><FaUserPlus className="me-2" /> Crear Usuario</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CrearUsuario;