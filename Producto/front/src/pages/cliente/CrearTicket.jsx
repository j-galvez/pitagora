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
  
  // Recuperar usuario y asegurar que id_obra esté presente
  const usuarioLocalStorage = JSON.parse(localStorage.getItem('usuario'));
  const usuarioLogueado = usuarioLocalStorage || {
    id_usuario: 1,
    nombre: 'Usuario de Prueba',
    rol: 'cliente',
    obraActual: 'Edificio Los Almendros - Depto 305',
    id_obra: 1
  };

  const isAdmin = usuarioLogueado.rol === 'admin';

  const [formData, setFormData] = useState({
    id_obra: isAdmin ? '' : (usuarioLogueado.id_obra || 1),
    id_usuario_creador: usuarioLogueado.id_usuario,
    estado_general: 'abierto'
  });

  useEffect(() => {
    if (isAdmin) {
      cargarObras();
    }
  }, [isAdmin]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_obra) {
      setError('Por favor selecciona una obra');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8080/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al crear el ticket');
      const ticketData = await response.json();

      setSuccess('¡Ticket creado exitosamente! Redirigiendo a observaciones...');
      setTimeout(() => {
        navigate(`/crear-observacion/${ticketData.id_ticket || ticketData.id || 1}`);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor. Usando modo demostración.');
      setTimeout(() => navigate('/crear-observacion/1'), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate(isAdmin ? '/admin-dashboard' : '/dashboard');
  };

  return (
    <div className="d-flex">
      {isAdmin ? <NavbarAdmin usuario={usuarioLogueado} /> : <NavbarUsuario usuario={usuarioLogueado} />}

      <div className="flex-grow-1" style={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
        
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
                    value={formData.id_obra}
                    onChange={(e) => setFormData({...formData, id_obra: e.target.value})}
                    required
                  >
                    <option value="">Seleccione una obra...</option>
                    {obras.map(obra => (
                      <option key={obra.id_obra} value={obra.id_obra}>
                        {obra.nombre_obra}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-light rounded border">
                    <p className="mb-0 fw-bold">{usuarioLogueado.obraActual || 'Edificio Los Almendros - Depto 305'}</p>
                    <small className="text-muted" style={{ fontSize: '12px' }}>ID Obra: {usuarioLogueado.id_obra || 1}</small>
                  </div>
                )}
              </div>

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