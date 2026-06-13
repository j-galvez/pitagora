import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api';
const ACTIVE_TICKET_CACHE_PREFIX = 'pitagora_has_active_ticket_';

const getNombreObraDesdeUsuario = (usuario) =>
  usuario?.nombre_obra || usuario?.nombreObra || '';

const getIdObraDesdeUsuario = (usuario) =>
  usuario?.id_obra || usuario?.idObra || null;

const getIdUsuario = (usuario) => usuario?.idUsuario || usuario?.id_usuario || null;

const leerTicketActivoCache = (idUsuario) => {
  if (!idUsuario) return null;
  try {
    const cached = sessionStorage.getItem(`${ACTIVE_TICKET_CACHE_PREFIX}${idUsuario}`);
    if (cached === null) return null;
    return cached === 'true';
  } catch {
    return null;
  }
};

const guardarTicketActivoCache = (idUsuario, tieneTicketActivo) => {
  if (!idUsuario) return;
  try {
    sessionStorage.setItem(`${ACTIVE_TICKET_CACHE_PREFIX}${idUsuario}`, String(tieneTicketActivo));
  } catch {
    // ignore storage errors
  }
};

export default function NavbarUsuario({ usuario }) {
  const navigate = useNavigate();
  const location = useLocation();
  const idUsuario = getIdUsuario(usuario);
  const [nombreObra, setNombreObra] = useState(() => getNombreObraDesdeUsuario(usuario));
  const [hasActiveTicket, setHasActiveTicket] = useState(() => leerTicketActivoCache(idUsuario));

  useEffect(() => {
    const desdeSesion = getNombreObraDesdeUsuario(usuario);
    if (desdeSesion) {
      setNombreObra(desdeSesion);
      return;
    }

    const idObra = getIdObraDesdeUsuario(usuario);
    if (!idObra) {
      setNombreObra('');
      return;
    }

    fetch(`${API_URL}/obras/${idObra}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setNombreObra(data.nombreObra || data.nombre_obra || ''))
      .catch(() => setNombreObra(''));
  }, [usuario]);

  // Verificar si el usuario tiene un ticket activo (abierto o en proceso)
  useEffect(() => {
    const verificarTicketActivo = async () => {
      if (!idUsuario) return;

      try {
        const response = await fetch(`${API_URL}/tickets/usuario/${idUsuario}`);
        if (response.ok) {
          const tickets = await response.json();
          const tieneTicketActivo = tickets.some(ticket => {
            const estado = (ticket.estadoGeneral || ticket.estado_general || '').toLowerCase();
            return estado === 'abierto' || estado === 'en proceso';
          });
          setHasActiveTicket(tieneTicketActivo);
          guardarTicketActivoCache(idUsuario, tieneTicketActivo);
        }
      } catch (error) {
        console.error('Error al verificar tickets activos:', error);
      }
    };

    verificarTicketActivo();
  }, [idUsuario, location.pathname]); // Re-verificar cuando cambia la ruta

  const mostrarCrearTicket = hasActiveTicket === false;

  const handleLogout = () => {
    if (idUsuario) {
      try {
        sessionStorage.removeItem(`${ACTIVE_TICKET_CACHE_PREFIX}${idUsuario}`);
      } catch {
        // ignore
      }
    }
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const menuContent = (
    <>
      {/* Logo */}
      <div className="mb-4 text-center py-2">
        <img 
          src="https://storage.googleapis.com/pitagora-evidencias-bucket/logo.gif" 
          alt="PITAGORA Logo" 
          className="img-fluid" 
          style={{ maxHeight: '50px', backgroundColor: 'white', borderRadius: '4px', padding: '5px' }} 
        />
      </div>

      {/* Información del usuario logueado */}
      <div className="mb-4 px-2">
        <div className="small text-white-50">Bienvenido/a</div>
        <Link
          to="/perfil"
          className={`text-white text-decoration-none d-block fw-bold fs-5 ${location.pathname === '/perfil' ? 'text-info' : ''}`}
          style={{ lineHeight: 1.3 }}
        >
          {usuario?.nombre || 'Juan Pérez'}
        </Link>
        <Link
          to="/perfil"
          className={`small text-decoration-none d-inline-flex align-items-center mt-1 ${location.pathname === '/perfil' ? 'text-white fw-semibold' : 'text-white-50'}`}
        >
          <i className="bi bi-person-circle me-1"></i> Mi Perfil
        </Link>
        <div className="small text-white-50 fst-italic mt-2">
          <i className="text-white-50 bi bi-building me-1"></i> {nombreObra || 'Sin obra asignada'}
        </div>
      </div>

      <hr className="my-2 border-secondary" />

      {/* Opciones de Navegación */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <Link 
            to="/dashboard" 
            className={`nav-link text-white ${location.pathname === '/dashboard' ? 'active' : ''}`}
            style={{ backgroundColor: location.pathname === '/dashboard' ? '#003860' : 'transparent' }}
          >
            <i className="bi bi-file-text me-2"></i> Mis Solicitudes
          </Link>
        </li>
        {!mostrarCrearTicket ? null : (
          <li className="nav-item mb-2">
            <Link 
              to="/crear-ticket" 
              className={`nav-link text-white ${location.pathname === '/crear-ticket' ? 'active' : ''}`}
              style={{ backgroundColor: location.pathname === '/crear-ticket' ? '#003860' : 'transparent' }}
            >
              <i className="bi bi-plus-circle me-2"></i> Crear Nuevo Ticket
            </Link>
          </li>
        )}
        <li className="nav-item mb-2">
          <Link 
            to="/crear-observacion" 
            className={`nav-link text-white ${location.pathname.includes('/crear-observacion') ? 'active' : ''}`}
            style={{ backgroundColor: location.pathname.includes('/crear-observacion') ? '#003860' : 'transparent' }}
          >
            <i className="bi bi-search me-2"></i> Crear Observación
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/mensajes" 
            className={`nav-link text-white ${location.pathname === '/mensajes' ? 'active' : ''}`}
            style={{ backgroundColor: location.pathname === '/mensajes' ? '#003860' : 'transparent' }}
          >
            <i className="bi bi-chat-dots me-2"></i> Mis Mensajes
          </Link>
        </li>
      
     
      </ul>

      <hr className="border-secondary" />

      {/* Cerrar Sesión */}
      <button 
        onClick={handleLogout} 
        className="btn btn-outline-light w-100 mt-2 d-flex align-items-center justify-content-center"
        style={{ borderColor: '#ED1C25', color: '#ED1C25' }}
      >
        <i className="bi bi-box-arrow-left me-2"></i> Cerrar Sesión
      </button>
    </>
  );

  return (
    <>
      {/* Sidebar fijo para desktop */}
      <div
        className="d-none d-lg-flex flex-column flex-shrink-0 text-white p-3"
        style={{ width: '280px', height: '100vh', backgroundColor: '#002840' }}
      >
        {menuContent}
      </div>

      {/* Offcanvas para móviles */}
      <div className="offcanvas offcanvas-start text-white d-lg-none" id="navbarUsuarioOffcanvas" style={{ backgroundColor: '#002840', width: '280px' }} tabIndex="-1" aria-labelledby="navbarUsuarioOffcanvasLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="navbarUsuarioOffcanvasLabel">Menú Usuario</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body d-flex flex-column p-3">
          {menuContent}
        </div>
      </div>
    </>
  );
}