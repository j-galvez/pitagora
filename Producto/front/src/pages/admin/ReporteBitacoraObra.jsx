import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaFileExcel, FaFilePdf, FaArrowLeft, FaFilter } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { obtenerReporteTrazabilidad } from '../../services/reportesService';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReporteBitacoraObra = () => {
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || {
    nombre: 'Administrador',
    rol: 'admin'
  };

  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await obtenerReporteTrazabilidad();
      setDatos(data);
    } catch (err) {
      console.error('Error al cargar reporte:', err);
      setError('No se pudo cargar la información del reporte.');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/admin-dashboard');
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDatos = datos.filter((item) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      item.obra?.toLowerCase().includes(lowerSearch) ||
      item.responsable?.toLowerCase().includes(lowerSearch) ||
      item.fallaDetectada?.toLowerCase().includes(lowerSearch) ||
      item.ubicacionExacta?.toLowerCase().includes(lowerSearch) ||
      item.estadoActual?.toLowerCase().includes(lowerSearch)
    );
  });

  // EXPORTAR A EXCEL
  const exportarExcel = () => {
    const dataToExport = filteredDatos.map(item => ({
      'Obra / Proyecto': item.obra,
      'Responsable': item.responsable,
      'Fecha Reporte': formatFecha(item.fechaRegistro),
      'Fecha Resolución': formatFecha(item.fechaResolucion),
      'Falla Detectada': item.fallaDetectada,
      'Ubicación': item.ubicacionExacta,
      'Estado': item.estadoActual,
      'Solución / Comentarios': item.solucionAplicada || 'Sin comentarios'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    
    // Configurar anchos de columna para Excel
    const wscols = [
      { wch: 30 }, // Obra
      { wch: 25 }, // Responsable
      { wch: 20 }, // Fecha Registro
      { wch: 20 }, // Fecha Resolución
      { wch: 30 }, // Falla
      { wch: 30 }, // Ubicación
      { wch: 15 }, // Estado
      { wch: 50 }, // Solución
    ];
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trazabilidad');
    XLSX.writeFile(workbook, `Reporte_Trazabilidad_${new Date().getTime()}.xlsx`);
  };

  // EXPORTAR A PDF
  const exportarPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Título con estilo
      doc.setFontSize(20);
      doc.setTextColor(0, 56, 96); // Azul corporativo Pitágoras (#003860)
      doc.text('BITÁCORA DE TRAZABILIDAD DE OBRAS', 14, 20);
      
      // Subtítulo e información de generación
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Sistema de Gestión Postventa - Pitágoras', 14, 28);
      doc.text(`Generado por: ${usuarioLogueado.nombre}`, 14, 34);
      doc.text(`Fecha de exportación: ${new Date().toLocaleString()}`, 14, 40);

      const tableColumn = [
        'Obra', 'Responsable', 'Registro', 'Término', 'Falla Detectada', 'Ubicación', 'Estado', 'Solución'
      ];
      
      const tableRows = filteredDatos.map(item => [
        item.obra,
        item.responsable,
        formatFecha(item.fechaRegistro),
        formatFecha(item.fechaResolucion),
        item.fallaDetectada,
        item.ubicacionExacta,
        item.estadoActual.toUpperCase(),
        item.solucionAplicada || 'Sin comentarios'
      ]);

      // Generar tabla con estilo estructurado
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'striped', // Estilo de filas alternas
        styles: { 
          fontSize: 8, 
          cellPadding: 3,
          valign: 'middle',
          overflow: 'linebreak'
        },
        headStyles: { 
          fillColor: [0, 56, 96], // Azul oscuro
          textColor: 255, 
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 35 }, // Obra
          1: { cellWidth: 30 }, // Responsable
          2: { cellWidth: 22 }, // Registro
          3: { cellWidth: 22 }, // Término
          4: { cellWidth: 40 }, // Falla
          5: { cellWidth: 40 }, // Ubicación
          6: { cellWidth: 20, halign: 'center' }, // Estado
          7: { cellWidth: 'auto' } // Solución (ocupa el resto)
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 45, left: 14, right: 14 },
        didDrawPage: (data) => {
          // Pie de página con número de página
          const str = 'Página ' + doc.internal.getNumberOfPages();
          doc.setFontSize(10);
          const pageSize = doc.internal.pageSize;
          const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          doc.text(str, data.settings.margin.left, pageHeight - 10);
        }
      });

      doc.save(`Reporte_Trazabilidad_${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error('Error al generar PDF:', err);
      alert('Hubo un error al generar el PDF. Por favor, intenta de nuevo.');
    }
  };

  return (
    <AdminLayout 
      usuario={usuarioLogueado} 
      titulo="Bitácora de Trazabilidad" 
      handleVolver={handleVolver}
    >
      <div className="container py-4">
        <div className="card shadow-sm border-0 rounded-3 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="mb-1">Reporte de Trazabilidad de Obras</h5>
              <p className="text-muted mb-0 small">Consolidado de fallas, responsables y estados por proyecto.</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-success d-flex align-items-center" onClick={exportarExcel} disabled={filteredDatos.length === 0}>
                <FaFileExcel className="me-2" /> Excel
              </button>
              <button className="btn btn-outline-danger d-flex align-items-center" onClick={exportarPDF} disabled={filteredDatos.length === 0}>
                <FaFilePdf className="me-2" /> PDF
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Filtrar por obra, responsable, falla o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              {error}
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-hover align-middle" style={{ fontSize: '13px' }}>
              <thead className="table-light">
                <tr>
                  <th>Obra</th>
                  <th>Responsable</th>
                  <th>Fecha Registro</th>
                  <th>Fecha Resolución</th>
                  <th>Falla Detectada</th>
                  <th>Ubicación</th>
                  <th>Estado</th>
                  <th>Solución</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
                      <span className="ms-2">Cargando reporte...</span>
                    </td>
                  </tr>
                ) : filteredDatos.length > 0 ? (
                  filteredDatos.map((item, index) => (
                    <tr key={index}>
                      <td className="fw-bold">{item.obra}</td>
                      <td>{item.responsable}</td>
                      <td>{formatFecha(item.fechaRegistro)}</td>
                      <td>{formatFecha(item.fechaResolucion)}</td>
                      <td>{item.fallaDetectada}</td>
                      <td>{item.ubicacionExacta}</td>
                      <td>
                        <span className={`badge ${
                          item.estadoActual === 'terminado' ? 'bg-success' : 
                          item.estadoActual === 'en proceso' ? 'bg-primary' : 'bg-warning text-dark'
                        }`}>
                          {item.estadoActual}
                        </span>
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '150px' }} title={item.solucionAplicada}>
                        {item.solucionAplicada || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      No se encontraron datos para los criterios seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {!loading && filteredDatos.length > 0 && (
            <div className="mt-3 text-muted small">
              Mostrando {filteredDatos.length} registros encontrados.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReporteBitacoraObra;
