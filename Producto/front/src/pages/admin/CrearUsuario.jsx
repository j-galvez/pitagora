import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserPlus } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import useEstadoValidation from '../../hooks/useEstadoValidation';

const CrearUsuario = () => {
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  const { estadoError, limpiarEstadoError, validarObra } = useEstadoValidation();

  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    telefono: '',
    password: '',
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
  const [errors, setErrors] = useState({});
  const [telefonoError, setTelefonoError] = useState('');
  const [runError, setRunError] = useState('');
  // Estado de validación de la obra seleccionada
  const [obraSeleccionadaValida, setObraSeleccionadaValida] = useState(true);
  const [obraValidando, setObraValidando] = useState(false);

  useEffect(() => {
    cargarRegiones();
    cargarComunas();
    cargarObras();
  }, []);

  const cargarRegiones = async () => {
    try {
      const r = await fetch('http://localhost:8080/api/regiones');
      setRegiones(await r.json());
    } catch (e) { console.error('Error cargando regiones:', e); }
  };

  const cargarComunas = async () => {
    try {
      const r = await fetch('http://localhost:8080/api/comunas');
      setComunas(await r.json());
    } catch (e) { console.error('Error cargando comunas:', e); }
  };

  const cargarObras = async () => {
    try {
      const r = await fetch('http://localhost:8080/api/obras');
      const data = await r.json();
      setObras(data);
    } catch (e) { console.error('Error cargando obras:', e); }
  };

  // ── RUN chileno ─────────────────────────────────────────────────────────────
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
    const dvCalculado =
      dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    return dv === dvCalculado;
  };

  const formatearRun = (value) => {
    const runLimpio = value.replace(/[^0-9kK]/g, '').toUpperCase();
    if (!runLimpio.length) return '';
    const numeros = runLimpio.slice(0, -1);
    const dv = runLimpio.slice(-1);
    const rutFormateado = numeros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return dv ? rutFormateado + '-' + dv : rutFormateado;
  };

  const validarCorreo = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validarTelefono = (v) => /^\d{9}$/.test(v);

  // ── Validación de obra al cambiar el select ──────────────────────────────────
  const handleObraChange = async (idObra) => {
    setFormData(prev => ({ ...prev, idObra }));
    limpiarEstadoError();

    if (!idObra) {
      setObraSeleccionadaValida(true);
      return;
    }

    // Validación rápida desde la lista ya cargada
    const obraLocal = obras.find(
      o => String(o.idObra || o.id_obra) === String(idObra)
    );

    if (obraLocal) {
      const estadoObra = obraLocal.estadoObra || obraLocal.estado_obra;
      if (estadoObra !== 'Activa') {
        setObraSeleccionadaValida(false);
        return;
      }
    }

    // Validación completa (incluyendo estado del cliente) contra el backend
    setObraValidando(true);
    const valida = await validarObra(idObra);
    setObraSeleccionadaValida(valida);
    setObraValidando(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telefono') {
      const soloNumeros = value.replace(/\D/g, '');
      if (soloNumeros.length > 9) return;
      setFormData({ ...formData, [name]: soloNumeros });
      setTelefonoError(
        soloNumeros.length > 0 && soloNumeros.length !== 9
          ? 'El teléfono debe tener exactamente 9 dígitos.'
          : ''
      );
      return;
    }

    if (name === 'run') {
      const runValue = formatearRun(value);
      setFormData({ ...formData, [name]: runValue });
      const runLimpio = runValue.replace(/[^0-9kK]/g, '').toUpperCase();
      setRunError(
        runLimpio && !validarRun(runLimpio)
          ? 'Formato de RUN inválido o dígito verificador incorrecto. Ej: 12.345.678-5'
          : ''
      );
      return;
    }

    if (name === 'correo') {
      setFormData({ ...formData, [name]: value });
      setErrors({
        ...errors,
        correo: value && !validarCorreo(value)
          ? 'Formato de correo inválido. Ej: usuario@empresa.com'
          : ''
      });
      return;
    }

    if (name === 'idRegion') {
      const filtradas = comunas.filter(c => c.idRegion?.toString() === value);
      setComunasFiltradas(filtradas);
      setFormData({ ...formData, idRegion: value, idComuna: '' });
      return;
    }

    if (name === 'idObra') {
      handleObraChange(value);
      return;
    }

    if (name === 'rol') {
      // Si cambia a admin, limpiar idObra y resetear validación
      if (value === 'admin') {
        setFormData({ ...formData, [name]: value, idObra: '' });
        setObraSeleccionadaValida(true);
        limpiarEstadoError();
      } else {
        setFormData({ ...formData, [name]: value });
      }
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

  const handleVolver = () => navigate('/admin/usuarios');
  const handleCancel = () => navigate('/admin/usuarios');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // ── Bloquear si la obra seleccionada no es válida ─────────────────────
    if (formData.rol === 'usuario' && formData.idObra && !obraSeleccionadaValida) {
      setError(
        estadoError ||
        'La obra seleccionada no está Activa o su cliente está Inactivo. Selecciona otra obra.'
      );
      setLoading(false);
      return;
    }

    // Re-validar contra backend antes de guardar
    if (formData.rol === 'usuario' && formData.idObra) {
      const valida = await validarObra(formData.idObra);
      if (!valida) {
        setError(
          estadoError ||
          'La obra seleccionada no está disponible para asignar usuarios.'
        );
        setLoading(false);
        return;
      }
    }
    // ─────────────────────────────────────────────────────────────────────

    // Validaciones de formulario
    if (!formData.run || !validarRun(formData.run.replace(/[^0-9kK]/g, '').toUpperCase())) {
      setRunError('El RUN es requerido y debe tener un formato válido.');
      setLoading(false);
      return;
    }
    if (!formData.nombre.trim()) { setError('El nombre es requerido.'); setLoading(false); return; }
    if (!formData.apellidoPaterno.trim()) { setError('El apellido paterno es requerido.'); setLoading(false); return; }
    if (!formData.apellidoMaterno.trim()) { setError('El apellido materno es requerido.'); setLoading(false); return; }
    if (!formData.correo || !validarCorreo(formData.correo)) { setError('Ingrese un correo válido.'); setLoading(false); return; }
    if (!validarTelefono(formData.telefono)) { setTelefonoError('El teléfono debe tener exactamente 9 dígitos.'); setLoading(false); return; }
    if (!formData.calle.trim()) { setError('La calle es requerida.'); setLoading(false); return; }
    if (!formData.idRegion) { setError('Debe seleccionar una región.'); setLoading(false); return; }
    if (!formData.idComuna) { setError('Debe seleccionar una comuna.'); setLoading(false); return; }
    if (formData.rol === 'usuario' && !formData.idObra) {
      setError('Para el rol usuario debe asignarse una obra.');
      setLoading(false);
      return;
    }

    const usuarioPayload = {
      run: formData.run,
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioPayload)
      });

      if (response.ok) {
        alert(`Usuario creado exitosamente. Correo de bienvenida enviado a: ${formData.correo}`);
        navigate('/admin/usuarios');
      } else {
        const errorMessage = await response.text();
        let parsedError = errorMessage;
        try {
          const errorJson = JSON.parse(errorMessage);
          parsedError = errorJson.message || errorJson.error || errorMessage;
        } catch {}
        if (parsedError.includes('Duplicate entry') || parsedError.includes('ConstraintViolation')) {
          setError('Error: El RUN o el Correo ingresado ya se encuentran registrados en el sistema.');
        } else {
          setError(`Error del servidor: ${parsedError || 'No se pudo crear el usuario'}`);
        }
      }
    } catch (fetchError) {
      console.error('Error creando usuario:', fetchError);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar obras para el selector: mostrar todas pero marcar las no activas
  const obrasParaSelector = obras.map(o => ({
    ...o,
    _activa: (o.estadoObra || o.estado_obra) === 'Activa'
  }));

  return (
    <AdminLayout
      usuario={usuarioLogueado}
      titulo="Creación de Usuario"
      handleVolver={handleVolver}
    >
      <div className="container py-4" style={{ overflowX: 'auto', overflowY: 'auto', maxWidth: '100%' }}>
        <div
          className="card shadow-sm border-0 rounded-3 p-4 mx-auto overflow-auto"
          style={{ maxWidth: '900px', minWidth: 0, maxHeight: 'calc(100vh - 180px)' }}
        >
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Alerta de estado de obra/cliente */}
          {estadoError && (
            <div className="alert alert-danger d-flex align-items-start gap-2">
              <span>⚠️</span>
              <span>{estadoError}</span>
            </div>
          )}

          <div className="mb-4 border-bottom pb-3">
            <h5 className="text-dark mb-1">Información del Usuario</h5>
            <span className="text-muted" style={{ fontSize: '13px' }}>Completa los datos del nuevo usuario</span>
          </div>

          <form onSubmit={handleSubmit}>
            {/* RUN y Nombre */}
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

            {/* Apellidos */}
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

            {/* Correo */}
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
              {errors.correo
                ? <div className="invalid-feedback">{errors.correo}</div>
                : <small className="form-text text-muted">Debe tener formato válido con @</small>
              }
            </div>

            {/* Teléfono */}
            <div className="mb-3">
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
              {telefonoError
                ? <div className="invalid-feedback">{telefonoError}</div>
                : <small className="form-text text-muted">Debe tener exactamente 9 dígitos.</small>
              }
            </div>

            {/* Contraseña (automática) */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Contraseña</label>
              <div className="alert alert-info mb-0">
                <small>La contraseña será generada automáticamente por el sistema y enviada al correo del usuario.</small>
              </div>
            </div>

            {/* Rol, Estado, Obra */}
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
                {formData.estado === 'Inactivo' && (
                  <div className="alert alert-warning mt-2 py-2" style={{ fontSize: '13px' }}>
                    <strong>Atención:</strong> Un usuario inactivo no podrá acceder ni participar en nuevos tickets u observaciones.
                  </div>
                )}
              </div>
              <div className="col-md-4">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Obra asignada</label>
                <select
                  className={`form-select ${!obraSeleccionadaValida ? 'is-invalid' : ''}`}
                  name="idObra"
                  value={formData.idObra}
                  onChange={handleInputChange}
                  disabled={formData.rol === 'admin'}
                >
                  <option value="">Seleccionar obra</option>
                  {obrasParaSelector.map((obra) => {
                    const id = obra.idObra || obra.id_obra;
                    const nombre = obra.nombreObra || obra.nombre_obra;
                    const estadoObra = obra.estadoObra || obra.estado_obra;
                    const noActiva = estadoObra !== 'Activa';
                    return (
                      <option key={id} value={id}>
                        {nombre}{noActiva ? ` (${estadoObra})` : ''}
                      </option>
                    );
                  })}
                </select>
                {obraValidando && (
                  <small className="text-muted">Verificando estado de la obra...</small>
                )}
                {!obraSeleccionadaValida && !obraValidando && (
                  <div className="invalid-feedback d-block" style={{ fontSize: '12px' }}>
                    {estadoError || 'Esta obra no está disponible (inactiva o cliente inactivo).'}
                  </div>
                )}
                {obraSeleccionadaValida && (
                  <small className="form-text text-muted">
                    {formData.rol === 'admin'
                      ? 'Los admins no requieren obra obligatoria.'
                      : 'Para usuarios la obra es obligatoria.'}
                  </small>
                )}
              </div>
            </div>

            {/* Calle */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Calle</label>
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

            {/* Región y Comuna */}
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
                  {regiones.map((r) => (
                    <option key={r.idRegion} value={r.idRegion}>{r.nombreRegion}</option>
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
                  {comunasFiltradas.map((c) => (
                    <option key={c.idComuna} value={c.idComuna}>{c.nombreComuna}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botones */}
            <div className="d-flex justify-content-end gap-2 border-top pt-3">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn px-4 text-white"
                style={{ backgroundColor: '#0B3B60' }}
                disabled={loading || (formData.rol === 'usuario' && !!formData.idObra && !obraSeleccionadaValida)}
                title={
                  !obraSeleccionadaValida
                    ? 'La obra seleccionada no está disponible'
                    : ''
                }
              >
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
