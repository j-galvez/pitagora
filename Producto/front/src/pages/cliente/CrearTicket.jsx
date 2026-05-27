import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import NavbarUsuario from '../../components/NavbarUsuario';
import NavbarAdmin from '../../components/NavbarAdmin';
import Footer from '../../components/Footer';

export default function CrearTicket() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [obras, setObras] = useState([]);
  const [usuariosObra, setUsuariosObra] = useState([]);
  
  // Recuperar usuario
  const usuarioLocalStorage = JSON.parse(localStorage.getItem('usuario'));
  const usuarioLogueado = usuarioLocalStorage || {};

  const isAdmin = usuarioLogueado.rol === 'admin';
  const idUsuarioActual = usuarioLogueado.idUsuario || usuarioLogueado.id_usuario;
  const idObraActual = usuarioLogueado.idObra || usuarioLogueado.id_obra;

  // Estado para el nombre de la obra (lo buscamos si no viene en el login)
  const [nombreObraReal, setNombreObraReal] = useState(usuarioLogueado.nombre_obra || usuarioLogueado.nombreObra || '');

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
      cargarObras();
    } else if (idObraActual && !nombreObraReal) {
      // Si no tenemos el nombre de la obra pero sí el ID, buscarlo en el servidor
      fetch(`http://localhost:8080/api/obras/${idObraActual}`)
        .then(res => {
          if (!res.ok) throw new Error('Error al cargar obra');
          return res.json();
        })
        .then(data => setNombreObraReal(data.nombreObra || data.nombre_obra))
        .catch(err => {
          console.error("Error al obtener nombre de obra:", err);
          setNombreObraReal(`Obra ID: ${idObraActual}`);
        });
    }
  }, [isAdmin, idObraActual, nombreObraReal]);

  useEffect(() => {
    if (isAdmin && formData.idObra) {
      cargarUsuariosPorObra(formData.idObra);
    }
  }, [isAdmin, formData.idObra]);

  const cargarObras = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/obras');
      if (response.ok) {
        const data = await response.json();
        setObras(data || []);
      } else {
        throw new Error('Error al cargar obras');
      }
    } catch (err) {
      console.error('Error al cargar obras:', err);
      setObras([
        { id_obra: 1, nombre_obra: 'Edificio Los Almendros' },
        { id_obra: 2, nombre_obra: 'Condominio El Roble' }
      ]);
    }
  };

  const cargarUsuariosPorObra = async (idObra) => {
    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/obra/${idObra}`);
      if (response.ok) {
        const data = await response.json();
        setUsuariosObra(data || []);
      } else {
        throw new Error('Error al cargar usuarios de la obra');
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setUsuariosObra([
        { id_usuario: 6, nombre: 'Roberto Silva', apellido_paterno: 'Silva' },
        { id_usuario: 7, nombre: 'Patricia Jiménez', apellido_paterno: 'Jiménez' }
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
              <span className="text-muted" style={{ fontSize: '13px' }}>Inicia una nueva solicitud de postventa para tu obra</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>OBRA ASOCIADA</label>
                {isAdmin ? (
                  <select 
                    className="form-select"
                    value={formData.idObra}
                    onChange={(e) => setFormData({...formData, idObra: e.target.value, idUsuario: ''})}
                    required
                  >
                    <option value="">Seleccione una obra...</option>
                    {obras.map(obra => (
                      <option key={obra.idObra || obra.id_obra} value={obra.idObra || obra.id_obra}>
                        {obra.nombreObra || obra.nombre_obra}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-light rounded border">
                    <p className="mb-0 fw-bold">{nombreObraReal || 'Cargando obra...'}</p>
                    <small className="text-muted" style={{ fontSize: '12px' }}>ID Obra: {idObraActual || 'N/A'}</small>
                  </div>
                )}
              </div>

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
                  disabled={loading}
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
