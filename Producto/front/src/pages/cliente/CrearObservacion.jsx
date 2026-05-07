import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import NavbarUsuario from '../../components/NavbarUsuario';
import NavbarAdmin from '../../components/NavbarAdmin';
import Footer from '../../components/Footer';

export default function CrearObservacion() {
  const { id_ticket: urlTicketId } = useParams();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(urlTicketId || '');
  const [observaciones, setObservaciones] = useState([]);
  const [isAddingObservation, setIsAddingObservation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const usuarioLocalStorage = JSON.parse(localStorage.getItem('usuario'));
  const usuarioLogueado = usuarioLocalStorage || {
    id_usuario: 1,
    nombre: 'Usuario de Prueba',
    rol: 'cliente',
    id_obra: 1
  };

  const isAdmin = usuarioLogueado.rol === 'admin';

  // Estado para nueva observación
  const [newObservation, setNewObservation] = useState({
    falla: '',
    ubicacion_exacta: '',
    descripcion_problema: '',
    urgencia: 'media',
    id_categoria: '1',
    fotos: []
  });

  useEffect(() => {
    cargarTicketsDisponibles();
  }, []);

  const cargarTicketsDisponibles = async () => {
    setLoadingTickets(true);
    try {
      const endpoint = isAdmin 
        ? 'http://localhost:8080/api/tickets?estado=abierto' 
        : `http://localhost:8080/api/tickets/usuario/${usuarioLogueado.id_usuario}?estado=abierto`;
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setTickets(data || []);
      } else {
        throw new Error('Error al cargar tickets');
      }
    } catch (err) {
      console.error('Error al cargar tickets:', err);
      // Fallback para desarrollo
      setTickets([
        { id_ticket: 1, id_obra: 1, fecha_creacion: new Date() },
        { id_ticket: 2, id_obra: 1, fecha_creacion: new Date() }
      ]);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleSaveObservation = () => {
    if (!newObservation.falla || !newObservation.ubicacion_exacta || !newObservation.descripcion_problema) {
      setError('Por favor completa todos los campos obligatorios de la observación');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setObservaciones([...observaciones, { ...newObservation, id: Date.now() }]);
    setIsAddingObservation(false);
    setNewObservation({
      falla: '',
      ubicacion_exacta: '',
      descripcion_problema: '',
      urgencia: 'media',
      id_categoria: '1',
      fotos: []
    });
    setError('');
  };

  const handleRemoveObservation = (id) => {
    setObservaciones(observaciones.filter(obs => obs.id !== id));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (newObservation.fotos.length + files.length > 4) {
      setError('Máximo 4 fotos por observación');
      return;
    }
    setNewObservation({
      ...newObservation,
      fotos: [...newObservation.fotos, ...files]
    });
  };

  const handleRemovePhoto = (index) => {
    const newFotos = [...newObservation.fotos];
    newFotos.splice(index, 1);
    setNewObservation({ ...newObservation, fotos: newFotos });
  };

  const handleSubmitAll = async (e) => {
    e.preventDefault();
    if (!selectedTicketId) {
      setError('Debes seleccionar un ticket');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (observaciones.length === 0) {
      setError('Debes agregar al menos una observación');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      for (const obs of observaciones) {
        await fetch('http://localhost:8080/api/observaciones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_ticket: selectedTicketId,
            id_categoria: parseInt(obs.id_categoria),
            falla: obs.falla,
            ubicacion_exacta: obs.ubicacion_exacta,
            descripcion_problema: obs.descripcion_problema,
            urgencia: obs.urgencia,
            estado_observacion: 'pendiente'
          })
        });
      }

      setSuccess('¡Observaciones guardadas correctamente!');
      setTimeout(() => {
        navigate(isAdmin ? '/admin-dashboard' : '/dashboard');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Error al guardar. Usando modo simulación.');
      setTimeout(() => navigate(isAdmin ? '/admin-dashboard' : '/dashboard'), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      {isAdmin ? <NavbarAdmin usuario={usuarioLogueado} /> : <NavbarUsuario usuario={usuarioLogueado} />}

      <div className="flex-grow-1" style={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
        
        {/* Barra de Navegación Superior - Estandarizada */}
        <nav className="navbar navbar-dark" style={{ backgroundColor: '#002840' }}>
          <div className="container-fluid d-flex justify-content-between align-items-center py-2">
            <div className="d-flex align-items-center">
              <button className="btn btn-link text-white me-3 text-decoration-none d-flex align-items-center" onClick={() => navigate(-1)}>
                <FaArrowLeft className="me-1" /> Volver
              </button>
              <h4 className="text-white mb-0">Crear Observación</h4>
            </div>
          </div>
        </nav>

        <main className="p-4">
          <div className="container py-4" style={{ maxWidth: '800px' }}>
            <div className="mb-4">
              <h1 className="h3 mb-1" style={{ color: '#003860', fontWeight: 'bold' }}>Detalles de la Solicitud</h1>
              <p className="text-secondary mb-0">Agrega las fallas específicas al ticket seleccionado.</p>
            </div>

            {success && (
              <div className="alert alert-success d-flex align-items-center mb-4 border-0 shadow-sm" role="alert">
                <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                <div>{success}</div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger d-flex align-items-center mb-4 border-0 shadow-sm" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div>{error}</div>
              </div>
            )}

            {/* Selector de Ticket */}
            <div className="card shadow-sm border-0 rounded-3 p-4 mb-4">
              <h5 className="mb-3">1. Seleccionar Ticket</h5>
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>TICKET ABIERTO</label>
              <select 
                className="form-select"
                value={selectedTicketId}
                onChange={(e) => setSelectedTicketId(e.target.value)}
                disabled={loadingTickets}
              >
                <option value="">-- Selecciona un Ticket --</option>
                {tickets.map(t => (
                  <option key={t.id_ticket} value={t.id_ticket}>
                    Ticket #{t.id_ticket} - (Creado: {new Date(t.fecha_creacion).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Listado de Observaciones */}
            <div className="card shadow-sm border-0 rounded-3 p-4 mb-4">
              <h5 className="mb-4">2. Observaciones ({observaciones.length})</h5>

              {observaciones.length > 0 && (
                <div className="row g-3 mb-4">
                  {observaciones.map((obs, index) => (
                    <div className="col-12" key={obs.id}>
                      <div className="card border-light shadow-none bg-light border-start border-4 border-primary">
                        <div className="card-body d-flex justify-content-between align-items-center py-2">
                          <div>
                            <span className="fw-bold text-primary">#{index + 1}</span>
                            <span className="ms-2 fw-semibold">{obs.falla}</span>
                            <span className="ms-2 text-muted small">| {obs.ubicacion_exacta}</span>
                          </div>
                          <button type="button" className="btn btn-link text-danger p-0" onClick={() => handleRemoveObservation(obs.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isAddingObservation ? (
                <div className="p-4 border rounded-3 bg-light mb-3">
                  <h6 className="fw-bold mb-3" style={{ color: '#003860' }}>Nueva Observación</h6>
                  
                  <div className="mb-3">
                    <label className="form-label text-secondary fw-semibold" style={{ fontSize: '12px' }}>FALLA</label>
                    <input type="text" className="form-control" placeholder="Ej: Filtración" value={newObservation.falla} onChange={(e) => setNewObservation({...newObservation, falla: e.target.value})} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-secondary fw-semibold" style={{ fontSize: '12px' }}>UBICACIÓN</label>
                    <input type="text" className="form-control" placeholder="Ej: Baño principal" value={newObservation.ubicacion_exacta} onChange={(e) => setNewObservation({...newObservation, ubicacion_exacta: e.target.value})} />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label text-secondary fw-semibold" style={{ fontSize: '12px' }}>CATEGORÍA</label>
                      <select className="form-select" value={newObservation.id_categoria} onChange={(e) => setNewObservation({...newObservation, id_categoria: e.target.value})}>
                        <option value="1">Instalaciones Sanitarias</option>
                        <option value="4">Instalaciones Eléctricas</option>
                        <option value="7">Terminaciones</option>
                        <option value="10">Estructuras</option>
                        <option value="13">Sistemas Especiales</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-secondary fw-semibold" style={{ fontSize: '12px' }}>URGENCIA</label>
                      <select className="form-select" value={newObservation.urgencia} onChange={(e) => setNewObservation({...newObservation, urgencia: e.target.value})}>
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-secondary fw-semibold" style={{ fontSize: '12px' }}>DESCRIPCIÓN</label>
                    <textarea className="form-control" rows="2" value={newObservation.descripcion_problema} onChange={(e) => setNewObservation({...newObservation, descripcion_problema: e.target.value})}></textarea>
                  </div>

                  <div className="d-flex gap-2 justify-content-end">
                    <button type="button" className="btn btn-outline-secondary btn-sm px-3" onClick={() => setIsAddingObservation(false)}>Cancelar</button>
                    <button type="button" className="btn btn-primary btn-sm px-4" onClick={handleSaveObservation}>Agregar</button>
                  </div>
                </div>
              ) : (
                <button 
                  type="button" 
                  className="btn btn-outline-primary w-100 border-dashed py-3 fw-bold" 
                  onClick={() => setIsAddingObservation(true)}
                  disabled={!selectedTicketId}
                >
                  <i className="bi bi-plus-circle me-2"></i> Agregar observación
                </button>
              )}
            </div>

            <div className="d-flex justify-content-end gap-2 border-top pt-4">
              <button className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>Cancelar</button>
              <button 
                className="btn btn-success px-5 fw-bold"
                onClick={handleSubmitAll}
                disabled={observaciones.length === 0 || loading || !selectedTicketId}
              >
                {loading ? 'Guardando...' : 'Guardar observaciones'}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .border-dashed { border-style: dashed !important; }
        .object-fit-cover { object-fit: cover; }
      `}} />
    </div>
  );
}