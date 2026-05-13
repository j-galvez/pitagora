import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaTrash, FaPlusCircle, FaCamera } from 'react-icons/fa';
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
  const usuarioLogueado = usuarioLocalStorage || {};
  const idUsuarioActual = usuarioLogueado.idUsuario || usuarioLogueado.id_usuario;

  const isAdmin = usuarioLogueado.rol === 'admin';

  // Helper para formatear fecha de forma segura
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Fecha no disponible';
    const fecha = new Date(fechaStr);
    return isNaN(fecha) ? 'Fecha inválida' : fecha.toLocaleDateString();
  };

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
    if (!idUsuarioActual && !isAdmin) return;
    
    setLoadingTickets(true);
    try {
      const endpoint = isAdmin 
        ? 'http://localhost:8080/api/tickets?estado=abierto' 
        : `http://localhost:8080/api/tickets/usuario/${idUsuarioActual}?estado=abierto`;
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setTickets(data || []);
      } else {
        throw new Error('Error al cargar tickets');
      }
    } catch (err) {
      console.error('Error al cargar tickets:', err);
      setTickets([]);
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
        // Adaptamos el envío al formato camelCase que espera el backend
        await fetch('http://localhost:8080/api/observaciones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idTicket: selectedTicketId,
            idCategoria: parseInt(obs.id_categoria),
            falla: obs.falla,
            ubicacionExacta: obs.ubicacion_exacta,
            descripcionProblema: obs.descripcion_problema,
            urgencia: obs.urgencia,
            estadoObservacion: 'pendiente'
          })
        });
      }

      setSuccess('¡Observaciones guardadas correctamente!');
      setTimeout(() => {
        navigate(isAdmin ? '/admin-dashboard' : '/dashboard');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Error al guardar las observaciones. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate(-1);
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
              <h4 className="text-white mb-0">Crear Observación</h4>
            </div>
          </div>
        </nav>

        <div className="container py-4" style={{ overflowX: 'auto', overflowY: 'auto', maxWidth: '100%' }}>
          <div className="card shadow-sm border-0 rounded-3 p-4 mx-auto" style={{ maxWidth: '800px' }}>
            
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
              <h5 className="text-dark mb-1">Detalles de la Solicitud</h5>
              <span className="text-muted" style={{ fontSize: '13px' }}>Agrega las fallas técnicas específicas al ticket seleccionado</span>
            </div>

            {/* Paso 1: Selección de Ticket */}
            <div className="mb-4">
              <label className="form-label text-secondary fw-semibold" style={{ fontSize: '13px' }}>TICKET ABIERTO</label>
              <select 
                className="form-select"
                value={selectedTicketId}
                onChange={(e) => setSelectedTicketId(e.target.value)}
                disabled={loadingTickets}
              >
                <option value="">-- Selecciona un Ticket --</option>
                {tickets.map(t => {
                  const tId = t.idTicket || t.id_ticket;
                  const tFecha = t.fechaCreacion || t.fecha_creacion;
                  return (
                    <option key={tId} value={tId}>
                      Ticket #{tId} - (Creado: {formatearFecha(tFecha)})
                    </option>
                  );
                })}
              </select>
              {tickets.length === 0 && !loadingTickets && (
                <div className="mt-2 text-danger small" style={{ fontSize: '12px' }}>
                  No tienes tickets abiertos. Primero crea uno nuevo.
                </div>
              )}
            </div>

            <hr className="my-4 text-muted" />

            {/* Paso 2: Observaciones */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3" style={{ color: '#003860' }}>Observaciones ({observaciones.length})</h6>

              {observaciones.length > 0 && (
                <div className="row g-3 mb-4">
                  {observaciones.map((obs, index) => (
                    <div className="col-12" key={obs.id}>
                      <div className="card border-light shadow-none bg-light border-start border-4 border-primary">
                        <div className="card-body d-flex justify-content-between align-items-center py-2">
                          <div>
                            <span className="fw-bold text-primary" style={{ fontSize: '13px' }}>#{index + 1}</span>
                            <span className="ms-2 fw-semibold" style={{ fontSize: '14px' }}>{obs.falla}</span>
                            <span className="ms-2 text-muted" style={{ fontSize: '12px' }}>| {obs.ubicacion_exacta}</span>
                          </div>
                          <button type="button" className="btn btn-link text-danger p-0" onClick={() => handleRemoveObservation(obs.id)}>
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isAddingObservation ? (
                <div className="p-4 border rounded-3 bg-light mb-3">
                  <h6 className="fw-bold mb-4" style={{ fontSize: '15px', color: '#333' }}>Nueva Observación</h6>
                  
                  <div className="mb-3">
                    <label className="form-label text-secondary fw-semibold" style={{ fontSize: '12px' }}>¿QUÉ FALLA ENCONTRASTE?</label>
                    <input type="text" className="form-control" placeholder="Ej: Filtración de agua" value={newObservation.falla} onChange={(e) => setNewObservation({...newObservation, falla: e.target.value})} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-secondary fw-semibold" style={{ fontSize: '12px' }}>UBICACIÓN EXACTA</label>
                    <input type="text" className="form-control" placeholder="Ej: Baño principal, bajo el lavamanos" value={newObservation.ubicacion_exacta} onChange={(e) => setNewObservation({...newObservation, ubicacion_exacta: e.target.value})} />
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
                    <label className="form-label text-secondary fw-semibold" style={{ fontSize: '12px' }}>DESCRIPCIÓN DETALLADA</label>
                    <textarea className="form-control" rows="2" placeholder="Explica brevemente el problema..." value={newObservation.descripcion_problema} onChange={(e) => setNewObservation({...newObservation, descripcion_problema: e.target.value})}></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-secondary fw-semibold d-block" style={{ fontSize: '12px' }}>EVIDENCIA FOTOGRÁFICA</label>
                    <div className="d-flex gap-2 flex-wrap">
                      {newObservation.fotos.map((f, i) => (
                        <div key={i} className="position-relative" style={{ width: '70px', height: '70px' }}>
                          <img src={URL.createObjectURL(f)} className="w-100 h-100 object-fit-cover rounded border" alt="preview" />
                          <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 d-flex align-items-center justify-content-center" style={{ width: '20px', height: '20px', borderRadius: '50%', marginTop: '-5px', marginRight: '-5px' }} onClick={() => handleRemovePhoto(i)}>×</button>
                        </div>
                      ))}
                      {newObservation.fotos.length < 4 && (
                        <label className="d-flex flex-column align-items-center justify-content-center border border-dashed rounded bg-white cursor-pointer hover-bg-light" style={{ width: '70px', height: '70px', transition: 'all 0.2s' }}>
                          <FaCamera className="text-secondary mb-1" />
                          <span style={{ fontSize: '10px' }} className="text-muted text-uppercase fw-bold">Subir</span>
                          <input type="file" className="d-none" accept="image/*" onChange={handlePhotoChange} multiple />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="d-flex gap-2 justify-content-end">
                    <button type="button" className="btn btn-outline-secondary btn-sm px-4" onClick={() => setIsAddingObservation(false)}>Cancelar</button>
                    <button type="button" className="btn btn-primary btn-sm px-4 fw-bold" onClick={handleSaveObservation}>Aceptar</button>
                  </div>
                </div>
              ) : (
                <button 
                  type="button" 
                  className="btn btn-outline-primary w-100 border-dashed py-3 fw-bold" 
                  style={{ borderStyle: 'dashed', borderRadius: '8px', fontSize: '14px' }}
                  onClick={() => setIsAddingObservation(true)}
                  disabled={!selectedTicketId}
                >
                  <FaPlusCircle className="me-2" /> Agregar Nueva Observación
                </button>
              )}
            </div>

            <div className="d-flex justify-content-end gap-2 border-top pt-4">
              <button className="btn btn-outline-secondary px-4" onClick={handleVolver}>Cancelar</button>
              <button 
                className="btn px-5 fw-bold text-white"
                style={{ backgroundColor: '#0B3B60' }}
                onClick={handleSubmitAll}
                disabled={observaciones.length === 0 || loading || !selectedTicketId}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  'Guardar todas las observaciones'
                )}
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .border-dashed { border-style: dashed !important; }
        .object-fit-cover { object-fit: cover; }
        .hover-bg-light:hover { background-color: #f8f9fa !important; border-color: #0d6efd !important; }
      `}} />
    </div>
  );
}
