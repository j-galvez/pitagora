import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaFileContract } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import useEstadoValidation from '../../hooks/useEstadoValidation';

const CrearObra = () => {
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  const { estadoError, limpiarEstadoError, validarCliente } = useEstadoValidation();

  const [formData, setFormData] = useState({
    idCliente: '',
    nombreObra: '',
    descripcionObra: '',
    calle: '',
    idRegion: '',
    idComuna: '',
    planosPresupuestos: '',
    fechaEntrega: '',
    garantiaExpira: '',
    estadoObra: 'Activa'
  });

  const [clientes, setClientes] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [comunasFiltradas, setComunasFiltradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  // const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  // Estado del cliente seleccionado para mostrar alerta inline
  const [clienteSeleccionadoActivo, setClienteSeleccionadoActivo] = useState(true);

  useEffect(() => {
    cargarClientes();
    cargarRegiones();
    cargarComunas();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/clientes');
      if (response.ok) {
        const data = await response.json();
        setClientes(data);
      } else {
        console.error('Error al cargar clientes');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    }
  };

  const cargarRegiones = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/regiones');
      if (response.ok) setRegiones(await response.json());
    } catch (e) {
      console.error('Error al cargar regiones:', e);
    }
  };

  const cargarComunas = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/comunas');
      if (response.ok) setComunas(await response.json());
    } catch (e) {
      console.error('Error al cargar comunas:', e);
    }
  };

  const filtrarComunasPorRegion = (idRegion) => {
    if (!idRegion) { setComunasFiltradas([]); return; }
    setComunasFiltradas(comunas.filter(c => c.idRegion === parseInt(idRegion)));
  };

  const validarFecha = (f) => f !== '' && !isNaN(new Date(f).getTime());
  const validarFechaMayor = (f1, f2) => {
    if (!f1 || !f2) return true;
    return new Date(f1) < new Date(f2);
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === 'idCliente') {
      setFormData({ ...formData, [name]: value });
      newErrors.idCliente = value === '' ? 'Debes seleccionar un cliente' : '';

      // ── Validación de estado del cliente ──────────────────────────────────
      if (value) {
        // Buscar primero en la lista ya cargada (sin fetch adicional)
        const clienteLocal = clientes.find(
          c => String(c.idCliente || c.id_cliente) === String(value)
        );
        if (clienteLocal) {
          const activo = clienteLocal.estado === 'Activo';
          setClienteSeleccionadoActivo(activo);
          if (!activo) {
            newErrors.idCliente =
              `${clienteLocal.nombreEmpresa} está Inactivo. Actívalo antes de crear una obra.`;
          }
        } else {
          // Si no está en la lista (raro), consultar backend
          const valido = await validarCliente(value);
          setClienteSeleccionadoActivo(valido);
        }
      } else {
        setClienteSeleccionadoActivo(true);
        limpiarEstadoError();
      }
      // ─────────────────────────────────────────────────────────────────────

    } else if (name === 'nombreObra') {
      setFormData({ ...formData, [name]: value });
      newErrors.nombreObra = value.trim() === '' ? 'El nombre de la obra es requerido' : '';

    } else if (name === 'idRegion') {
      setFormData({ ...formData, [name]: value, idComuna: '' });
      filtrarComunasPorRegion(value);
      newErrors.idRegion = value === '' ? 'Debes seleccionar una región' : '';
      newErrors.idComuna = '';

    } else if (name === 'calle') {
      setFormData({ ...formData, [name]: value });
      newErrors.calle = value.trim() === '' ? 'La calle es requerida' : '';

    } else if (name === 'idComuna') {
      setFormData({ ...formData, [name]: value });
      newErrors.idComuna = value === '' ? 'Debes seleccionar una comuna' : '';

    } else if (name === 'fechaEntrega') {
      setFormData({ ...formData, [name]: value });
      newErrors.fechaEntrega = !value
        ? 'La fecha de entrega es requerida'
        : !validarFecha(value) ? 'Fecha inválida' : '';

    } else if (name === 'garantiaExpira') {
      setFormData({ ...formData, [name]: value });
      if (!value) {
        newErrors.garantiaExpira = 'La fecha de expiración de garantía es requerida';
      } else if (!validarFecha(value)) {
        newErrors.garantiaExpira = 'Fecha inválida';
      } else if (formData.fechaEntrega && !validarFechaMayor(formData.fechaEntrega, value)) {
        newErrors.garantiaExpira = 'La garantía debe vencer después de la entrega';
      } else {
        newErrors.garantiaExpira = '';
      }

    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors(newErrors);
  };

  /*
  const handleArchivoChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setArchivoSeleccionado(archivo);
      setFormData({ ...formData, planosPresupuestos: archivo.name });
    }
  };
  */

  const handleVolver = () => navigate('/admin/obras');
  const handleCancel = () => navigate('/admin/obras');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // ── Bloquear envío si el cliente está inactivo ─────────────────────────
    if (!clienteSeleccionadoActivo) {
      setError('No es posible crear una obra para un cliente Inactivo.');
      setLoading(false);
      return;
    }

    // Re-validar contra el backend justo antes de guardar
    if (formData.idCliente) {
      const valido = await validarCliente(formData.idCliente);
      if (!valido) {
        setError(
          estadoError ||
          'No es posible crear una obra para un cliente Inactivo.'
        );
        setLoading(false);
        return;
      }
    }
    // ─────────────────────────────────────────────────────────────────────

    // Validación de formulario
    const newErrors = {};
    if (!formData.idCliente) newErrors.idCliente = 'Debes seleccionar un cliente';
    if (!formData.nombreObra.trim()) newErrors.nombreObra = 'El nombre de la obra es requerido';
    if (!formData.idRegion) newErrors.idRegion = 'Debes seleccionar una región';
    if (!formData.calle.trim()) newErrors.calle = 'La calle es requerida';
    if (!formData.idComuna) newErrors.idComuna = 'Debes seleccionar una comuna';
    if (!formData.fechaEntrega) {
      newErrors.fechaEntrega = 'La fecha de entrega es requerida';
    } else if (!validarFecha(formData.fechaEntrega)) {
      newErrors.fechaEntrega = 'Fecha inválida';
    }
    if (!formData.garantiaExpira) {
      newErrors.garantiaExpira = 'La fecha de expiración de garantía es requerida';
    } else if (!validarFecha(formData.garantiaExpira)) {
      newErrors.garantiaExpira = 'Fecha inválida';
    } else if (formData.fechaEntrega && !validarFechaMayor(formData.fechaEntrega, formData.garantiaExpira)) {
      newErrors.garantiaExpira = 'La garantía debe vencer después de la entrega';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const datosObra = {
        idCliente: parseInt(formData.idCliente),
        nombreObra: formData.nombreObra,
        descripcionObra: formData.descripcionObra,
        direccion: formData.calle,
        idRegion: parseInt(formData.idRegion),
        idComuna: parseInt(formData.idComuna),
        planosPresupuestos: formData.planosPresupuestos || null,
        fechaEntrega: formData.fechaEntrega,
        garantiaExpira: formData.garantiaExpira,
        estadoObra: formData.estadoObra
      };

      const response = await fetch('http://localhost:8080/api/obras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosObra)
      });

      if (response.ok) {
        const obraCreada = await response.json();
        alert(`Obra creada exitosamente con ID: ${obraCreada.idObra}`);
        navigate('/admin/obras');
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || 'Error al crear la obra');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      usuario={usuarioLogueado}
      titulo="Creación de Obra"
      handleVolver={handleVolver}
    >
      <div className="container py-4" style={{ overflowX: 'auto', overflowY: 'auto', maxWidth: '100%' }}>
        <div
          className="card shadow-sm border-0 rounded-3 p-4 mx-auto overflow-auto"
          style={{ maxWidth: '750px', minWidth: 0, maxHeight: 'calc(100vh - 180px)' }}
        >
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Alerta global de estado inactivo */}
          {estadoError && (
            <div className="alert alert-danger d-flex align-items-start gap-2">
              <span>⚠️</span>
              <span>{estadoError}</span>
            </div>
          )}

          <div className="mb-4 border-bottom pb-3">
            <h5 className="text-dark mb-1">Información de la Obra</h5>
            <span className="text-muted" style={{ fontSize: '13px' }}>Completa los datos del nuevo proyecto</span>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Cliente */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Cliente *</label>
              <select
                className={`form-select ${errors.idCliente || !clienteSeleccionadoActivo ? 'is-invalid' : ''}`}
                name="idCliente"
                value={formData.idCliente}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un cliente</option>
                {clientes.map((cliente) => {
                  const id = cliente.idCliente || cliente.id_cliente;
                  const nombre = cliente.nombreEmpresa || cliente.nombre_empresa;
                  const inactivo = cliente.estado === 'Inactivo';
                  return (
                    <option key={id} value={id}>
                      {nombre}{inactivo ? ' (Inactivo)' : ''}
                    </option>
                  );
                })}
              </select>
              {errors.idCliente && (
                <div className="invalid-feedback">{errors.idCliente}</div>
              )}
              {!errors.idCliente && !clienteSeleccionadoActivo && (
                <div className="invalid-feedback d-block">
                  Este cliente está Inactivo. Actívalo en Gestión de Clientes para poder asignarle obras.
                </div>
              )}
            </div>

            {/* Nombre de Obra */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Nombre de Obra *</label>
              <input
                type="text"
                className={`form-control ${errors.nombreObra ? 'is-invalid' : ''}`}
                name="nombreObra"
                value={formData.nombreObra}
                onChange={handleInputChange}
                placeholder="Ej: Edificio Centro Comercial"
                required
              />
              {errors.nombreObra && <div className="invalid-feedback">{errors.nombreObra}</div>}
            </div>

            {/* Descripción de Obra */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Descripción de la Obra</label>
              <textarea
                className="form-control"
                name="descripcionObra"
                value={formData.descripcionObra}
                onChange={handleInputChange}
                placeholder="Describe los detalles del proyecto"
                rows="3"
              />
            </div>

            {/* Región */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Región *</label>
              <select
                className={`form-select ${errors.idRegion ? 'is-invalid' : ''}`}
                name="idRegion"
                value={formData.idRegion}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona una región</option>
                {regiones.map((r) => (
                  <option key={r.idRegion} value={r.idRegion}>{r.nombreRegion}</option>
                ))}
              </select>
              {errors.idRegion && <div className="invalid-feedback">{errors.idRegion}</div>}
            </div>

            {/* Calle */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Calle *</label>
              <input
                type="text"
                className={`form-control ${errors.calle ? 'is-invalid' : ''}`}
                name="calle"
                value={formData.calle}
                onChange={handleInputChange}
                placeholder="Ej: Avenida Principal"
                required
              />
              {errors.calle && <div className="invalid-feedback">{errors.calle}</div>}
            </div>

            {/* Comuna */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Comuna *</label>
              <select
                className={`form-select ${errors.idComuna ? 'is-invalid' : ''}`}
                name="idComuna"
                value={formData.idComuna}
                onChange={handleInputChange}
                required
                disabled={!formData.idRegion}
              >
                <option value="">
                  {formData.idRegion ? 'Selecciona una comuna' : 'Primero selecciona una región'}
                </option>
                {comunasFiltradas.map((c) => (
                  <option key={c.idComuna} value={c.idComuna}>{c.nombreComuna}</option>
                ))}
              </select>
              {errors.idComuna && <div className="invalid-feedback">{errors.idComuna}</div>}
            </div>

            {/* Planos y Presupuestos — pendiente de implementación (Cloud Storage)
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Planos y Presupuestos</label>
              <input
                type="file"
                className="form-control"
                name="planosPresupuestos"
                onChange={handleArchivoChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              />
              <small className="form-text text-muted">
                Se agregará Google Cloud Storage próximamente. Actualmente se guarda el nombre del archivo.
              </small>
              {archivoSeleccionado && (
                <div className="mt-2 alert alert-info">
                  Archivo seleccionado: {archivoSeleccionado.name}
                </div>
              )}
            </div>
            */}

            {/* Fechas */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Fecha de Entrega *</label>
                <input
                  type="date"
                  className={`form-control ${errors.fechaEntrega ? 'is-invalid' : ''}`}
                  name="fechaEntrega"
                  value={formData.fechaEntrega}
                  onChange={handleInputChange}
                  required
                />
                {errors.fechaEntrega && <div className="invalid-feedback">{errors.fechaEntrega}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Expiración de Garantía *</label>
                <input
                  type="date"
                  className={`form-control ${errors.garantiaExpira ? 'is-invalid' : ''}`}
                  name="garantiaExpira"
                  value={formData.garantiaExpira}
                  onChange={handleInputChange}
                  required
                />
                {errors.garantiaExpira && <div className="invalid-feedback">{errors.garantiaExpira}</div>}
              </div>
            </div>

            {/* Estado Obra */}
            <div className="mb-4">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Estado de la Obra</label>
              <select
                className="form-select"
                name="estadoObra"
                value={formData.estadoObra}
                onChange={handleInputChange}
              >
                <option value="Activa">Activa</option>
                <option value="Garantía Vencida">Garantía Vencida</option>
                <option value="Inactiva">Inactiva</option>
              </select>
              {(formData.estadoObra === 'Inactiva' || formData.estadoObra === 'Garantía Vencida') && (
                <div className="alert alert-warning mt-2 py-2" style={{ fontSize: '13px' }}>
                  <strong>Atención:</strong> Una obra con estado "{formData.estadoObra}" no permitirá crear nuevos tickets u observaciones.
                </div>
              )}
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
                disabled={loading || !clienteSeleccionadoActivo}
                title={!clienteSeleccionadoActivo ? 'El cliente seleccionado está Inactivo' : ''}
              >
                {loading ? 'Creando...' : <><FaFileContract className="me-2" /> Crear Obra</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CrearObra;
