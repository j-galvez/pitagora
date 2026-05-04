import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UsuarioForm = ({
  usuario,
  formData,
  loading,
  error,
  onInputChange,
  onSubmit,
  onCancel,
}) => {
  const [telefonoError, setTelefonoError] = useState('');

  // Interceptar el cambio de input para el campo teléfono
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telefono') {
      const soloNumeros = value.replace(/\D/g, '');

      if (soloNumeros.length > 0 && !soloNumeros.startsWith('9')) {
        setTelefonoError('El teléfono debe comenzar con 9.');
      } else if (soloNumeros.length > 9) {
        return; // Detiene la acción si excede los 9 caracteres en total
      } else {
        setTelefonoError('');
      }
      
      // Simular el evento para el componente padre
      onInputChange({ target: { name, value: soloNumeros } });
    } else {
      onInputChange(e);
    }
  };

  const handleBlur = () => {
    if (formData.telefono && formData.telefono.length > 0 && formData.telefono.length !== 9) {
      setTelefonoError('El teléfono debe tener exactamente 8 números después del 9 (9 dígitos en total).');
    } else {
      setTelefonoError('');
    }
  };

  if (!usuario) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning" role="alert">
          No hay datos de usuario disponibles.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ overflowX: 'auto', overflowY: 'auto', maxWidth: '100%' }}>
      <div className="card shadow-sm border-0 rounded-3 p-4 mx-auto overflow-auto" style={{ maxWidth: '750px', minWidth: 0, maxHeight: 'calc(100vh - 180px)' }}>
        <h5 className="mb-3">Perfil del Usuario</h5>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>
                Nombre
              </label>
              <input
                type="text"
                className="form-control"
                value={usuario.nombre || ''}
                readOnly
              />
            </div>
            <div className="col-md-6">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>
                Correo
              </label>
              <input
                type="email"
                className="form-control"
                value={usuario.correo || ''}
                readOnly
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>
                Rol
              </label>
              <input
                type="text"
                className="form-control"
                value={usuario.rol || ''}
                readOnly
              />
            </div>
            <div className="col-md-6">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>
                Fecha de creación
              </label>
              <input
                type="text"
                className="form-control"
                value={usuario.fecha_creacion ? new Date(usuario.fecha_creacion).toLocaleString('es-ES') : ''}
                readOnly
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>
              Teléfono
            </label>
            <input
              type="tel"
              className={`form-control ${telefonoError ? 'is-invalid' : ''}`}
              name="telefono"
              value={formData.telefono || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="9 12345678"
              required
            />
            {telefonoError ? (
              <div className="invalid-feedback">{telefonoError}</div>
            ) : (
              <small className="form-text text-muted">
                Debe iniciar con 9 y tener 9 dígitos en total (Ej. 912345678).
              </small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>
              Estado
            </label>
            <select
              className="form-select"
              name="estado"
              value={formData.estado || ''}
              onChange={onInputChange}
              required
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className="d-flex justify-content-end gap-2 border-top pt-3">
            <button type="button" className="btn btn-outline-secondary px-4" onClick={onCancel} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary px-4" disabled={loading || !!telefonoError}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioForm;