import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import NavbarUsuario from '../../components/NavbarUsuario';
import NavbarAdmin from '../../components/NavbarAdmin';
import Footer from '../../components/Footer';
import { esClienteActivo, esObraActiva, esUsuarioActivo, puedeCrearTicketOuObservacion, mensajeBloqueoCreacion } from '../../utils/estadoEntidades';

export default function CrearTicket() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [obras, setObras] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [idClienteSeleccionado, setIdClienteSeleccionado] = useState('');
  const [usuariosObra, setUsuariosObra] = useState([]);
  
  // Recuperar usuario
  const usuarioLocalStorage = JSON.parse(localStorage.getItem('usuario'));
  const usuarioLogueado = usuarioLocalStorage || {};

  const isAdmin = usuarioLogueado.rol === 'admin';
  const idUsuarioActual = usuarioLogueado.idUsuario || usuarioLogueado.id_usuario;
  const idObraActual = usuarioLogueado.idObra || usuarioLogueado.id_obra;

  // Estado para el nombre de la obra (lo buscamos si no viene en el login)
  const [nombreObraReal, setNombreObraReal] = useState(usuarioLogueado.nombre_obra || usuarioLogueado.nombreObra || '');
  const [nombreClienteReal, setNombreClienteReal] = useState('');
  const [obraUsuario, setObraUsuario] = useState(null);

  const getObraId = (obra) => obra?.idObra || obra?.id_obra;
  const getClienteId = (cliente) => cliente?.idCliente || cliente?.id_cliente;
  const getClienteIdDeObra = (obra) => obra?.idCliente || obra?.id_cliente;

  const obrasFiltradas = obras.filter(esObraActiva).filter((obra) => {
    if (!idClienteSeleccionado) return true;
    return String(getClienteIdDeObra(obra)) === String(idClienteSeleccionado);
  });

  const clientesActivos = clientes.filter(esClienteActivo);

  const puedeCrear = isAdmin || puedeCrearTicketOuObservacion(obraUsuario);

  const [formData, setFormData] = useState({
    idObra: isAdmin ? '' : (idObraActual || ''),
    idUsuarioCreador: idUsuarioActual || '',
    idUsuario: isAdmin ? '' : (idUsuarioActual || ''),
    estadoGeneral: 'abierto'
  });

  useEffect(() => {
    // Sincronizar el formulario con los datos reales del usuario una vez que estén disponibles
    if (!isAdmin && idObraActual) {
      setFormData(prev => ({
        ...prev,
        idObra: idObraActual,
        idUsuarioCreador: idUsuarioActual,
        idUsuario: idUsuarioActual
      }));
    }
  }, [isAdmin, idObraActual, idUsuarioActual]);

  useEffect(() => {
    if (isAdmin) {
      cargarDatosAdmin();
      return;
    }

    if (!idObraActual) return;

    const cargarDatosObraUsuario = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/obras/${idObraActual}`);
        if (!res.ok) throw new Error('Error al cargar obra');
        const data = await res.json();
        setObraUsuario(data);
        setNombreObraReal(data.nombreObra || data.nombre_obra || '');
        setNombreClienteReal(data.nombreEmpresa || data.nombre_empresa || '');
        if (!puedeCrearTicketOuObservacion(data)) {
          setError(mensajeBloqueoCreacion(data));
        }
      } catch (err) {
        console.error('Error al obtener datos de la obra:', err);
        setNombreObraReal((prev) => prev || `Obra ID: ${idObraActual}`);
      }
    };

    cargarDatosObraUsuario();
  }, [isAdmin, idObraActual]);

  useEffect(() => {
    if (isAdmin && formData.idObra) {
      cargarUsuariosPorObra(formData.idObra);
    }
  }, [isAdmin, formData.idObra]);

  const cargarDatosAdmin = async () => {
    try {
      const [obrasRes, clientesRes] = await Promise.all([
        fetch('http://localhost:8080/api/obras'),
        fetch('http://localhost:8080/api/clientes'),
      ]);

      if (obrasRes.ok) {
        setObras(await obrasRes.json() || []);
      } else {
        throw new Error('Error al cargar obras');
      }

      if (clientesRes.ok) {
        setClientes(await clientesRes.json() || []);
      } else {
        throw new Error('Error al cargar clientes');
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setObras([
        { id_obra: 1, id_cliente: 1, nombre_obra: 'Edificio Los Almendros', nombreEmpresa: 'Cliente demo' },
        { id_obra: 2, id_cliente: 2, nombre_obra: 'Condominio El Roble', nombreEmpresa: 'Cliente demo 2' },
      ]);
      setClientes([
        { id_cliente: 1, nombre_empresa: 'Cliente demo' },
        { id_cliente: 2, nombre_empresa: 'Cliente demo 2' },
      ]);
    }
  };

  const handleClienteChange = (e) => {
    const idCliente = e.target.value;
    setIdClienteSeleccionado(idCliente);

    if (!idCliente) return;

    if (formData.idObra) {
      const obraActual = obras.find((o) => String(getObraId(o)) === String(formData.idObra));
      if (obraActual && String(getClienteIdDeObra(obraActual)) !== String(idCliente)) {
        setFormData((prev) => ({ ...prev, idObra: '', idUsuario: '' }));
        setUsuariosObra([]);
      }
    }
  };

  const handleObraChange = (e) => {
    const idObra = e.target.value;
    const obra = obras.find((o) => String(getObraId(o)) === String(idObra));
    const idCliente = obra ? getClienteIdDeObra(obra) : '';

    if (idCliente) {
      setIdClienteSeleccionado(String(idCliente));
    }

    setFormData((prev) => ({ ...prev, idObra, idUsuario: '' }));
  };

  const cargarUsuariosPorObra = async (idObra) => {
    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/obra/${idObra}`);
      if (response.ok) {
        const data = await response.json();
        const asignables = (data || []).filter(u => {
          const rol = (u.rol || '').toLowerCase();
          const id = u.idUsuario || u.id_usuario;
          return rol !== 'admin' && Number(id) !== Number(idUsuarioActual) && esUsuarioActivo(u);
        });
        setUsuariosObra(asignables);
      } else {
        throw new Error('Error al cargar usuarios de la obra');
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setUsuariosObra([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin && !puedeCrear) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!formData.idObra) {
      setError('Por favor selecciona una obra');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (isAdmin && !formData.idUsuario) {
      setError('Por favor selecciona un usuario para asignar el ticket');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (isAdmin && Number(formData.idUsuario) === Number(idUsuarioActual)) {
      setError('No puedes asignar un ticket a tu propio usuario administrador');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    console.log("Enviando ticket con datos finales:", formData);

    try {
      const response = await fetch('http://localhost:8080/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error al crear el ticket');
      }
      const ticketData = await response.json();

      setSuccess('¡Ticket creado exitosamente! Redirigiendo a observaciones...');
      setTimeout(() => {
        // Usamos idTicket que es como lo devuelve el Backend
        const ticketId = ticketData.idTicket || ticketData.id_ticket || ticketData.id || 1;
        navigate(`/crear-observacion/${ticketId}`);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate(isAdmin ? '/admin-dashboard' : '/dashboard');
  };

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      {isAdmin ? <NavbarAdmin usuario={usuarioLogueado} /> : <NavbarUsuario usuario={usuarioLogueado} />}

      <div className="flex-grow-1 d-flex flex-column" style={{ backgroundColor: '#F8F9FA', height: '100vh', overflowY: 'auto' }}>
        
        {/* Barra de Navegación Superior - Exacta a AdminLayout */}
        <nav className="navbar navbar-dark" style={{ backgroundColor: '#002840' }}>
          <div className="container-fluid d-flex justify-content-between align-items-center py-2">
            <div className="d-flex align-items-center">
              <button className="btn btn-link text-white me-3 text-decoration-none d-flex align-items-center" onClick={handleVolver}>
                <FaArrowLeft className="me-1" /> Volver
              </button>
              <h4 className="text-white mb-0">Nueva Solicitud</h4>
            </div>
          </div>
        </nav>

        <div className="container py-4" style={{ overflowX: 'auto', overflowY: 'auto', maxWidth: '100%' }}>
          <div className="card shadow-sm border-0 rounded-3 p-4 mx-auto" style={{ maxWidth: '750px' }}>
            
            {success && (
              <div className="alert alert-success d-flex align-items-center mb-4 border-0 shadow-sm" role="alert">
                <FaCheckCircle className="me-2 fs-5" />
                <div>{success}</div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger d-flex align-items-center mb-4 border-0 shadow-sm" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div>{error}</div>
              </div>
            )}

            <div className="mb-4 border-bottom pb-3">
              <h5 className="text-dark mb-1">Información de la Solicitud</h5>
              <span className="text-muted" style={{ fontSize: '13px' }}>Inicia un nuevo ticket de postventa para tu obra</span>
            </div>

            <form onSubmit={handleSubmit}>
              {isAdmin ? (
                <>
                  <div className="mb-4">
                    <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>CLIENTE</label>
                    <select
                      className="form-select"
                      value={idClienteSeleccionado}
                      onChange={handleClienteChange}
                    >
                      <option value="">Todos los clientes activos...</option>
                      {clientesActivos.map((cliente) => (
                        <option key={getClienteId(cliente)} value={getClienteId(cliente)}>
                          {cliente.nombreEmpresa || cliente.nombre_empresa}
                        </option>
                      ))}
                    </select>
                    <small className="text-muted" style={{ fontSize: '12px' }}>
                      Solo se muestran clientes y obras activos.
                    </small>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>OBRA ASOCIADA</label>
                    <select
                      className="form-select"
                      value={formData.idObra}
                      onChange={handleObraChange}
                      required
                    >
                      <option value="">
                        {idClienteSeleccionado ? 'Seleccione una obra del cliente...' : 'Seleccione una obra...'}
                      </option>
                      {obrasFiltradas.map((obra) => (
                        <option key={getObraId(obra)} value={getObraId(obra)}>
                          {obra.nombreObra || obra.nombre_obra}
                          {!idClienteSeleccionado && (obra.nombreEmpresa || obra.nombre_empresa)
                            ? ` — ${obra.nombreEmpresa || obra.nombre_empresa}`
                            : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div className="mb-4">
                  <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>CLIENTE</label>
                  <div className="p-3 bg-light rounded border mb-3">
                    <p className="mb-0 fw-bold">{nombreClienteReal || 'Cargando cliente...'}</p>
                  </div>

                  <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>OBRA ASOCIADA</label>
                  <div className="p-3 bg-light rounded border">
                    <p className="mb-0 fw-bold">{nombreObraReal || 'Cargando obra...'}</p>
                    <small className="text-muted" style={{ fontSize: '12px' }}>ID Obra: {idObraActual || 'N/A'}</small>
                  </div>
                </div>
              )}

              {isAdmin && (
                <div className="mb-4">
                  <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>ASIGNAR A USUARIO</label>
                  <select 
                    className="form-select"
                    value={formData.idUsuario}
                    onChange={(e) => setFormData({...formData, idUsuario: e.target.value})}
                    required
                    disabled={!formData.idObra}
                  >
                    <option value="">{formData.idObra ? 'Seleccione un usuario...' : 'Primero seleccione una obra...'}</option>
                    {usuariosObra.map(user => (
                      <option key={user.idUsuario || user.id_usuario} value={user.idUsuario || user.id_usuario}>
                        {user.nombre} {user.apellidoPaterno || user.apellido_paterno} ({user.correo})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="alert alert-info border-0 shadow-none py-3 mb-4" style={{ backgroundColor: '#e7f3ff', color: '#004085', fontSize: '13px' }}>
                <div className="d-flex">
                  <i className="bi bi-info-circle-fill me-2 fs-5"></i>
                  <div>
                    Primero registraremos el ticket principal. En el siguiente paso podrás detallar los problemas específicos y subir fotografías.
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 border-top pt-3">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary px-4" 
                  onClick={handleVolver} 
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn px-4 text-white fw-bold"
                  style={{ backgroundColor: '#0B3B60' }}
                  disabled={loading || (!isAdmin && !puedeCrear)}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Procesando...
                    </>
                  ) : (
                    'Crear ticket y continuar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
