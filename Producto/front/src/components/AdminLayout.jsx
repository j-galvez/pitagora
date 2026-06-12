import React, { useState } from 'react';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin'; // Ajusta la ruta según tu estructura

const AdminLayout = ({ 
  usuario, 
  titulo, 
  handleVolver, 
  children 
}) => {
  const navigate = useNavigate();
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const handleBuscar = (e) => {
    e.preventDefault();
    if (terminoBusqueda.trim().length >= 2) {
      navigate(`/admin/buscar?q=${encodeURIComponent(terminoBusqueda.trim())}`);
      setTerminoBusqueda(''); // Limpiar buscador tras navegar
    }
  };

  return (
    <div className="d-flex vh-100 overflow-hidden">
      {/* Barra lateral - Se mantiene fija por el vh-100 del contenedor padre */}
      <NavbarAdmin usuario={usuario} />
      
      {/* Contenedor principal con scroll independiente */}
      <div className="flex-grow-1 d-flex flex-column h-100" style={{ backgroundColor: '#F8F9FA' }}>
        
        {/* Barra de Navegación Superior - Estática en la parte superior del flex-column */}
        <nav className="navbar navbar-dark shadow-sm" style={{ backgroundColor: '#002840', zIndex: 1030 }}>
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
              <h4 className="text-white mb-0 d-none d-sm-block">{titulo}</h4>
            </div>

            {/* BUSCADOR OMNIBOX */}
            <div className="flex-grow-1 mx-4" style={{ maxWidth: '600px' }}>
              <form onSubmit={handleBuscar}>
                <div className="input-group shadow-sm" style={{ borderRadius: '20px' }}>
                  <span className="input-group-text bg-light border-0 py-0 px-3" style={{ borderRadius: '20px 0 0 20px' }}>
                    <FaSearch className="text-muted small" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-light"
                    placeholder="Buscar mensajes, observaciones o problemas..."
                    style={{ borderRadius: '0 20px 20px 0', fontSize: '14px', height: '40px' }}
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>
        </nav>
        <div className="flex-grow-1 overflow-auto p-4 custom-scrollbar">
          {children}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #bbb;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;