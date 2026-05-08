import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UsuarioForm = ({
  usuario,
  formData,
  loading,
  error,
  onFieldSave,
  onSubmit,
  onCancel,
}) => {
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [fieldError, setFieldError] = useState('');

  const startEditing = (fieldName) => {
    setEditingField(fieldName);
    setTempValue(formData[fieldName] != null ? String(formData[fieldName]) : '');
    setFieldError('');
  };

  const cancelEditing = () => {
    setEditingField(null);
    setFieldError('');
  };

  const handleTempChange = (e) => {
    const { value } = e.target;

    if (editingField === 'telefono') {
      const digits = value.replace(/\D/g, '');
      if (digits.length > 9) {
        return;
      }
      setTempValue(digits);
      if (digits && !digits.startsWith('9')) {
        setFieldError('El teléfono debe comenzar con 9.');
      } else {
        setFieldError('');
      }
      return;
    }

    setTempValue(value);
    setFieldError('');
  };

  const saveField = async () => {
    if (!editingField) return;

    if (editingField === 'telefono') {
      if (!/^[9]\d{8}$/.test(tempValue)) {
        setFieldError('El teléfono debe tener 9 dígitos y comenzar con 9.');
        return;
      }
    }

    if (editingField === 'correo' && tempValue && !/^\S+@\S+\.\S+$/.test(tempValue)) {
      setFieldError('Ingresa un correo válido.');
      return;
    }

    const parsedValue = ['idRegion', 'idComuna', 'idObra'].includes(editingField)
      ? tempValue === ''
        ? null
        : Number(tempValue)
      : tempValue;

    await onFieldSave(editingField, parsedValue);
    setEditingField(null);
  };

  const renderField = ({ label, name, type = 'text', placeholder = '', options = null, readOnly = false }) => {
    const value = formData[name] != null ? String(formData[name]) : '';
    const isEditing = editingField === name;

    return (
      <div className="col-md-6">
        <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>
          {label}
        </label>
        <div className="input-group">
          {isEditing ? (
            options ? (
              <select className="form-select" value={tempValue} onChange={handleTempChange}>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                className={`form-control ${fieldError ? 'is-invalid' : ''}`}
                value={tempValue}
                onChange={handleTempChange}
                placeholder={placeholder}
              />
            )
          ) : (
            <input
              type={type}
              className="form-control"
              value={value}
              readOnly={readOnly}
              placeholder={placeholder}
            />
          )}
          {!readOnly && (
            <button
              type="button"
              className={`btn ${isEditing ? 'btn-success' : 'btn-outline-primary'}`}
              onClick={isEditing ? saveField : () => startEditing(name)}
              disabled={loading}
            >
              {isEditing ? 'Guardar' : 'Editar'}
            </button>
          )}
          {isEditing && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={cancelEditing}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
        </div>
        {isEditing && fieldError && <div className="invalid-feedback d-block">{fieldError}</div>}
      </div>
    );
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
            {renderField({ label: 'Nombre', name: 'nombre' })}
            {renderField({ label: 'Apellido paterno', name: 'apellidoPaterno' })}
          </div>

          <div className="row g-3 mb-3">
            {renderField({ label: 'Apellido materno', name: 'apellidoMaterno' })}
            {renderField({ label: 'Correo', name: 'correo', type: 'email', placeholder: 'usuario@dominio.com' })}
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>
                RUN
              </label>
              <input type="text" className="form-control" value={usuario.run || ''} readOnly />
            </div>
            {renderField({
              label: 'Rol',
              name: 'rol',
              options: [
                { value: 'admin', label: 'admin' },
                { value: 'usuario', label: 'usuario' },
                { value: 'cliente', label: 'cliente' },
                { value: 'jefe_obra', label: 'jefe_obra' },
                { value: 'tecnico', label: 'tecnico' },
              ],
            })}
          </div>

          <div className="row g-3 mb-3">
            {renderField({ label: 'Teléfono', name: 'telefono', type: 'tel', placeholder: '9 12345678' })}
            {renderField({
              label: 'Estado',
              name: 'estado',
              options: [
                { value: 'Activo', label: 'Activo' },
                { value: 'Inactivo', label: 'Inactivo' },
              ],
            })}
          </div>

          <div className="row g-3 mb-3">
            {renderField({ label: 'Dirección', name: 'direccionCalle' })}
            {renderField({ label: 'ID Región', name: 'idRegion', type: 'number', placeholder: 'Ej. 1' })}
          </div>

          <div className="row g-3 mb-3">
            {renderField({ label: 'ID Comuna', name: 'idComuna', type: 'number', placeholder: 'Ej. 2' })}
            {renderField({ label: 'ID Obra', name: 'idObra', type: 'number', placeholder: 'Ej. 3' })}
          </div>

          <div className="row g-3 mb-3">
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

          <div className="d-flex justify-content-end gap-2 border-top pt-3">
            <button type="button" className="btn btn-outline-secondary px-4" onClick={onCancel} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary px-4" disabled={loading || !!fieldError}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioForm;