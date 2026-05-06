import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarUsuario from '../../components/NavbarUsuario';
import Footer from '../../components/Footer';

export default function CrearTicket() {
  const navigate = useNavigate();
  const [observaciones, setObservaciones] = useState([]);
  const [isAddingObservation, setIsAddingObservation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estado para nueva observación
  const [newObservation, setNewObservation] = useState({
    falla: '',
    ubicacion_exacta: '',
    descripcion_problema: '',
    urgencia: 'media',
    id_categoria: '1', // Hardcoded for now
    fotos: []
  });

  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    id_usuario: 1,
    nombre: 'Juan Pérez',
    obraActual: 'Edificio Los Almendros - Depto 305',
    id_obra: 1
  };

  const handleAddObservation = () => {
    setIsAddingObservation(true);
  };

  const handleSaveObservation = () => {
    if (!newObservation.falla || !newObservation.ubicacion_exacta || !newObservation.descripcion_problema) {
      alert('Por favor completa todos los campos obligatorios de la observación');
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
  };

  const handleRemoveObservation = (id) => {
    setObservaciones(observaciones.filter(obs => obs.id !== id));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (newObservation.fotos.length + files.length > 4) {
      alert('Máximo 4 fotos por observación');
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

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (observaciones.length === 0) {
      alert('Debes agregar al menos una observación');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Crear el ticket
      const ticketResponse = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_obra: usuarioLogueado.id_obra,
          id_usuario_creador: usuarioLogueado.id_usuario,
          estado_general: 'abierto'
        })
      });

      if (!ticketResponse.ok) throw new Error('Error al crear el ticket');
      const ticketData = await ticketResponse.json();

      // 2. Crear las observaciones
      for (const obs of observaciones) {
        const obsResponse = await fetch('/api/observaciones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_ticket: ticketData.id_ticket,
            id_categoria: parseInt(obs.id_categoria),
            falla: obs.falla,
            ubicacion_exacta: obs.ubicacion_exacta,
            descripcion_problema: obs.descripcion_problema,
            urgencia: obs.urgencia,
            estado_observacion: 'pendiente'
          })
        });

        if (!obsResponse.ok) throw new Error('Error al crear una observación');
        // const obsData = await obsResponse.json();

        // 3. Subir evidencias (esto requeriría un endpoint que acepte FormData)
        // Por ahora omitimos la subida real de archivos hasta tener el endpoint listo
      }

      alert('Ticket creado exitosamente');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Hubo un problema al crear el ticket. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      <NavbarUsuario usuario={usuarioLogueado} />

      <div className="d-flex flex-column flex-grow-1">
        <nav className="navbar navbar-dark" style={{ backgroundColor: '#002840' }}>
          <div className="container-fluid">
            <button className="btn btn-outline-light me-3" onClick={() => navigate('/dashboard')}>
              <i className="bi bi-arrow-left"></i> Volver
            </button>
            <span className="navbar-brand mb-0 h1">Crear Nuevo Ticket</span>
          </div>
        </nav>

        <main className="p-4 flex-grow-1">
          <div className="container" style={{ maxWidth: '800px' }}>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmitTicket}>
              {/* Información de la Obra */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3" style={{ color: '#003860' }}>Información de la Obra</h5>
                  <div className="p-3 bg-light rounded border">
                    <p className="mb-0 text-secondary" style={{ fontSize: '0.9rem' }}>Obra Asociada</p>
                    <p className="mb-0 fw-bold">{usuarioLogueado.obraActual}</p>
                  </div>
                </div>
              </div>

              {/* Observaciones Agregadas */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0" style={{ color: '#003860' }}>
                    Observaciones Agregadas ({observaciones.length})
                  </h5>
                </div>

                {observaciones.length > 0 ? (
                  <div className="row g-3">
                    {observaciones.map((obs, index) => (
                      <div className="col-12" key={obs.id}>
                        <div className="card border-0 shadow-sm">
                          <div className="card-body d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="fw-bold mb-1">Observación #{index + 1}: {obs.falla}</h6>
                              <p className="mb-1 text-secondary small">
                                <i className="bi bi-geo-alt"></i> {obs.ubicacion_exacta} | 
                                <i className="bi bi-tag ms-2"></i> Categoría {obs.id_categoria} | 
                                <i className="bi bi-exclamation-circle ms-2"></i> Urgencia: {obs.urgencia}
                              </p>
                              <p className="mb-0 small text-truncate" style={{ maxWidth: '500px' }}>{obs.descripcion_problema}</p>
                            </div>
                            <button 
                              type="button" 
                              className="btn btn-outline-danger btn-sm" 
                              onClick={() => handleRemoveObservation(obs.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-light border text-center py-4">
                    <p className="mb-0 text-secondary">Aún no has agregado observaciones a este ticket.</p>
                  </div>
                )}
              </div>

              {/* Formulario Nueva Observación */}
              {isAddingObservation ? (
                <div className="card shadow-sm border-primary mb-4" style={{ borderWidth: '2px' }}>
                  <div className="card-header bg-white border-0 pt-4">
                    <h5 className="card-title fw-bold mb-0" style={{ color: '#003860' }}>Nueva Observación</h5>
                    <p className="text-secondary small mb-0">Completa los detalles del problema encontrado.</p>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">¿Qué falla encontraste?</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ej: Grieta en muro, Filtración en llave..."
                        value={newObservation.falla}
                        onChange={(e) => setNewObservation({...newObservation, falla: e.target.value})}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">¿En qué lugar exacto?</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ej: Dormitorio principal, Baño suite..."
                        value={newObservation.ubicacion_exacta}
                        onChange={(e) => setNewObservation({...newObservation, ubicacion_exacta: e.target.value})}
                        required
                      />
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Categoría</label>
                        <select 
                          className="form-select"
                          value={newObservation.id_categoria}
                          onChange={(e) => setNewObservation({...newObservation, id_categoria: e.target.value})}
                        >
                          <option value="1">Instalaciones Sanitarias</option>
                          <option value="4">Instalaciones Eléctricas</option>
                          <option value="7">Terminaciones (Cerámica, Pintura, etc.)</option>
                          <option value="10">Estructuras (Muros, Pisos, etc.)</option>
                          <option value="13">Sistemas Especiales (Climatización, etc.)</option>
                          <option value="8">Otro</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Urgencia</label>
                        <select 
                          className="form-select"
                          value={newObservation.urgencia}
                          onChange={(e) => setNewObservation({...newObservation, urgencia: e.target.value})}
                        >
                          <option value="baja">Baja</option>
                          <option value="media">Media</option>
                          <option value="alta">Alta</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Descripción Detallada</label>
                      <textarea 
                        className="form-control" 
                        rows="3" 
                        placeholder="Describe el problema con el mayor detalle posible..."
                        value={newObservation.descripcion_problema}
                        onChange={(e) => setNewObservation({...newObservation, descripcion_problema: e.target.value})}
                        required
                      ></textarea>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Evidencia Fotográfica (máx 4)</label>
                      <div className="row g-2">
                        {newObservation.fotos.map((foto, index) => (
                          <div key={index} className="col-3">
                            <div className="position-relative aspect-ratio-box bg-light rounded border overflow-hidden" style={{ height: '80px' }}>
                              <img 
                                src={URL.createObjectURL(foto)} 
                                alt="preview" 
                                className="w-100 h-100 object-fit-cover"
                              />
                              <button 
                                type="button" 
                                className="btn btn-danger btn-sm position-absolute top-0 end-0 p-1 m-1"
                                onClick={() => handleRemovePhoto(index)}
                                style={{ lineHeight: 1 }}
                              >
                                <i className="bi bi-x"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                        {newObservation.fotos.length < 4 && (
                          <div className="col-3">
                            <label className="d-flex flex-column align-items-center justify-content-center border border-dashed rounded bg-light cursor-pointer h-100" style={{ height: '80px', minHeight: '80px' }}>
                              <i className="bi bi-camera text-secondary fs-4"></i>
                              <span className="small text-secondary">Agregar</span>
                              <input type="file" className="d-none" accept="image/*" onChange={handlePhotoChange} multiple />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-primary flex-grow-1" onClick={handleSaveObservation}>
                        Guardar Observación
                      </button>
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setIsAddingObservation(false)}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  type="button" 
                  className="btn btn-outline-primary w-100 border-dashed py-3 mb-4" 
                  onClick={handleAddObservation}
                  style={{ borderStyle: 'dashed' }}
                >
                  <i className="bi bi-plus-circle me-2"></i> Agregar Observación
                </button>
              )}

              {/* Acciones Finales */}
              <div className="d-flex gap-3 mt-4 pt-3 border-top">
                <button 
                  type="submit" 
                  className="btn btn-primary flex-grow-1 py-2 fw-bold" 
                  disabled={observaciones.length === 0 || loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i> Crear Ticket de Postventa
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary px-4" 
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </main>

        <Footer />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .border-dashed {
          border-style: dashed !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .object-fit-cover {
          object-fit: cover;
        }
      `}} />
    </div>
  );
}