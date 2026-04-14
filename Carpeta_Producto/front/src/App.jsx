import { useEffect, useMemo, useState } from 'react'
import './App.css'

const badgeByEstado = {
  Nuevo: 'secondary',
  'En proceso': 'warning',
  'No aplica': 'dark',
  Terminado: 'success',
}

function formatDate(value) {
  if (!value) return 'Sin fecha'
  return new Date(value).toLocaleString('es-CL')
}

function App() {
  const [obraId, setObraId] = useState('1')
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const totalObservaciones = useMemo(
    () => tickets.reduce((acc, ticket) => acc + ticket.observaciones.length, 0),
    [tickets]
  )

  const cargarTickets = async (idObra) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/tickets/detalle/obra/${idObra}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'No se pudieron cargar los tickets')
      }

      const normalized = data.data.map((ticket) => ({
        ...ticket,
        observaciones: ticket.observaciones || [],
      }))

      setTickets(normalized)
    } catch (err) {
      setTickets([])
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarTickets(obraId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    cargarTickets(obraId)
  }

  return (
    <div className="app-bg min-vh-100 py-4">
      <div className="container">
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-4">
            <h1 className="h3 mb-1">Panel de Tickets</h1>
            <p className="text-secondary mb-4">
              Vista simple de tickets, observaciones y evidencias por obra.
            </p>

            <form className="row g-3 align-items-end" onSubmit={handleSubmit}>
              <div className="col-12 col-md-4">
                <label className="form-label" htmlFor="obraId">
                  ID de obra
                </label>
                <input
                  id="obraId"
                  type="number"
                  min="1"
                  className="form-control"
                  value={obraId}
                  onChange={(event) => setObraId(event.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-md-auto">
                <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                  {loading ? 'Cargando...' : 'Buscar tickets'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <p className="text-uppercase text-secondary small mb-1">Tickets encontrados</p>
                <p className="display-6 mb-0 fw-semibold">{tickets.length}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <p className="text-uppercase text-secondary small mb-1">Observaciones totales</p>
                <p className="display-6 mb-0 fw-semibold">{totalObservaciones}</p>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && tickets.length === 0 && !error && (
          <div className="alert alert-light border">No hay tickets para esta obra.</div>
        )}

        <div className="d-grid gap-3">
          {tickets.map((ticket) => (
            <article className="card border-0 shadow-sm" key={ticket.id_ticket}>
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                  <div>
                    <h2 className="h5 mb-1">Ticket #{ticket.id_ticket}</h2>
                    <p className="mb-0 text-secondary">
                      Obra: <strong>{ticket.nombre_obra}</strong> (ID {ticket.id_obra})
                    </p>
                  </div>
                  <span className="badge text-bg-primary align-self-start">{ticket.estado_general}</span>
                </div>
                <p className="text-secondary small mt-2 mb-0">
                  Creado: {formatDate(ticket.fecha_creacion)}
                </p>
                <p className="text-secondary small mb-0">
                  Usuario: {ticket.nombre_usuario} ({ticket.correo})
                </p>
              </div>

              <div className="card-body px-4 pb-4">
                {ticket.observaciones.length === 0 ? (
                  <div className="alert alert-warning mb-0">Este ticket no tiene observaciones.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Observación</th>
                          <th>Categoría</th>
                          <th>Estado</th>
                          <th>Evidencias</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ticket.observaciones.map((obs) => (
                          <tr key={obs.id_observacion}>
                            <td>
                              <p className="fw-semibold mb-1">#{obs.id_observacion} - {obs.ubicacion_exacta}</p>
                              <p className="mb-1 text-secondary">{obs.descripcion_problema}</p>
                              <p className="mb-0 small text-secondary">Registrada: {formatDate(obs.fecha_registro)}</p>
                            </td>
                            <td>{obs.categoria?.nombre_categoria || 'Sin categoría'}</td>
                            <td>
                              <span className={`badge text-bg-${badgeByEstado[obs.estado_observacion] || 'info'}`}>
                                {obs.estado_observacion}
                              </span>
                            </td>
                            <td>
                              {obs.evidencias.length === 0 ? (
                                <span className="text-secondary">Sin archivos</span>
                              ) : (
                                <ul className="list-unstyled mb-0">
                                  {obs.evidencias.map((evidencia) => (
                                    <li key={evidencia.id_evidencia}>
                                      <a href={evidencia.url_archivo} target="_blank" rel="noreferrer">
                                        Evidencia #{evidencia.id_evidencia}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
