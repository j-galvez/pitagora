import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';
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

const DetalleCorreosGrupo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {};
  const isAdmin = usuarioLogueado.rol === 'admin';

  const params = new URLSearchParams(location.search);
  const asuntoNormalizado = location.state?.asuntoNormalizado || params.get('asunto');
  const correo = location.state?.correo || params.get('correo');

  const [correos, setCorreos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (asuntoNormalizado && correo) {
      cargarDetalle();
    } else {
      setLoading(false);
      setError('No se especificó el grupo de correos.');
    }
  }, [asuntoNormalizado, correo]);

  const cargarDetalle = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await correosEntrantesService.getDetalleGrupo(asuntoNormalizado, correo);
      setCorreos(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al cargar el detalle');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => navigate('/mensajes');

  const primerCorreo = correos[0] || {};
  const idTicket = primerCorreo.idTicket || primerCorreo.id_ticket;
  const nombreObra = primerCorreo.nombreObra || primerCorreo.nombre_obra;

  const contenido = (
    <div className="container py-4">
      <div className="card shadow-sm border-0 rounded-3 p-4 mb-4">
        <h5 className="mb-3">Grupo de correos</h5>
        <div className="row g-2">
          <div className="col-md-4">
            <small className="text-muted d-block">Ticket</small>
            <strong>{idTicket ? `Ticket N° ${idTicket}` : '-'}</strong>
          </div>
          <div className="col-md-4">
            <small className="text-muted d-block">Obra</small>
            <strong>{nombreObra || '-'}</strong>
          </div>
          <div className="col-md-4">
            <small className="text-muted d-block">Correo remitente</small>
            <strong>{correo || '-'}</strong>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : correos.length === 0 && !error ? (
        <div className="text-center py-5 text-muted">
          <FaEnvelope size={32} className="mb-2" />
          <p className="mb-0">No hay correos en este grupo.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {correos.map((c) => {
            const id = c.idMensaje || c.id_mensaje;
            const asunto = c.asunto;
            const mensaje = c.mensaje;
            const fecha = c.fechaEnvio || c.fecha_envio;
            const nombre = c.nombreRemitente || c.nombre_remitente;

            return (
              <div key={id} className="card shadow-sm border-0 rounded-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong className="d-block">{nombre || correo}</strong>
                      <small className="text-muted">{correo}</small>
                    </div>
                    <small className="text-muted">{formatFecha(fecha)}</small>
                  </div>
                  {asunto && (
                    <p className="mb-2 small">
                      <strong>Asunto:</strong> <em>{asunto}</em>
                    </p>
                  )}
                  <div
                    className="p-3 rounded bg-light"
                    style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}
                  >
                    {mensaje || <span className="text-muted">(Sin contenido)</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (isAdmin) {
    return (
      <AdminLayout usuario={usuarioLogueado} titulo="Detalle de correos" handleVolver={handleVolver}>
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
            <h4 className="text-white mb-0">Detalle de correos</h4>
          </div>
        </nav>
        {contenido}
      </div>
    </div>
  );
};

export default DetalleCorreosGrupo;
