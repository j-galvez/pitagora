import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBuilding, FaSave } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';

const EditarCliente = () => {
  const { id_cliente } = useParams();
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  const [formData, setFormData] = useState({
    nombreEmpresa: '',
    rut: '',
    correoContacto: '',
    telefono: '',
    direccionCalle: '',
    idRegion: '',
    idComuna: '',
    estado: 'Activo'
  });

  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [comunasFiltradas, setComunasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [telefonoError, setTelefonoError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Validar RUT chileno
  const validarRUT = (rutCompleto) => {
    const rutLimpio = rutCompleto.replace(/[^0-9kK]/g, '').toUpperCase();
    if (rutLimpio.length < 7) return false;
    const numeros = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);
    if (!/^\d+$/.test(numeros)) return false;
    let suma = 0;
    let multiplicador = 2;
    for (let i = numeros.length - 1; i >= 0; i--) {
      suma += parseInt(numeros[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    return dv === dvCalculado;
  };

  const formatearRUT = (rut) => {
    const rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    if (rutLimpio.length === 0) return '';
    const numeros = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);
    let rutFormateado = numeros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return dv ? rutFormateado + '-' + dv : rutFormateado;
  };

  const validarCorreo = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  const validarTelefono = (tel) => /^\d{9}$/.test(tel);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [clienteRes, regionesRes, comunasRes] = await Promise.all([
          fetch(`http://localhost:8080/api/clientes/${id_cliente}`),
          fetch('http://localhost:8080/api/regiones'),
          fetch('http://localhost:8080/api/comunas')
        ]);

        if (!clienteRes.ok) throw new Error('No se encontró el cliente');

        const cliente = await clienteRes.json();
        const regionesData = await regionesRes.json();
        const comunasData = await comunasRes.json();

        setRegiones(regionesData);
        setComunas(comunasData);

        // Filtrar comunas según la región del cliente
        if (cliente.idRegion) {
          const filtradas = comunasData.filter(c => c.idRegion === cliente.idRegion);
          setComunasFiltradas(filtradas);
        }

        setFormData({
          nombreEmpresa: cliente.nombreEmpresa || '',
          rut: formatearRUT(cliente.rut || ''),
          correoContacto: cliente.correoContacto || '',
          telefono: cliente.telefono || '',
          direccionCalle: cliente.direccionCalle || '',
          idRegion: cliente.idRegion ? String(cliente.idRegion) : '',
          idComuna: cliente.idComuna ? String(cliente.idComuna) : '',
          estado: cliente.estado || 'Activo'
        });
      } catch (err) {
        setError(err.message || 'Error al cargar los datos del cliente');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id_cliente]);

  const filtrarComunasPorRegion = (idRegion) => {
    if (!idRegion) {
      setComunasFiltradas([]);
      return;
    }
    const filtered = comunas.filter(c => {
      const comunaRegionId = c.idRegion || c.id_region;
      return comunaRegionId === parseInt(idRegion, 10);
    });
    setComunasFiltradas(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === 'nombreEmpresa') {
      setFormData({ ...formData, [name]: value });
      newErrors.nombreEmpresa = value.trim() === '' ? 'El nombre de empresa es requerido' : '';
    } else if (name === 'rut') {
      const rutFormateado = formatearRUT(value);
      setFormData({ ...formData, [name]: rutFormateado });
      newErrors.rut = rutFormateado.trim() === '' ? 'El RUT es requerido' : '';
    } else if (name === 'direccionCalle') {
      setFormData({ ...formData, [name]: value });
      newErrors.direccionCalle = value.trim() === '' ? 'La dirección es requerida' : '';
    } else if (name === 'idRegion') {
      setFormData({ ...formData, idRegion: value, idComuna: '' });
      newErrors.idRegion = value === '' ? 'Debes seleccionar una región' : '';
      newErrors.idComuna = '';
      filtrarComunasPorRegion(value);
    } else if (name === 'idComuna') {
      setFormData({ ...formData, idComuna: value });
      newErrors.idComuna = value === '' ? 'Debes seleccionar una comuna' : '';
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors(newErrors);
  };

  const handleTelefonoBlur = () => {
    if (formData.telefono.length > 0 && !validarTelefono(formData.telefono)) {
      setTelefonoError('El teléfono debe tener exactamente 9 dígitos.');
    } else {
      setTelefonoError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    // Validación
    const newErrors = {};
    if (!formData.nombreEmpresa.trim()) newErrors.nombreEmpresa = 'El nombre de empresa es requerido';
    if (!formData.rut) {
      newErrors.rut = 'El RUT es requerido';
    } else if (!validarRUT(formData.rut.replace(/[^0-9kK]/g, '').toUpperCase())) {
      newErrors.rut = 'RUT inválido';
    }
    if (formData.correoContacto && !validarCorreo(formData.correoContacto)) {
      newErrors.correoContacto = 'Correo inválido';
    }
    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!validarTelefono(formData.telefono)) {
      setTelefonoError('El teléfono debe tener exactamente 9 dígitos.');
      setSaving(false);
      return;
    }
    if (!formData.direccionCalle.trim()) newErrors.direccionCalle = 'La dirección es requerida';
    if (!formData.idRegion) newErrors.idRegion = 'Debes seleccionar una región';
    if (!formData.idComuna) newErrors.idComuna = 'Debes seleccionar una comuna';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSaving(false);
      return;
    }

    try {
      const payload = {
        nombreEmpresa: formData.nombreEmpresa,
        rut: formData.rut.replace(/[^0-9kK]/g, '').toUpperCase(),
        correoContacto: formData.correoContacto,
        telefono: formData.telefono,
        direccionCalle: formData.direccionCalle,
        idRegion: parseInt(formData.idRegion, 10),
        idComuna: parseInt(formData.idComuna, 10),
        estado: formData.estado
      };

      const response = await fetch(`http://localhost:8080/api/clientes/${id_cliente}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccessMessage('Cliente actualizado correctamente.');
        setTimeout(() => navigate('/admin/clientes'), 1200);
      } else {
        const errorText = await response.text();
        setError(errorText || 'Error al actualizar el cliente');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setSaving(false);
    }
  };

  const handleVolver = () => navigate('/admin/clientes');

  if (loading) {
    return (
      <AdminLayout usuario={usuarioLogueado} titulo="Editar Cliente" handleVolver={handleVolver}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <div className="mt-3">Cargando datos del cliente...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout usuario={usuarioLogueado} titulo="Editar Cliente" handleVolver={handleVolver}>
      <div className="container py-4">
        <div className="card shadow-sm border-0 rounded-3 p-4 mx-auto" style={{ maxWidth: '750px' }}>

          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <div className="mb-4 border-bottom pb-3">
            <h5 className="text-dark mb-1">Editar Información del Cliente</h5>
            <span className="text-muted" style={{ fontSize: '13px' }}>Modifica los datos de la empresa cliente</span>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Nombre de Empresa */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Nombre de Empresa *</label>
              <input
                type="text"
                className={`form-control ${errors.nombreEmpresa ? 'is-invalid' : ''}`}
                name="nombreEmpresa"
                value={formData.nombreEmpresa}
                onChange={handleInputChange}
                placeholder="Ej: Constructora Ejemplo S.A."
                required
              />
              {errors.nombreEmpresa && <div className="invalid-feedback">{errors.nombreEmpresa}</div>}
            </div>

            {/* RUT */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>RUT *</label>
              <input
                type="text"
                className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                name="rut"
                value={formData.rut}
                onChange={handleInputChange}
                placeholder="Ej: 12.345.678-9"
                required
              />
              {errors.rut && <div className="invalid-feedback">{errors.rut}</div>}
              {!errors.rut && <small className="form-text text-muted">Formato: XX.XXX.XXX-X</small>}
            </div>

            {/* Correo */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Correo de Contacto</label>
              <input
                type="email"
                className={`form-control ${errors.correoContacto ? 'is-invalid' : ''}`}
                name="correoContacto"
                value={formData.correoContacto}
                onChange={handleInputChange}
                placeholder="contacto@empresa.com"
              />
              {errors.correoContacto && <div className="invalid-feedback">{errors.correoContacto}</div>}
            </div>

            {/* Teléfono */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Teléfono *</label>
              <input
                type="tel"
                className={`form-control ${telefonoError ? 'is-invalid' : ''}`}
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                onBlur={handleTelefonoBlur}
                placeholder="912345678"
                required
              />
              {telefonoError && <div className="invalid-feedback">{telefonoError}</div>}
              {!telefonoError && <small className="form-text text-muted">Debe tener exactamente 9 dígitos</small>}
            </div>

            {/* Dirección */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Dirección *</label>
              <input
                type="text"
                className={`form-control ${errors.direccionCalle ? 'is-invalid' : ''}`}
                name="direccionCalle"
                value={formData.direccionCalle}
                onChange={handleInputChange}
                placeholder="Calle Principal 123, Edificio A"
                required
              />
              {errors.direccionCalle && <div className="invalid-feedback">{errors.direccionCalle}</div>}
            </div>

            {/* Región */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Región *</label>
              <select
                className={`form-select ${errors.idRegion ? 'is-invalid' : ''}`}
                name="idRegion"
                value={formData.idRegion}
                onChange={handleInputChange}
              >
                <option value="">Selecciona una región</option>
                {regiones.map((region) => {
                  const regionId = region.idRegion || region.id_region;
                  const regionNombre = region.nombreRegion || region.nombre_region;
                  return (
                    <option key={regionId} value={regionId}>{regionNombre}</option>
                  );
                })}
              </select>
              {errors.idRegion && <div className="invalid-feedback">{errors.idRegion}</div>}
            </div>

            {/* Comuna */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Comuna *</label>
              <select
                className={`form-select ${errors.idComuna ? 'is-invalid' : ''}`}
                name="idComuna"
                value={formData.idComuna}
                onChange={handleInputChange}
                disabled={!formData.idRegion}
              >
                <option value="">{formData.idRegion ? 'Selecciona una comuna' : 'Selecciona región primero'}</option>
                {comunasFiltradas.map((comuna) => {
                  const comunaId = comuna.idComuna || comuna.id_comuna;
                  const comunaNombre = comuna.nombreComuna || comuna.nombre_comuna;
                  return (
                    <option key={comunaId} value={comunaId}>{comunaNombre}</option>
                  );
                })}
              </select>
              {errors.idComuna && <div className="invalid-feedback">{errors.idComuna}</div>}
            </div>

            {/* Estado */}
            <div className="mb-4">
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
              {formData.estado === 'Inactivo' && (
                <div className="alert alert-warning mt-2 py-2" style={{ fontSize: '13px' }}>
                  <strong>Atención:</strong> Un cliente inactivo no podrá tener nuevas obras, usuarios, tickets u observaciones creados.
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="d-flex justify-content-end gap-2 border-top pt-3">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={handleVolver}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn px-4 text-white"
                style={{ backgroundColor: '#0B3B60' }}
                disabled={saving || !!telefonoError}
              >
                {saving ? 'Guardando...' : <><FaSave className="me-2" /> Guardar Cambios</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditarCliente;
