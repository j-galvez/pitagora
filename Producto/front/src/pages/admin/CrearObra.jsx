import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaFileContract, FaArrowLeft } from 'react-icons/fa';
import NavbarAdmin from '../../components/NavbarAdmin';
import AdminLayout from '../../components/AdminLayout';

const CrearObra = () => {
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
    numeracion: '',
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
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  // Cargar clientes, regiones y comunas al montar el componente
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
      if (response.ok) {
        const data = await response.json();
        setRegiones(data);
      } else {
        console.error('Error al cargar regiones');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    }
  };

  const cargarComunas = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/comunas');
      if (response.ok) {
        const data = await response.json();
        setComunas(data);
      } else {
        console.error('Error al cargar comunas');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    }
  };

  // Filtrar comunas por región seleccionada
  const filtrarComunasPorRegion = (idRegion) => {
    if (!idRegion) {
      setComunasFiltradas([]);
      return;
    }
    const filtered = comunas.filter(comuna => comuna.idRegion === parseInt(idRegion));
    setComunasFiltradas(filtered);
  };

  const validarFecha = (fecha) => {
    return fecha !== '' && !isNaN(new Date(fecha).getTime());
  };

  const validarFechaMayor = (fecha1, fecha2) => {
    if (fecha1 === '' || fecha2 === '') return true;
    return new Date(fecha1) < new Date(fecha2);
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
    } else if (name === 'numeracion') {
      setFormData({ ...formData, [name]: value });
      newErrors.numeracion = value.trim() === '' ? 'La numeración es requerida' : '';
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

  const handleArchivoChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setArchivoSeleccionado(archivo);
      // Por ahora solo guardamos el nombre del archivo
      // Más tarde se subirá a Google Cloud Storage
      setFormData({ ...formData, planosPresupuestos: archivo.name });
    }
  };

  const handleVolver = () => {
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

    if (!formData.idCliente) {
      newErrors.idCliente = 'Debes seleccionar un cliente';
    }
    if (!formData.nombreObra.trim()) {
      newErrors.nombreObra = 'El nombre de la obra es requerido';
    }
    if (!formData.idRegion) {
      newErrors.idRegion = 'Debes seleccionar una región';
    }
    if (!formData.calle.trim()) {
      newErrors.calle = 'La calle es requerida';
    }
    if (!formData.numeracion.trim()) {
      newErrors.numeracion = 'La numeración es requerida';
    }
    if (!formData.idComuna) {
      newErrors.idComuna = 'Debes seleccionar una comuna';
    }
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
        direccion: `${formData.calle} ${formData.numeracion}`,
        idRegion: parseInt(formData.idRegion),
        idComuna: parseInt(formData.idComuna),
        planosPresupuestos: formData.planosPresupuestos || null,
        fechaEntrega: formData.fechaEntrega,
        garantiaExpira: formData.garantiaExpira,
        estadoObra: formData.estadoObra
      };

      const response = await fetch('http://localhost:8080/api/obras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosObra),
      });

      if (response.ok) {
        const obraCreada = await response.json();
        alert(`Obra creada exitosamente con ID: ${obraCreada.idObra}`);
        navigate('/admin-dashboard');
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || 'Error al crear la obra');
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
      titulo="Creación de Obra" 
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
            <h5 className="text-dark mb-1">Información de la Obra</h5>
            <span className="text-muted" style={{ fontSize: '13px' }}>Completa los datos del nuevo proyecto</span>
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
              {errors.idCliente && (
                <div className="invalid-feedback">
                  {errors.idCliente}
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
              {errors.nombreObra && (
                <div className="invalid-feedback">
                  {errors.nombreObra}
                </div>
              )}
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
              ></textarea>
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
                {regiones.map((region) => (
                  <option key={region.idRegion} value={region.idRegion}>
                    {region.nombreRegion}
                  </option>
                ))}
              </select>
              {errors.idRegion && (
                <div className="invalid-feedback">
                  {errors.idRegion}
                </div>
              )}
            </div>

            {/* Dirección - Calle y Numeración */}
            <div className="row g-3 mb-3">
              <div className="col-md-8">
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
                {errors.calle && (
                  <div className="invalid-feedback">
                    {errors.calle}
                  </div>
                )}
              </div>
              <div className="col-md-4">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>Numeración *</label>
                <input
                  type="text"
                  className={`form-control ${errors.numeracion ? 'is-invalid' : ''}`}
                  name="numeracion"
                  value={formData.numeracion}
                  onChange={handleInputChange}
                  placeholder="Ej: 1234"
                  required
                />
                {errors.numeracion && (
                  <div className="invalid-feedback">
                    {errors.numeracion}
                  </div>
                )}
              </div>
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
                {comunasFiltradas.map((comuna) => (
                  <option key={comuna.idComuna} value={comuna.idComuna}>
                    {comuna.nombreComuna}
                  </option>
                ))}
              </select>
              {errors.idComuna && (
                <div className="invalid-feedback">
                  {errors.idComuna}
                </div>
              )}
            </div>

            {/* Planos y Presupuestos */}
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
                <div className="mt-2 alert alert-info" role="alert">
                  Archivo seleccionado: {archivoSeleccionado.name}
                </div>
              )}
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
                {errors.fechaEntrega && (
                  <div className="invalid-feedback">
                    {errors.fechaEntrega}
                  </div>
                )}
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
                {errors.garantiaExpira && (
                  <div className="invalid-feedback">
                    {errors.garantiaExpira}
                  </div>
                )}
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
                <option value="Cerrada">Cerrada</option>
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
              <button type="submit" className="btn px-4 text-white" style={{ backgroundColor: '#0B3B60' }} disabled={loading}>
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
