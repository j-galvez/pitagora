import React from 'react';
import NavbarUsuario from './NavbarUsuario';

const UsuarioLayout = ({ usuario, titulo, hasActiveTicket = false, children }) => {
  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      <NavbarUsuario usuario={usuario} hasActiveTicket={hasActiveTicket} />

      <div className="d-flex flex-column flex-grow-1" style={{ height: '100vh', minWidth: 0 }}>
        <nav className="navbar navbar-dark flex-shrink-0" style={{ backgroundColor: '#002840' }}>
          <div className="container-fluid d-flex justify-content-between align-items-center py-2">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-light d-lg-none me-2"
                data-bs-toggle="offcanvas"
                data-bs-target="#navbarUsuarioOffcanvas"
                aria-controls="navbarUsuarioOffcanvas"
              >
                <i className="bi bi-list"></i> Menú
              </button>
              <h4 className="text-white mb-0">{titulo}</h4>
            </div>
          </div>
        </nav>

        <div className="flex-grow-1 overflow-auto" style={{ minHeight: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default UsuarioLayout;
