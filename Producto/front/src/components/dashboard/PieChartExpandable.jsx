import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

/**
 * Componente de gráfico de torta expandible
 * Al hacer click en una sección, se expande mostrando detalles
 */
const PieChartExpandable = ({ datos, titulo = "Distribución" }) => {
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Calcular total y porcentajes
  const total = datos.reduce((sum, item) => sum + item.valor, 0);
  
  // Calcular ángulos para cada segmento
  let currentAngle = 0;
  const segments = datos.map((item, index) => {
    const percentage = (item.valor / total) * 100;
    const angle = (item.valor / total) * 360;
    const segment = {
      ...item,
      percentage: percentage.toFixed(1),
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: item.color || getColor(index)
    };
    currentAngle += angle;
    return segment;
  });

  // Paleta de colores por defecto
  function getColor(index) {
    const colors = [
      '#003860', // Azul Pitagora
      '#0dcaf0', // Info
      '#198754', // Success
      '#ffc107', // Warning
      '#dc3545', // Danger
      '#6c757d', // Secondary
      '#91ABC6', // Azul claro Pitagora
      '#ED1C25'  // Rojo Pitagora
    ];
    return colors[index % colors.length];
  }

  // Crear path SVG para cada segmento
  function createArc(startAngle, endAngle, radius = 80) {
    const start = polarToCartesian(100, 100, radius, endAngle);
    const end = polarToCartesian(100, 100, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", 100, 100,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  }

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  // Manejar click en segmento
  const handleSegmentClick = (segment) => {
    setSelectedSegment(segment);
    setShowModal(true);
  };

  // Cerrar modal
  const handleClose = () => {
    setShowModal(false);
    setSelectedSegment(null);
  };

  return (
    <>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">{titulo}</h5>
          
          <div className="row">
            {/* Gráfico de torta */}
            <div className="col-md-6 d-flex justify-content-center align-items-center">
              <svg 
                viewBox="0 0 200 200" 
                style={{ maxWidth: '300px', width: '100%' }}
              >
                {segments.map((segment, index) => (
                  <g key={index}>
                    <path
                      d={createArc(segment.startAngle, segment.endAngle)}
                      fill={segment.color}
                      stroke="white"
                      strokeWidth="2"
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: 0.9
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.transformOrigin = '100px 100px';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity = '0.9';
                        e.target.style.transform = 'scale(1)';
                      }}
                      onClick={() => handleSegmentClick(segment)}
                    />
                  </g>
                ))}
                
                {/* Círculo central blanco para efecto donut */}
                <circle
                  cx="100"
                  cy="100"
                  r="50"
                  fill="white"
                />
                
                {/* Texto central */}
                <text
                  x="100"
                  y="95"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6c757d"
                  fontWeight="600"
                >
                  TOTAL
                </text>
                <text
                  x="100"
                  y="110"
                  textAnchor="middle"
                  fontSize="20"
                  fill="#003860"
                  fontWeight="bold"
                >
                  {total}
                </text>
              </svg>
            </div>

            {/* Leyenda */}
            <div className="col-md-6">
              <div className="d-flex flex-column gap-2">
                {segments.map((segment, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center justify-content-between p-2 rounded"
                    style={{
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={() => handleSegmentClick(segment)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          backgroundColor: segment.color,
                          borderRadius: '3px'
                        }}
                      />
                      <span className="small fw-semibold text-truncate">
                        {segment.nombre}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge" style={{ backgroundColor: segment.color }}>
                        {segment.valor}
                      </span>
                      <span className="small text-muted">
                        {segment.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-3">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Haz click en cualquier sección para ver más detalles
            </small>
          </div>
        </div>
      </div>

      {/* Modal expandido con detalles */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: selectedSegment?.color, color: 'white' }}>
          <Modal.Title>
            <i className="bi bi-pie-chart-fill me-2"></i>
            {selectedSegment?.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSegment && (
            <div className="container-fluid">
              {/* Estadísticas principales */}
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="card bg-light border-0">
                    <div className="card-body text-center">
                      <div className="small text-muted mb-1">Cantidad</div>
                      <div className="h3 mb-0 fw-bold" style={{ color: selectedSegment.color }}>
                        {selectedSegment.valor}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light border-0">
                    <div className="card-body text-center">
                      <div className="small text-muted mb-1">Porcentaje</div>
                      <div className="h3 mb-0 fw-bold" style={{ color: selectedSegment.color }}>
                        {selectedSegment.percentage}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light border-0">
                    <div className="card-body text-center">
                      <div className="small text-muted mb-1">Del Total</div>
                      <div className="h3 mb-0 fw-bold" style={{ color: selectedSegment.color }}>
                        {selectedSegment.valor}/{total}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {selectedSegment.descripcion && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Descripción</h6>
                  <p className="text-muted mb-0">{selectedSegment.descripcion}</p>
                </div>
              )}

              {/* Detalles adicionales */}
              {selectedSegment.detalles && selectedSegment.detalles.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Detalles</h6>
                  <div className="list-group">
                    {selectedSegment.detalles.map((detalle, index) => (
                      <div key={index} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-semibold">{detalle.titulo}</div>
                            {detalle.subtitulo && (
                              <small className="text-muted">{detalle.subtitulo}</small>
                            )}
                          </div>
                          {detalle.valor && (
                            <span className="badge bg-secondary">{detalle.valor}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Barra de progreso visual */}
              <div className="mb-3">
                <h6 className="fw-bold mb-2">Proporción del Total</h6>
                <div className="progress" style={{ height: '30px' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${selectedSegment.percentage}%`,
                      backgroundColor: selectedSegment.color
                    }}
                    aria-valuenow={selectedSegment.percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span className="fw-bold">{selectedSegment.percentage}%</span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              {selectedSegment.acciones && selectedSegment.acciones.length > 0 && (
                <div className="d-flex gap-2 flex-wrap">
                  {selectedSegment.acciones.map((accion, index) => (
                    <button
                      key={index}
                      className="btn btn-sm"
                      style={{
                        backgroundColor: selectedSegment.color,
                        borderColor: selectedSegment.color,
                        color: 'white'
                      }}
                      onClick={accion.onClick}
                    >
                      {accion.icono && <i className={`${accion.icono} me-1`}></i>}
                      {accion.texto}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

PieChartExpandable.propTypes = {
  titulo: PropTypes.string,
  datos: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      valor: PropTypes.number.isRequired,
      color: PropTypes.string,
      descripcion: PropTypes.string,
      detalles: PropTypes.arrayOf(
        PropTypes.shape({
          titulo: PropTypes.string,
          subtitulo: PropTypes.string,
          valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        })
      ),
      acciones: PropTypes.arrayOf(
        PropTypes.shape({
          texto: PropTypes.string.isRequired,
          icono: PropTypes.string,
          onClick: PropTypes.func
        })
      )
    })
  ).isRequired
};

export default PieChartExpandable;

// Made with Bob