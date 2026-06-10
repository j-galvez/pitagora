import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import NavbarAdmin from './NavbarAdmin'; // Ajusta la ruta según tu estructura

const AdminLayout = ({ 
  usuario, 
  titulo, 
  handleVolver, 
  children 
}) => {
  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <NavbarAdmin usuario={usuario} />

      <div
        className="d-flex flex-column flex-grow-1"
        style={{ backgroundColor: '#F8F9FA', height: '100vh', minWidth: 0 }}
      >
        <nav className="navbar navbar-dark flex-shrink-0" style={{ backgroundColor: '#002840' }}>
          <div className="container-fluid d-flex justify-content-between align-items-center py-2">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-light d-lg-none me-2"
                data-bs-toggle="offcanvas"
                data-bs-target="#navbarAdminOffcanvas"
                aria-controls="navbarAdminOffcanvas"
              >
                <i className="bi bi-list"></i> Menú
              </button>

              {handleVolver && (
                <button className="btn btn-link text-white me-3 text-decoration-none" onClick={handleVolver}>
                  <FaArrowLeft className="me-1" /> Volver
                </button>
              )}

              <h4 className="text-white mb-0">{titulo}</h4>
            </div>
          </div>
        </nav>

        <div className="flex-grow-1 overflow-auto p-4" style={{ minHeight: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;