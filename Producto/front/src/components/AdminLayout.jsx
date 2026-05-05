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
    <div className="d-flex">
      {/* Barra lateral */}
      <NavbarAdmin usuario={usuario} />
      
      {/* Contenido principal */}
      <div className="flex-grow-1" style={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
        
        {/* Barra de Navegación Superior */}
        <nav className="navbar navbar-dark" style={{ backgroundColor: '#002840' }}>
          <div className="container-fluid d-flex justify-content-between align-items-center py-2">
            <div className="d-flex align-items-center">
              {/* Botón Offcanvas para móviles */}
              <button 
                className="btn btn-outline-light d-lg-none me-2" 
                data-bs-toggle="offcanvas" 
                data-bs-target="#navbarAdminOffcanvas" 
                aria-controls="navbarAdminOffcanvas"
              >
                <i className="bi bi-list"></i> Menú
              </button>

              {/* Botón de volver condicional */}
              {handleVolver && (
                <button className="btn btn-link text-white me-3 text-decoration-none" onClick={handleVolver}>
                  <FaArrowLeft className="me-1" /> Volver
                </button>
              )}

              {/* Título dinámico de la página */}
              <h4 className="text-white mb-0">{titulo}</h4>
            </div>
          </div>
        </nav>

        {/* Contenedor del contenido específico de cada página */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;