import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function NavbarUsuario({ usuario }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column vh-100 text-white p-3" style={{ width: '280px', backgroundColor: '#002840' }}>
      {/* Logo */}
      <div className="mb-4 text-center py-2">
        <img 
          src="https://www.pitagora.cl/images/logo_up_pitagora.gif" 
          alt="PITAGORA Logo" 
          className="img-fluid" 
          style={{ maxHeight: '50px', backgroundColor: 'white', borderRadius: '4px', padding: '5px' }} 
        />
      </div>

      {/* Información del usuario logueado */}
      <div className="mb-4 px-2">
        <div className="small text-white-50">Bienvenido/a</div>
        <div className="fw-bold fs-5">{usuario?.nombre || 'Juan Pérez'}</div>
        <div className="small text-muted fst-italic">
          <i className="bi bi-building me-1"></i> {usuario?.obraActual || 'Edificio Los Almendros - Depto 305'}
        </div>
      </div>

      <hr className="my-2 border-secondary" />

      {/* Opciones de Navegación */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <Link 
            to="/tickets" 
            className={`nav-link text-white ${location.pathname === '/tickets' ? 'active' : ''}`}
            style={{ backgroundColor: location.pathname === '/tickets' ? '#003860' : 'transparent' }}
          >
            <i className="bi bi-file-text me-2"></i> Mis Solicitudes
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link 
            to="/crear-ticket" 
            className={`nav-link text-white ${location.pathname === '/crear-ticket' ? 'active' : ''}`}
            style={{ backgroundColor: location.pathname === '/crear-ticket' ? '#003860' : 'transparent' }}
          >
            <i className="bi bi-plus-circle me-2"></i> Crear Nuevo Ticket
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
    </div>
  );
}