import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserPlus, FaSyncAlt } from 'react-icons/fa';
import NavbarAdmin from '../../components/NavbarAdmin';
import AdminLayout from '../../components/AdminLayout';

const CrearUsuario = () => {
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    telefono: '',
    password: 'oEPwxvJFVfP&',
    rol: 'usuario',
    idObra: '',
    calle: '',
    idRegion: '',
    idComuna: '',
    estado: 'Activo'
  });

  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [comunasFiltradas, setComunasFiltradas] = useState([]);
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [telefonoError, setTelefonoError] = useState('');
  const [runError, setRunError] = useState('');

  useEffect(() => {
    cargarRegiones();
    cargarComunas();
    cargarObras();
  }, []);

  const cargarRegiones = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/regiones');
      const data = await response.json();
      setRegiones(data);
    } catch (error) {
      console.error('Error cargando regiones:', error);
    }
  };

  const cargarComunas = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/comunas');
      const data = await response.json();
      setComunas(data);
    } catch (error) {
      console.error('Error cargando comunas:', error);
    }
  };

  const cargarObras = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/obras');
      const data = await response.json();
      setObras(data);
    } catch (error) {
      console.error('Error cargando obras:', error);
    }
  };

  // Validación del RUN chileno (incluyendo K)
  const validarRun = (runCompleto) => {
    const runLimpio = runCompleto.replace(/[^0-9kK]/g, '').toUpperCase();
    if (runLimpio.length < 7 || runLimpio.length > 10) return false;

    const numeros = runLimpio.slice(0, -1);
    const dv = runLimpio.slice(-1);

    if (!/^\d+$/.test(numeros)) return false;

    let suma = 0;
    let multiplicador = 2;

    for (let i = numeros.length - 1; i >= 0; i--) {
      suma += parseInt(numeros[i], 10) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    let dvCalculado = '';
    
    if (dvEsperado === 11) {
      dvCalculado = '0';
    } else if (dvEsperado === 10) {
      dvCalculado = 'K';
    } else {
      dvCalculado = dvEsperado.toString();
    }

    return dv === dvCalculado;
  };

  const formatearRun = (value) => {
    const runLimpio = value.replace(/[^0-9kK]/g, '').toUpperCase();
    if (runLimpio.length === 0) return '';
    
    const cuerpo = runLimpio.slice(0, -1);
    const dv = runLimpio.slice(-1);
    
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return cuerpoFormateado ? `${cuerpoFormateado}-${dv}` : '';
  };

  const validarCorreo = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validarTelefono = (value) => {
    return /^\d{9}$/.test(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telefono') {
      const soloNumeros = value.replace(/\D/g, '');
      
      if (soloNumeros.length > 9) {
        return;
      }
      
      if (soloNumeros.length > 0 && soloNumeros.length !== 9) {
        setTelefonoError('El teléfono debe tener exactamente 9 dígitos.');
      } else {
        setTelefonoError('');
      }
      
      setFormData({ ...formData, [name]: soloNumeros });
      return;
    }

    if (name === 'run') {
      const runValue = formatearRun(value);
      setFormData({ ...formData, [name]: runValue });

      const runLimpio = runValue.replace(/[^0-9kK]/g, '').toUpperCase();
      
      if (runLimpio && !validarRun(runLimpio)) {
        setRunError('Formato de RUN inválido o dígito verificador incorrecto. Ej: 12.345.678-5');
      } else {
        setRunError('');
      }
      return;
    }

    if (name === 'idRegion') {
      const regionSeleccionada = value;
      const filtradas = comunas.filter((comuna) => comuna.idRegion.toString() === regionSeleccionada);
      setComunasFiltradas(filtradas);
      setFormData({ ...formData, idRegion: regionSeleccionada, idComuna: '' });
      return;
    }

    if (name === 'rol' && value === 'admin') {
      setFormData({ ...formData, [name]: value, idObra: '' });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleTelefonoBlur = () => {
    if (formData.telefono.length > 0 && !validarTelefono(formData.telefono)) {
      setTelefonoError('El teléfono debe tener exactamente 9 dígitos.');
    } else {
      setTelefonoError('');
    }
  };

  const generarContrasena = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&%';
    let result = '';
    for (let i = 0; i < 10; i += 1) {
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

    if (!formData.run || !validarRun(formData.run.replace(/[^0-9kK]/g, '').toUpperCase())) {
      setRunError('El RUN es requerido y debe tener un formato válido.');
      setLoading(false);
      return;
    }

    if (!formData.nombre.trim()) {
      setError('El nombre es requerido.');
      setLoading(false);
      return;
    }

    if (!formData.apellidoPaterno.trim()) {
      setError('El apellido paterno es requerido.');
      setLoading(false);
      return;
    }

    if (!formData.apellidoMaterno.trim()) {
      setError('El apellido materno es requerido.');
      setLoading(false);
      return;
    }

    if (!formData.correo || !validarCorreo(formData.correo)) {
      setError('Ingrese un correo válido.');
      setLoading(false);
      return;
    }

    if (!validarTelefono(formData.telefono)) {
      setTelefonoError('El teléfono debe tener exactamente 9 dígitos.');
      setLoading(false);
      return;
    }

    if (!formData.calle.trim()) {
      setError('La calle es requerida.');
      setLoading(false);
      return;
    }

    if (!formData.idRegion) {
      setError('Debe seleccionar una región.');
      setLoading(false);
      return;
    }

    if (!formData.idComuna) {
      setError('Debe seleccionar una comuna.');
      setLoading(false);
      return;
    }

    if (formData.rol === 'usuario' && !formData.idObra) {
      setError('Para el rol usuario debe asignarse una obra.');
      setLoading(false);
      return;
    }

    const usuarioPayload = {
      run: formData.run.replace(/[^0-9kK]/g, '').toUpperCase(),
      nombre: formData.nombre,
      apellidoPaterno: formData.apellidoPaterno,
      apellidoMaterno: formData.apellidoMaterno,
      correo: formData.correo,
      password: formData.password,
      rol: formData.rol,
      idObra: formData.idObra ? parseInt(formData.idObra, 10) : null,
      telefono: formData.telefono,
      direccionCalle: formData.calle,
      idRegion: parseInt(formData.idRegion, 10),
      idComuna: parseInt(formData.idComuna, 10),
      estado: formData.estado
    };

    try {
      const response = await fetch('http://localhost:8080/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioPayload)
      });

      if (response.ok) {
        alert('Usuario creado exitosamente');
        navigate('/admin/usuarios');
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || 'Error al crear el usuario');
      }
    } catch (fetchError) {
      console.error('Error creando usuario:', fetchError);
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
        <div className="card shadow-sm border-0 rounded-3 p-4 mx-auto overflow-auto" style={{ maxWidth: '900px', minWidth: 0, maxHeight: 'calc(100vh - 180px)' }}>
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
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>RUN</label>
                <input
                  type="text"
                  className={`form-control ${runError ? 'is-invalid' : ''}`}
                  name="run"
                  value={formData.run}
                  onChange={handleInputChange}
                  placeholder="12.345.678-9"
                  required
                />
                {runError && <div className="invalid-feedback">{runError}</div>}
              </div>
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
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Apellido Paterno</label>
                <input
                  type="text"
                  className="form-control"
                  name="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={handleInputChange}
                  placeholder="Pérez"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Apellido Materno</label>
                <input
                  type="text"
                  className="form-control"
                  name="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={handleInputChange}
                  placeholder="González"
                  required
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Correo de Contacto</label>
              <input
                type="email"
                className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                placeholder="contacto@empresa.com"
              />
              {errors.correo && (
                <div className="invalid-feedback">
                  {errors.correo}
                </div>
              )}
              {!errors.correo && (
                <small className="form-text text-muted">
                  Debe tener formato válido con @
                </small>
              )}
            </div>
              <div className="col-md-6">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Teléfono</label>
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
                {!telefonoError && (
                  <small className="form-text text-muted">Debe tener exactamente 9 dígitos.</small>
                )}
              </div>
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
                Esta contraseña se puede regenerar antes de la creación.
              </small>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-4">
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
              <div className="col-md-4">
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
              <div className="col-md-4">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Obra asignada</label>
                <select
                  className="form-select"
                  name="idObra"
                  value={formData.idObra}
                  onChange={handleInputChange}
                  disabled={formData.rol === 'admin'}
                >
                  <option value="">Seleccionar obra</option>
                  {obras.map((obra) => (
                    <option key={obra.idObra} value={obra.idObra}>
                      {obra.nombreObra}
                    </option>
                  ))}
                </select>
                <small className="form-text text-muted">
                  {formData.rol === 'admin'
                    ? 'Los admins no requieren obra obligatoria.'
                    : 'Para usuarios la obra es obligatoria.'}
                </small>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Calle</label>
              <div className="input-group col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="calle"
                  value={formData.calle}
                  onChange={handleInputChange}
                  placeholder="Calle Principal y Numeración"
                  required
                />
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Región</label>
                <select
                  className="form-select"
                  name="idRegion"
                  value={formData.idRegion}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar región</option>
                  {regiones.map((region) => (
                    <option key={region.idRegion} value={region.idRegion}>
                      {region.nombreRegion}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Comuna</label>
                <select
                  className="form-select"
                  name="idComuna"
                  value={formData.idComuna}
                  onChange={handleInputChange}
                  disabled={!formData.idRegion}
                  required
                >
                  <option value="">Seleccionar comuna</option>
                  {comunasFiltradas.map((comuna) => (
                    <option key={comuna.idComuna} value={comuna.idComuna}>
                      {comuna.nombreComuna}
                    </option>
                  ))}
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