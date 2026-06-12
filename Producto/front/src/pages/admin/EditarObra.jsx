import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaFileContract, FaSave } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';

const EditarObra = () => {
  const { id_obra } = useParams();
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validarFecha = (fecha) => fecha !== '' && !isNaN(new Date(fecha).getTime());

  const validarFechaMayor = (fecha1, fecha2) => {
    if (fecha1 === '' || fecha2 === '') return true;
    return new Date(fecha1) < new Date(fecha2);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [obraRes, clientesRes, regionesRes, comunasRes] = await Promise.all([
          fetch(`http://localhost:8080/api/obras/${id_obra}`),
          fetch('http://localhost:8080/api/clientes'),
          fetch('http://localhost:8080/api/regiones'),
          fetch('http://localhost:8080/api/comunas')
        ]);

        if (!obraRes.ok) throw new Error('No se encontró la obra');

        const obra = await obraRes.json();
        const clientesData = await clientesRes.json();
        const regionesData = await regionesRes.json();
        const comunasData = await comunasRes.json();

        setClientes(clientesData);
        setRegiones(regionesData);
        setComunas(comunasData);

        // Filtrar comunas según la región de la obra
        if (obra.idRegion) {
          const filtradas = comunasData.filter(c => {
            const id = c.idRegion || c.id_region;
            return id === obra.idRegion;
          });
          setComunasFiltradas(filtradas);
        }

        // Formatear fechas de LocalDate a string yyyy-MM-dd para input[type=date]
        const formatDate = (d) => {
          if (!d) return '';
          if (typeof d === 'string') return d.slice(0, 10);
          return d;
        };

        setFormData({
          idCliente: obra.idCliente ? String(obra.idCliente) : '',
          nombreObra: obra.nombreObra || '',
          descripcionObra: obra.descripcionObra || '',
          calle: obra.direccion || '',
          idRegion: obra.idRegion ? String(obra.idRegion) : '',
          idComuna: obra.idComuna ? String(obra.idComuna) : '',
          planosPresupuestos: obra.planosPresupuestos || '',
          fechaEntrega: formatDate(obra.fechaEntrega),
          garantiaExpira: formatDate(obra.garantiaExpira),
          estadoObra: obra.estadoObra || 'Activa'
        });
      } catch (err) {
        setError(err.message || 'Error al cargar los datos de la obra');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id_obra]);

  const filtrarComunasPorRegion = (idRegion) => {
    if (!idRegion) {
      setComunasFiltradas([]);
      return;
    }
    const filtered = comunas.filter(c => {
      const id = c.idRegion || c.id_region;
      return id === parseInt(idRegion, 10);
    });
    setComunasFiltradas(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === 'nombreObra') {
      setFormData({ ...formData, [name]: value });
      newErrors.nombreObra = value.trim() === '' ? 'El nombre de la obra es requerido' : '';
    } else if (name === 'idCliente') {
      setFormData({ ...formData, [name]: value });
      newErrors.idCliente = value === '' ? 'Debes seleccionar un cliente' : '';
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
      if (value === '') {
        newErrors.fechaEntrega = 'La fecha de entrega es requerida';
      } else if (!validarFecha(value)) {
        newErrors.fechaEntrega = 'Fecha inválida';
      } else {
        newErrors.fechaEntrega = '';
      }
    } else if (name === 'garantiaExpira') {
      setFormData({ ...formData, [name]: value });
      if (value === '') {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    // Validación
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
      setSaving(false);
      return;
    }

    try {
      const payload = {
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

      const response = await fetch(`http://localhost:8080/api/obras/${id_obra}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccessMessage('Obra actualizada correctamente.');
        setTimeout(() => navigate('/admin/obras'), 1200);
      } else {
        const errorText = await response.text();
        setError(errorText || 'Error al actualizar la obra');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setSaving(false);
    }
  };

  const handleVolver = () => navigate('/admin/obras');

  if (loading) {
    return (
      <AdminLayout usuario={usuarioLogueado} titulo="Editar Obra" handleVolver={handleVolver}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <div className="mt-3">Cargando datos de la obra...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout usuario={usuarioLogueado} titulo="Editar Obra" handleVolver={handleVolver}>
      <div className="container py-4" style={{ overflowX: 'auto', overflowY: 'auto', maxWidth: '100%' }}>
        <div className="card shadow-sm border-0 rounded-3 p-4 mx-auto overflow-auto" style={{ maxWidth: '750px', minWidth: 0, maxHeight: 'calc(100vh - 180px)' }}>

          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <div className="mb-4 border-bottom pb-3">
            <h5 className="text-dark mb-1">Editar Información de la Obra</h5>
            <span className="text-muted" style={{ fontSize: '13px' }}>Modifica los datos del proyecto</span>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Cliente */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Cliente *</label>
              <select
                className={`form-select ${errors.idCliente ? 'is-invalid' : ''}`}
                name="idCliente"
                value={formData.idCliente}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.idCliente} value={cliente.idCliente}>
                    {cliente.nombreEmpresa}
                  </option>
                ))}
              </select>
              {errors.idCliente && <div className="invalid-feedback">{errors.idCliente}</div>}
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

            {/* Descripción */}
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
                <option value="">{formData.idRegion ? 'Selecciona una comuna' : 'Primero selecciona una región'}</option>
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

            {/* Planos y Presupuestos */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Planos y Presupuestos</label>
              <input
                type="text"
                className="form-control"
                name="planosPresupuestos"
                value={formData.planosPresupuestos}
                onChange={handleInputChange}
                placeholder="Nombre del archivo de planos"
              />
              <small className="form-text text-muted">Integración con Cloud Storage próximamente.</small>
            </div>

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

            {/* Estado */}
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
                <option value="Cerrada">Cerrada</option>
              </select>
              {(formData.estadoObra === 'Cerrada' || formData.estadoObra === 'Garantía Vencida') && (
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
                onClick={handleVolver}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn px-4 text-white"
                style={{ backgroundColor: '#0B3B60' }}
                disabled={saving}
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

export default EditarObra;
