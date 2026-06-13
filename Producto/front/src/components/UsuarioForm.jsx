import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UsuarioForm = ({
  usuario,
  formData,
  setFormData,
  loading,
  error,
  onSubmit,
  onCancel,
  tieneTickets = false,
}) => {
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [comunasFiltradas, setComunasFiltradas] = useState([]);
  const [obras, setObras] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (formData.idRegion) {
      const filtradas = comunas.filter((c) => c.idRegion === Number(formData.idRegion));
      setComunasFiltradas(filtradas);
    }
  }, [formData.idRegion, comunas]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación especial para teléfono
    if (name === 'telefono') {
      const soloNumeros = value.replace(/\D/g, '');
      if (soloNumeros.length <= 9) {
        setFormData(prev => ({ ...prev, [name]: soloNumeros }));
        
        if (soloNumeros.length > 0 && soloNumeros.length < 9) {
          setValidationErrors(prev => ({ ...prev, telefono: 'El teléfono debe tener exactamente 9 dígitos.' }));
        } else {
          setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.telefono;
            return newErrors;
          });
        }
      }
      return;
    }

    // Validación de correo
    if (name === 'correo' && value && !/^\S+@\S+\.\S+$/.test(value)) {
      setValidationErrors(prev => ({ ...prev, correo: 'Ingresa un correo válido.' }));
    } else if (name === 'correo') {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.correo;
        return newErrors;
      });
    }

    // Manejo especial para región (resetear comuna cuando cambia región)
    if (name === 'idRegion') {
      const filtradas = comunas.filter((c) => c.idRegion === Number(value));
      setComunasFiltradas(filtradas);
      setFormData(prev => ({ ...prev, [name]: value, idComuna: '' }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderField = ({ label, name, type = 'text', placeholder = '', options = null, readOnly = false, disabled = false, helpText = '' }) => {
    const value = formData[name] != null ? String(formData[name]) : '';

    return (
      <div className="col-md-6">
        <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>
          {label}
        </label>
        {options ? (
          <select
            className={`form-select ${validationErrors[name] ? 'is-invalid' : ''}`}
            name={name}
            value={value}
            onChange={handleChange}
            disabled={disabled || readOnly}
          >
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
            className={`form-control ${validationErrors[name] ? 'is-invalid' : ''}`}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={disabled}
          />
        )}
        {validationErrors[name] && (
          <div className="invalid-feedback d-block">{validationErrors[name]}</div>
        )}
        {helpText && (
          <div className="form-text text-muted small">{helpText}</div>
        )}
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

  const hasValidationErrors = Object.keys(validationErrors).length > 0;

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
              <input type="text" className="form-control" value={usuario.run || ''} readOnly disabled />
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
            {renderField({ label: 'Teléfono', name: 'telefono', type: 'tel', placeholder: '912345678' })}
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
              disabled: tieneTickets,
              helpText: tieneTickets ? 'No se puede cambiar la obra porque el usuario tiene tickets creados' : '',
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
                disabled
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 border-top pt-3">
            <button type="button" className="btn btn-outline-secondary px-4" onClick={onCancel} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary px-4" disabled={loading || hasValidationErrors}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioForm;