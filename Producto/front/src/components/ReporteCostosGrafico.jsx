import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaSync, FaInfoCircle } from 'react-icons/fa';
import { obtenerReporteCostos } from '../services/reportesService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReporteCostosGrafico = ({ usuarioLogueado }) => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await obtenerReporteCostos();
      const filtered = data
        .filter(item => item.montoTotal > 0)
        .sort((a, b) => b.montoTotal - a.montoTotal);
      setDatos(filtered);
    } catch (err) {
      console.error('Error al cargar reporte de costos:', err);
      setError('No se pudo cargar la información de costos.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (valor) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor || 0);
  };

  const coloresPaleta = ['#003860', '#0dcaf0', '#198754', '#ffc107', '#6c757d', '#6610f2', '#fd7e14', '#20c997'];

  const exportarPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      doc.setFillColor(0, 56, 96);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, 'bold');
      doc.text('REPORTE DE COSTOS POR OBRA', 14, 20);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text('Sistema de Gestión Postventa - Pitagora', 14, 30);
      doc.text(`Generado por: ${usuarioLogueado?.nombre || 'Administrador'} | Fecha: ${new Date().toLocaleString()}`, 14, 35);

      const chartStartY = 55;
      const chartHeight = 40;
      const marginX = 25;
      const chartAreaWidth = pageWidth - (marginX * 2);
      
      doc.setDrawColor(200);
      doc.setLineWidth(0.2);
      doc.line(marginX, chartStartY + chartHeight, marginX + chartAreaWidth, chartStartY + chartHeight);

      if (datos.length > 0) {
        const maxMonto = Math.max(...datos.map(item => item.montoTotal));
        const barWidth = Math.min(10, (chartAreaWidth / datos.length) * 0.6);
        const gap = (chartAreaWidth - (barWidth * datos.length)) / (datos.length + 1);

        datos.forEach((item, i) => {
          const barH = (item.montoTotal / maxMonto) * chartHeight;
          const x = marginX + gap + i * (barWidth + gap);
          const y = chartStartY + chartHeight - barH;

          const colorHex = coloresPaleta[i % coloresPaleta.length];
          const r = parseInt(colorHex.slice(1, 3), 16);
          const g = parseInt(colorHex.slice(3, 5), 16);
          const b = parseInt(colorHex.slice(5, 7), 16);
          
          doc.setFillColor(r, g, b);
          doc.rect(x, y, barWidth, barH, 'F');

          doc.setFontSize(7); 
          doc.setTextColor(40);
          doc.setFont(undefined, 'bold');
          doc.text(formatCurrency(item.montoTotal), x + (barWidth / 2), y - 2, { align: 'center' });
          
          doc.setFontSize(7);
          doc.setFont(undefined, 'normal');
          doc.text(`${i + 1}`, x + (barWidth / 2), chartStartY + chartHeight + 4, { align: 'center' });
        });
      }

      const tableColumn = ['#', 'Obra / Proyecto', 'Costo Acumulado', '%'];
      const totalGeneral = datos.reduce((acc, curr) => acc + curr.montoTotal, 0);
      
      const tableRows = datos.map((item, index) => [
        index + 1,
        item.nombreObra,
        formatCurrency(item.montoTotal),
        `${((item.montoTotal / totalGeneral) * 100).toFixed(1)}%`
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: chartStartY + chartHeight + 15,
        theme: 'grid',
        headStyles: { fillColor: [0, 56, 96], textColor: 255 },
        styles: { fontSize: 8 },
        columnStyles: { 0: { cellWidth: 8 }, 2: { halign: 'right' }, 3: { halign: 'right' } }
      });

      doc.setFontSize(10);
      doc.text(`TOTAL INVERSIÓN: ${formatCurrency(totalGeneral)}`, pageWidth - 14, doc.lastAutoTable.finalY + 10, { align: 'right' });

      doc.save(`Reporte_Costos_Pitagora_${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error('Error al generar PDF:', err);
      alert('Hubo un error al generar el PDF.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div><p className="mt-2">Cargando...</p></div>
    );
  }

  const maxMonto = datos.length > 0 ? Math.max(...datos.map(item => item.montoTotal)) : 0;

  return (
    <div className="p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-3 shadow-sm border-start border-primary border-4">
        <div>
          <h4 className="mb-1 fw-bold text-dark">Inversión por Obra</h4>
          <p className="text-muted small mb-0">Sistema Pitagora - Control de Costos Postventa</p>
        </div>
        <button className="btn btn-danger px-4 shadow-sm fw-bold" onClick={exportarPDF} disabled={datos.length === 0}>
          <FaFilePdf className="me-2" /> Exportar PDF
        </button>
      </div>

      {datos.length === 0 ? (
        <div className="card text-center py-5 border-0 shadow-sm"><div className="card-body text-muted">No hay datos registrados.</div></div>
      ) : (
        <div className="card shadow-sm border-0 bg-white">
          <div className="card-body p-4">
            <h6 className="fw-bold text-muted mb-4 text-uppercase small tracking-wider border-bottom pb-2">Visualización de Gastos</h6>
            
            <div className="row">
              {/* Chart Area */}
              <div className="col-lg-9">
                <div 
                  className="bg-light rounded-3 shadow-inner" 
                  style={{ 
                    height: '500px', // Aumentamos un poco más la altura total
                    position: 'relative',
                    padding: '80px 20px' // Padding uniforme para que las etiquetas respiren
                  }}
                >
                  {/* Contenedor interno que ocupa el espacio restante después del padding */}
                  <div 
                    className="d-flex align-items-end justify-content-around h-100 w-100"
                  >
                    {datos.map((item, index) => {
                      const heightPercent = (item.montoTotal / maxMonto) * 100;
                      const color = coloresPaleta[index % coloresPaleta.length];
                      const isHovered = hoveredIndex === index;

                      return (
                        <div 
                          key={item.idObra || index}
                          className="d-flex flex-column align-items-center"
                          style={{ 
                            width: '45px', 
                            height: `${heightPercent}%`,
                            cursor: 'pointer',
                            position: 'relative',
                            zIndex: isHovered ? 5 : 1,
                            transition: 'height 1s ease-out'
                          }}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          {/* Tooltip flotante */}
                          {isHovered && (
                            <div 
                              className="position-absolute shadow-lg p-2 rounded bg-dark text-white text-center" 
                              style={{ 
                                bottom: 'calc(100% + 40px)', 
                                left: '50%', 
                                transform: 'translateX(-50%)', 
                                zIndex: 100, 
                                width: '180px',
                                fontSize: '0.8rem'
                              }}
                            >
                              <div className="fw-bold border-bottom mb-1 pb-1">{item.nombreObra}</div>
                              <div className="text-info">{formatCurrency(item.montoTotal)}</div>
                            </div>
                          )}

                          {/* Texto de Costo - Dentro del área de padding superior */}
                          <div 
                            className="position-absolute text-center" 
                            style={{ 
                              bottom: '100%',
                              marginBottom: '12px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              fontSize: '0.8rem', 
                              fontWeight: 'bold', 
                              color: isHovered ? color : '#444',
                              whiteSpace: 'nowrap',
                              zIndex: 2
                            }}
                          >
                            {formatCurrency(item.montoTotal)}
                          </div>

                          {/* Barra */}
                          <div 
                            className="w-100 h-100 rounded-top shadow-sm"
                            style={{ 
                              backgroundColor: color,
                              opacity: hoveredIndex !== null && !isHovered ? 0.3 : 1,
                              transition: 'opacity 0.3s',
                              border: '1px solid rgba(0,0,0,0.05)'
                            }}
                          ></div>
                          
                          {/* Índice numérico - Dentro del área de padding inferior */}
                          <div 
                            className="position-absolute fw-bold text-secondary text-center" 
                            style={{ 
                              top: '100%',
                              marginTop: '15px',
                              fontSize: '0.9rem',
                              width: '100%'
                            }}
                          >
                            {index + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Legend Area */}
              <div className="col-lg-3 border-start">
                <div className="ps-3">
                  <h6 className="fw-bold small mb-3 text-muted">LEYENDA</h6>
                  <div className="overflow-auto" style={{ maxHeight: '360px' }}>
                    {datos.map((item, index) => (
                      <div 
                        key={index} 
                        className={`d-flex align-items-center mb-2 p-1 rounded transition-all ${hoveredIndex === index ? 'bg-light' : ''}`}
                        style={{ cursor: 'pointer', fontSize: '0.8rem' }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <span 
                          className="badge rounded-1 me-2 d-flex align-items-center justify-content-center" 
                          style={{ 
                            width: '20px', 
                            height: '20px', 
                            backgroundColor: coloresPaleta[index % coloresPaleta.length],
                            fontSize: '0.7rem'
                          }}
                        >
                          {index + 1}
                        </span>
                        <span className="text-truncate fw-medium" title={item.nombreObra}>
                          {item.nombreObra}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-top">
                    <div className="small text-muted mb-1">Inversión Total:</div>
                    <div className="h5 fw-bold text-success">{formatCurrency(datos.reduce((a, b) => a + b.montoTotal, 0))}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-4 p-3 bg-white rounded-3 shadow-sm border text-center small text-muted">
        <FaInfoCircle className="me-2 text-primary" />
        Utiliza el gráfico para visualizar la distribución de gastos. Pasa el cursor sobre las barras para identificar cada proyecto en el <strong>Sistema Pitagora</strong>.
      </div>
    </div>
  );
};

export default ReporteCostosGrafico;
