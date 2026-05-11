import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

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
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [comunasFiltradas, setComunasFiltradas] = useState([]);
  const [obras, setObras] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [regionesRes, comunasRes, obrasRes] = await Promise.all([
        fetch('http://localhost:8080/api/regiones'),
        fetch('http://localhost:8080/api/comunas'),
        fetch('http://localhost:8080/api/obras')
      ]);

      const regionesData = await regionesRes.json();
      const comunasData = await comunasRes.json();
      const obrasData = await obrasRes.json();

      setRegiones(regionesData);
      setComunas(comunasData);
      setObras(obrasData);

      if (formData.idRegion) {
        const filtradas = comunasData.filter((c) => c.idRegion === Number(formData.idRegion));
        setComunasFiltradas(filtradas);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  };

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
      const soloNumeros = value.replace(/\D/g, '');
      // Solo limita a 9 dígitos máximo, pero permite escribir y borrar libremente
      if (soloNumeros.length <= 9) {
        setTempValue(soloNumeros);
        if (soloNumeros.length > 0 && soloNumeros.length < 9) {
          setFieldError('El teléfono debe tener exactamente 9 dígitos.');
        } else if (soloNumeros.length === 0) {
          setFieldError('');
        } else {
          setFieldError('');
        }
      }
      return;
    }

    setTempValue(value);
    setFieldError('');
  };

  const saveField = async () => {
    if (!editingField) return;

    if (editingField === 'telefono') {
      if (!/^\d{9}$/.test(tempValue)) {
        setFieldError('El teléfono debe tener exactamente 9 dígitos.');
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

    const handleSelectChangeForField = (e) => {
      const { value } = e.target;
      setTempValue(value);
      
      if (name === 'idRegion') {
        const filtradas = comunas.filter((c) => c.idRegion === Number(value));
        setComunasFiltradas(filtradas);
      }
      
      setFieldError('');
    };

    return (
      <div className="col-md-6">
        <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>
          {label}
        </label>
        <div className="input-group">
          {isEditing ? (
            options ? (
              <select className="form-select" value={tempValue} onChange={handleSelectChangeForField}>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={name === 'telefono' ? 'text' : type}
                inputMode={name === 'telefono' ? 'numeric' : 'text'}
                className={`form-control ${fieldError ? 'is-invalid' : ''}`}
                value={tempValue}
                onChange={handleTempChange}
                placeholder={placeholder}
                autoFocus
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
              className={`btn btn-outline-${isEditing ? 'success' : 'primary'}`}
              onClick={isEditing ? saveField : () => startEditing(name)}
              disabled={loading}
              title={isEditing ? 'Guardar' : 'Editar'}
            >
              {isEditing ? <FaSave /> : <FaEdit />}
            </button>
          )}
          {isEditing && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={cancelEditing}
              disabled={loading}
              title="Cancelar"
            >
              <FaTimes />
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
            {renderField({
              label: 'Región',
              name: 'idRegion',
              options: [
                { value: '', label: 'Seleccionar región' },
                ...regiones.map(r => ({ value: r.idRegion, label: r.nombreRegion }))
              ]
            })}
          </div>

          <div className="row g-3 mb-3">
            {renderField({
              label: 'Comuna',
              name: 'idComuna',
              options: [
                { value: '', label: 'Seleccionar comuna' },
                ...comunasFiltradas.map(c => ({ value: c.idComuna, label: c.nombreComuna }))
              ]
            })}
            {renderField({
              label: 'Obra',
              name: 'idObra',
              options: [
                { value: '', label: 'Seleccionar obra' },
                ...obras.map(o => ({ value: o.idObra, label: o.nombreObra }))
              ]
            })}
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>
                Fecha de creación
              </label>
              <input
                type="text"
                className="form-control"
                value={usuario.fechaCreacion ? new Date(usuario.fechaCreacion).toLocaleString('es-ES') : ''}
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