import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBuilding, FaArrowLeft } from 'react-icons/fa';
import NavbarAdmin from '../../components/NavbarAdmin';
import AdminLayout from '../../components/AdminLayout';

const CrearCliente = () => {
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
    direccion: '',
    idRegion: '',
    idComuna: '',
    estado: 'Activo'
  });

  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [comunasFiltradas, setComunasFiltradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [telefonoError, setTelefonoError] = useState('');

  // Validar RUT chileno (formato limpio: XXXXXXXXX-X o XX.XXX.XXX-X)
  const validarRUT = (rutCompleto) => {
    // 1. Limpiamos cualquier punto o guion
    const rutLimpio = rutCompleto.replace(/[^0-9kK]/g, '').toUpperCase();
    if (rutLimpio.length < 7) return false;

    const numeros = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);

    if (!/^\d+$/.test(numeros)) return false;

    // 2. Algoritmo de suma ponderada
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

  // Formatear RUT mientras se escribe
  const formatearRUT = (rut) => {
    const rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    if (rutLimpio.length === 0) return '';

    const numeros = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);

    // Formateamos los miles automáticamente con puntos
    let rutFormateado = numeros.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return dv ? rutFormateado + '-' + dv : rutFormateado;
  };

  // Validar correo
  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  // Validar teléfono (9 dígitos)
  const validarTelefono = (telefono) => {
    const soloNumeros = telefono.replace(/\D/g, '');
    return soloNumeros.length === 9;
  };

  const cargarRegiones = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/regiones');
      if (!response.ok) throw new Error('Error al cargar regiones');
      const data = await response.json();
      setRegiones(data);
    } catch (err) {
      console.error('Error al cargar regiones:', err);
    }
  };

  const cargarComunas = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/comunas');
      if (!response.ok) throw new Error('Error al cargar comunas');
      const data = await response.json();
      setComunas(data);
    } catch (err) {
      console.error('Error al cargar comunas:', err);
    }
  };

  useEffect(() => {
    cargarRegiones();
    cargarComunas();
  }, []);

  const filtrarComunasPorRegion = (regionId) => {
    if (!regionId) {
      setComunasFiltradas([]);
      return;
    }
    const filtered = comunas.filter((comuna) => {
      const comunaRegionId = comuna.idRegion || comuna.id_region;
      return comunaRegionId === parseInt(regionId, 10);
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
    } else if (name === 'direccion') {
      setFormData({ ...formData, [name]: value });
      newErrors.direccion = value.trim() === '' ? 'La dirección es requerida' : '';
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
    if (formData.telefono.length > 0 && formData.telefono.length !== 9) {
      setTelefonoError('El teléfono debe tener exactamente 9 dígitos.');
    } else {
      setTelefonoError('');
    }
  };

  const handleVolver = () => {
    console.log('Volver al dashboard de administración');
    navigate('/admin-dashboard');
  };

  const handleCancel = () => {
    navigate('/admin-dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación final completa
    const newErrors = {};
    
    if (!formData.nombreEmpresa.trim()) {
      newErrors.nombreEmpresa = 'El nombre de empresa es requerido';
    }
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
      setLoading(false);
      return;
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }
    if (!formData.idRegion) {
      newErrors.idRegion = 'Debes seleccionar una región';
    }
    if (!formData.idComuna) {
      newErrors.idComuna = 'Debes seleccionar una comuna';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const datosCliente = {
        nombreEmpresa: formData.nombreEmpresa,
        rut: formData.rut.replace(/[^0-9kK]/g, '').toUpperCase(), // Enviar RUT sin formato
        correoContacto: formData.correoContacto,
        telefono: formData.telefono,
        direccion: formData.direccion,
        idRegion: parseInt(formData.idRegion, 10),
        idComuna: parseInt(formData.idComuna, 10),
        estado: formData.estado
      };

      const response = await fetch('http://localhost:8080/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosCliente),
      });

      if (response.ok) {
        const clienteCreado = await response.json();
        alert(`Cliente creado exitosamente con ID: ${clienteCreado.idCliente}`);
        navigate('/admin-dashboard');
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || 'Error al crear el cliente');
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
      titulo="Creación de Cliente" 
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
            <h5 className="text-dark mb-1">Información del Cliente</h5>
            <span className="text-muted" style={{ fontSize: '13px' }}>Completa los datos de la nueva empresa cliente</span>
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
              {errors.nombreEmpresa && (
                <div className="invalid-feedback">
                  {errors.nombreEmpresa}
                </div>
              )}
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
              {errors.rut && (
                <div className="invalid-feedback">
                  {errors.rut}
                </div>
              )}
              {!errors.rut && (
                <small className="form-text text-muted">
                  Formato: XX.XXX.XXX-X
                </small>
              )}
            </div>

            {/* Correo Contacto */}
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
              {errors.correoContacto && (
                <div className="invalid-feedback">
                  {errors.correoContacto}
                </div>
              )}
              {!errors.correoContacto && (
                <small className="form-text text-muted">
                  Debe tener formato válido con @
                </small>
              )}
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
              {telefonoError && (
                <div className="invalid-feedback">
                  {telefonoError}
                </div>
              )}
              {!telefonoError && (
                <small className="form-text text-muted">
                  Debe tener exactamente 9 dígitos (Ej: 912345678)
                </small>
              )}
            </div>

            {/* Dirección */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Dirección *</label>
              <input
                type="text"
                className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Calle Principal 123, Edificio A"
                required
              />
              {errors.direccion && (
                <div className="invalid-feedback">
                  {errors.direccion}
                </div>
              )}
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
                {regiones.length === 0 ? (
                  <option value="" disabled>No hay regiones cargadas</option>
                ) : (
                  regiones.map((region) => {
                    const regionId = region.idRegion || region.id_region;
                    const regionNombre = region.nombreRegion || region.nombre_region;
                    return (
                      <option key={regionId} value={regionId}>
                        {regionNombre}
                      </option>
                    );
                  })
                )}
              </select>
              {errors.idRegion && (
                <div className="invalid-feedback">
                  {errors.idRegion}
                </div>
              )}
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
                {comunasFiltradas.length === 0 ? (
                  formData.idRegion ? (
                    <option value="" disabled>No hay comunas para esa región</option>
                  ) : null
                ) : (
                  comunasFiltradas.map((comuna) => {
                    const comunaId = comuna.idComuna || comuna.id_comuna;
                    const comunaNombre = comuna.nombreComuna || comuna.nombre_comuna;
                    return (
                      <option key={comunaId} value={comunaId}>
                        {comunaNombre}
                      </option>
                    );
                  })
                )}
              </select>
              {errors.idComuna && (
                <div className="invalid-feedback">
                  {errors.idComuna}
                </div>
              )}
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
            </div>

            {/* Botones de acción */}
            <div className="d-flex justify-content-end gap-2 border-top pt-3">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              <button type="submit" className="btn px-4 text-white" style={{ backgroundColor: '#0B3B60' }} disabled={loading || !!telefonoError}>
                {loading ? 'Creando...' : <><FaBuilding className="me-2" /> Crear Cliente</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CrearCliente;