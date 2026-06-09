import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaRegFileAlt, FaCommentDots, FaClock, FaEye, FaExclamationCircle } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { buscarGeneral } from '../../services/buscadorService';
import ObservacionDetalleModal from '../../components/ObservacionDetalleModal';

const ResultadosBusqueda = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get('q') || '';

  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estado para el modal de detalle
  const [showModal, setShowModal] = useState(false);
  const [selectedObsId, setSelectedObsId] = useState(null);

  useEffect(() => {
    if (q) {
      realizarBusqueda();
    } else {
      setResultados([]);
      setLoading(false);
    }
  }, [q]);

  const realizarBusqueda = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await buscarGeneral(q);
      setResultados(data);
    } catch (err) {
      console.error('Error al buscar:', err);
      setError('Hubo un error al conectar con el servidor de búsqueda.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = (idObservacion) => {
    setSelectedObsId(idObservacion);
    setShowModal(true);
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
            <mark key={i} className="p-0 bg-warning bg-opacity-50">{part}</mark> : part
        )}
      </span>
    );
  };

  return (
    <AdminLayout 
      usuario={usuarioLogueado} 
      titulo="Resultados de Búsqueda" 
      handleVolver={() => navigate('/admin-dashboard')}
    >
      <div className="container py-4">
        <div className="mb-4">
          <h5 className="text-muted">
            <FaSearch className="me-2" />
            Resultados para: <span className="text-dark fw-bold">"{q}"</span>
          </h5>
          <small className="text-muted">Se encontraron {resultados.length} coincidencias</small>
        </div>

        {error && (
          <div className="alert alert-danger shadow-sm" role="alert">
            <FaExclamationCircle className="me-2" /> {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Buscando en mensajes y observaciones...</p>
          </div>
        ) : resultados.length > 0 ? (
          <div className="row g-3">
            {resultados.map((res, index) => (
              <div key={index} className="col-12">
                <div 
                  className="card border-0 shadow-sm hover-shadow transition-all" 
                  style={{ cursor: 'pointer', borderRadius: '12px' }}
                  onClick={() => handleVerDetalle(res.idRelacionado)}
                >
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center">
                        <div className={`p-2 rounded-circle me-3 ${res.tipo === 'Mensaje' ? 'bg-primary-subtle text-primary' : 'bg-success-subtle text-success'}`}>
                          {res.tipo === 'Mensaje' ? <FaCommentDots /> : <FaRegFileAlt />}
                        </div>
                        <div>
                          <span className="badge bg-light text-muted border mb-1">{res.tipo}</span>
                          <h6 className="mb-0 text-dark fw-bold">{res.titulo}</h6>
                        </div>
                      </div>
                      <small className="text-muted d-flex align-items-center">
                        <FaClock className="me-1" /> {formatFecha(res.fecha)}
                      </small>
                    </div>
                    
                    <div className="mt-3 ps-5">
                      <p className="text-secondary mb-3" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                        {highlightText(res.descripcion, q)}
                      </p>
                      <button 
                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerDetalle(res.idRelacionado);
                        }}
                      >
                        <FaEye className="me-1" /> Ver detalles de la observación
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm">
            <div className="opacity-25 mb-3">
              <FaSearch size={64} />
            </div>
            <h4>No encontramos nada para "{q}"</h4>
            <p className="text-muted">Intenta con otras palabras o revisa la ortografía.</p>
          </div>
        )}
      </div>

      {/* Modal Reutilizado */}
      <ObservacionDetalleModal
        show={showModal}
        onHide={() => setShowModal(false)}
        idObservacion={selectedObsId}
      />

      <style>{`
        .hover-shadow:hover {
          transform: translateY(-2px);
          box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </AdminLayout>
  );
};

export default ResultadosBusqueda;
