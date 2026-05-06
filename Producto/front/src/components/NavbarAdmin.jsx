import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function NavbarAdmin({ usuario }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const menuContent = (
    <>
      {/* Logo */}
      <div className="mb-4 text-center py-2">
        <img 
          src="https://www.pitagora.cl/images/logo_up_pitagora.gif" 
          alt="PITAGORA Logo" 
          className="img-fluid" 
          style={{ maxHeight: '50px', backgroundColor: 'white', borderRadius: '4px', padding: '5px' }} 
        />
      </div>

      <div className="mb-4 px-2">
        <div className="small text-white-50">Panel de Administración</div>
        <div className="fw-bold fs-5">{usuario?.nombre || 'Administrador'}</div>
        <div className="small text-muted">Gestión de Postventa</div>
      </div>

      <hr className="my-2 border-secondary" />

      {/* Opciones del Administrador */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <Link 
            to="/admin-dashboard" 
            className={`nav-link text-white ${location.pathname === '/admin-dashboard' ? 'active' : ''}`}
            style={{ backgroundColor: location.pathname === '/admin-dashboard' ? '#003860' : 'transparent' }}
          >
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link 
            to="/admin/tickets" 
            className={`nav-link text-white ${location.pathname.includes('/tickets') ? 'active' : ''}`}
            style={{ backgroundColor: location.pathname.includes('/tickets') ? '#003860' : 'transparent' }}
          >
            <i className="bi bi-file-text me-2"></i> Tickets
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
        <li className="nav-item mb-2">
          <Link 
            to="/admin/crear-cliente" 
            className={`nav-link text-white ${location.pathname === '/admin/crear-cliente' ? 'active' : ''}`}
            style={{ backgroundColor: location.pathname === '/admin/crear-cliente' ? '#003860' : 'transparent' }}
          >
            <i className="bi bi-building me-2"></i> Crear Cliente
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link 
            to="/admin/crear-obra" 
            className={`nav-link text-white ${location.pathname === '/admin/crear-obra' ? 'active' : ''}`}
            style={{ backgroundColor: location.pathname === '/admin/crear-obra' ? '#003860' : 'transparent' }}
          >
            <i className="bi bi-hammer me-2"></i> Crear Obra
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link 
            to="/admin/usuarios" 
            className={`nav-link text-white ${location.pathname === '/admin/usuarios' ? 'active' : ''}`}
            style={{ backgroundColor: location.pathname === '/admin/usuarios' ? '#003860' : 'transparent' }}
          >
            <i className="bi bi-pencil-square me-2"></i> Gestión de Usuarios
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link 
            to="/admin/crear-usuarios" 
            className={`nav-link text-white ${location.pathname === '/admin/crear-usuarios' ? 'active' : ''}`}
            style={{ backgroundColor: location.pathname === '/admin/crear-usuarios' ? '#003860' : 'transparent' }}
          >
            <i className="bi bi-person-plus me-2"></i> Creación de Usuarios
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
      <div className="d-none d-lg-flex flex-column vh-100 text-white p-3" style={{ width: '280px', backgroundColor: '#002840' }}>
        {menuContent}
      </div>

      {/* Offcanvas para móviles */}
      <div className="offcanvas offcanvas-start text-white d-lg-none" id="navbarAdminOffcanvas" style={{ backgroundColor: '#002840', width: '280px' }} tabIndex="-1" aria-labelledby="navbarAdminOffcanvasLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="navbarAdminOffcanvasLabel">Menú Admin</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body d-flex flex-column p-3">
          {menuContent}
        </div>
      </div>
    </>
  );
}