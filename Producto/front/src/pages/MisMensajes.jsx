import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import NavbarUsuario from '../components/NavbarUsuario';
import { correosEntrantesService } from '../services/correosEntrantesService';

const formatFecha = (fecha) => {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const MisMensajes = () => {
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {};
  const isAdmin = usuarioLogueado.rol === 'admin';

  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    cargarGrupos();
  }, []);

  const cargarGrupos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await correosEntrantesService.getGrupos();
      setGrupos(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al cargar los correos entrantes');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate(isAdmin ? '/admin-dashboard' : '/dashboard');
  };

  const handleClickGrupo = (grupo) => {
    const asunto = grupo.asuntoNormalizado || grupo.asunto_normalizado;
    const correo = grupo.correoRemitente || grupo.correo_remitente;
    navigate('/mensajes/detalle', {
      state: { asuntoNormalizado: asunto, correo },
    });
  };

  const gruposFiltrados = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return grupos;
    return grupos.filter((g) => {
      const ticket = String(g.idTicket || g.id_ticket || '');
      const obra = (g.nombreObra || g.nombre_obra || '').toLowerCase();
      const correo = (g.correoRemitente || g.correo_remitente || '').toLowerCase();
      return ticket.includes(term) || obra.includes(term) || correo.includes(term);
    });
  }, [grupos, searchTerm]);

  const contenido = (
    <div className="container py-4">
      <div className="card shadow-sm border-0 rounded-3 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 d-flex align-items-center gap-2">
            <FaEnvelope className="text-primary" />
            Correos Entrantes
          </h5>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light text-muted"><FaSearch /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por ticket, obra o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2 text-muted">Cargando correos...</p>
          </div>
        ) : gruposFiltrados.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FaEnvelope size={32} className="mb-2" />
            <p className="mb-0">No hay correos entrantes registrados.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Ticket</th>
                  <th>Obra</th>
                  <th>Correo</th>
                  <th className="text-center">Cantidad de correos</th>
                  <th>Último recibido</th>
                </tr>
              </thead>
              <tbody>
                {gruposFiltrados.map((grupo, index) => {
                  const idTicket = grupo.idTicket || grupo.id_ticket;
                  const nombreObra = grupo.nombreObra || grupo.nombre_obra;
                  const correo = grupo.correoRemitente || grupo.correo_remitente;
                  const cantidad = grupo.cantidadCorreos || grupo.cantidad_correos || 0;
                  const fecha = grupo.fechaUltimo || grupo.fecha_ultimo;
                  const asunto = grupo.asuntoNormalizado || grupo.asunto_normalizado;

                  return (
                    <tr
                      key={`${asunto}-${correo}-${index}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleClickGrupo(grupo)}
                    >
                      <td>
                        <strong>Ticket N° {idTicket}</strong>
                      </td>
                      <td>{nombreObra}</td>
                      <td>{correo}</td>
                      <td className="text-center">
                        <span className="badge bg-primary rounded-pill">{cantidad}</span>
                      </td>
                      <td className="text-muted small">{formatFecha(fecha)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  if (isAdmin) {
    return (
      <AdminLayout usuario={usuarioLogueado} titulo="Mis Mensajes" handleVolver={handleVolver}>
        {contenido}
      </AdminLayout>
    );
  }

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <NavbarUsuario usuario={usuarioLogueado} />
      <div className="flex-grow-1 d-flex flex-column" style={{ backgroundColor: '#F8F9FA', height: '100vh', overflowY: 'auto' }}>
        <nav className="navbar navbar-dark" style={{ backgroundColor: '#002840' }}>
          <div className="container-fluid d-flex align-items-center py-2">
            <button className="btn btn-link text-white me-3 text-decoration-none d-flex align-items-center" onClick={handleVolver}>
              <FaArrowLeft className="me-1" /> Volver
            </button>
            <h4 className="text-white mb-0">Mis Mensajes</h4>
          </div>
        </nav>
        {contenido}
      </div>
    </div>
  );
};

export default MisMensajes;
