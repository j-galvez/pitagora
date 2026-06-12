import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaFileExcel, FaFilePdf, FaArrowLeft, FaFilter, FaTimes } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { obtenerReporteTrazabilidad } from '../../services/reportesService';
import { obrasService } from '../../services/obrasService';
import { clientesService } from '../../services/clientesService';
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
  
  // Estados para filtros
  const [obras, setObras] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filtroObra, setFiltroObra] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  useEffect(() => {
    cargarDatos();
    cargarFiltros();
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

  const cargarFiltros = async () => {
    try {
      const [obrasData, clientesData] = await Promise.all([
        obrasService.getAllObras(),
        clientesService.getAllClientes()
      ]);
      setObras(obrasData);
      setClientes(clientesData);
    } catch (err) {
      console.error('Error al cargar filtros:', err);
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

  const limparFiltros = () => {
    setSearchTerm('');
    setFiltroObra('');
    setFiltroCliente('');
    setFechaDesde('');
    setFechaHasta('');
  };

  const filteredDatos = datos.filter((item) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchSearch = (
      item.obra?.toLowerCase().includes(lowerSearch) ||
      item.cliente?.toLowerCase().includes(lowerSearch) ||
      item.responsable?.toLowerCase().includes(lowerSearch) ||
      item.fallaDetectada?.toLowerCase().includes(lowerSearch) ||
      item.ubicacionExacta?.toLowerCase().includes(lowerSearch) ||
      item.estadoActual?.toLowerCase().includes(lowerSearch)
    );

    const matchObra = filtroObra === '' || item.obra === filtroObra;
    const matchCliente = filtroCliente === '' || item.cliente === filtroCliente;
    
    let matchFecha = true;
    if (fechaDesde || fechaHasta) {
      const fechaReg = new Date(item.fechaRegistro);
      if (fechaDesde) {
        const d = new Date(fechaDesde);
        d.setHours(0, 0, 0, 0);
        if (fechaReg < d) matchFecha = false;
      }
      if (fechaHasta) {
        const h = new Date(fechaHasta);
        h.setHours(23, 59, 59, 999);
        if (fechaReg > h) matchFecha = false;
      }
    }

    return matchSearch && matchObra && matchCliente && matchFecha;
  });

  // EXPORTAR A EXCEL
  const exportarExcel = () => {
    const dataToExport = filteredDatos.map(item => ({
      'Obra / Proyecto': item.obra,
      'Cliente': item.cliente,
      'Responsable': item.responsable,
      'Fecha Reporte': formatFecha(item.fechaRegistro),
      'Fecha Resolución': formatFecha(item.fechaResolucion),
      'Falla Detectada': item.fallaDetectada,
      'Ubicación': item.ubicacionExacta,
      'Estado': item.estadoActual,
      'Solución / Comentarios': item.solucionAplicada || 'Sin comentarios'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const wscols = [
      { wch: 25 }, { wch: 25 }, { wch: 20 }, { wch: 18 }, { wch: 18 },
      { wch: 25 }, { wch: 25 }, { wch: 12 }, { wch: 40 },
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
      
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text('BITÁCORA DE TRAZABILIDAD DE OBRAS', 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Sistema de Gestión Postventa - Pitágoras', 14, 28);
      doc.text(`Generado por: ${usuarioLogueado.nombre} | Fecha: ${new Date().toLocaleString()}`, 14, 34);

      if (filtroObra || filtroCliente || fechaDesde || fechaHasta) {
        let f = 'Filtros aplicados: ';
        if (filtroCliente) f += `Cliente: ${filtroCliente} `;
        if (filtroObra) f += `Obra: ${filtroObra} `;
        if (fechaDesde) f += `Desde: ${fechaDesde} `;
        if (fechaHasta) f += `Hasta: ${fechaHasta}`;
        doc.text(f, 14, 40);
      }

      const tableColumn = ['Obra', 'Cliente', 'Responsable', 'Registro', 'Término', 'Falla', 'Ubicación', 'Estado'];
      const tableRows = filteredDatos.map(item => [
        item.obra, item.cliente, item.responsable,
        formatFecha(item.fechaRegistro).split(',')[0],
        formatFecha(item.fechaResolucion).split(',')[0],
        item.fallaDetectada, item.ubicacionExacta, item.estadoActual.toUpperCase()
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'striped',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [50, 50, 50], textColor: 255 },
        margin: { top: 45, left: 14, right: 14 }
      });

      doc.save(`Reporte_Trazabilidad_${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error('Error al generar PDF:', err);
      alert('Hubo un error al generar el PDF.');
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
              <h5 className="mb-0">Reporte de Trazabilidad de Obras</h5>
              <p className="text-muted mb-0 small">Consolidado de fallas, responsables y estados por proyecto.</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-success btn-sm d-flex align-items-center" onClick={exportarExcel} disabled={filteredDatos.length === 0}>
                <FaFileExcel className="me-2" /> Excel
              </button>
              <button className="btn btn-outline-danger btn-sm d-flex align-items-center" onClick={exportarPDF} disabled={filteredDatos.length === 0}>
                <FaFilePdf className="me-2" /> PDF
              </button>
            </div>
          </div>

          {/* SECCIÓN DE FILTROS SIMPLIFICADA */}
          <div className="row g-3 mb-4 p-3 bg-light rounded-3 border-0">
            <div className="col-md-3">
              <label className="form-label small text-muted">Cliente</label>
              <select className="form-select form-select-sm" value={filtroCliente} onChange={(e) => setFiltroCliente(e.target.value)}>
                <option value="">Todos los clientes</option>
                {clientes.map(c => (
                  <option key={c.idCliente || c.id_cliente} value={c.nombreEmpresa || c.nombre_empresa}>
                    {c.nombreEmpresa || c.nombre_empresa}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small text-muted">Obra / Proyecto</label>
              <select className="form-select form-select-sm" value={filtroObra} onChange={(e) => setFiltroObra(e.target.value)}>
                <option value="">Todas las obras</option>
                {obras.map(o => (
                  <option key={o.idObra || o.id_obra} value={o.nombreObra || o.nombre_obra}>
                    {o.nombreObra || o.nombre_obra}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small text-muted">Desde</label>
              <input type="date" className="form-control form-control-sm" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label small text-muted">Hasta</label>
              <input type="date" className="form-control form-control-sm" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0 text-muted"><FaSearch /></span>
                <input type="text" className="form-control border-start-0 ps-0" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            {(filtroObra || filtroCliente || fechaDesde || fechaHasta || searchTerm) && (
              <div className="col-12 mt-2">
                <button className="btn btn-link btn-sm text-danger p-0" onClick={limparFiltros}>
                  <FaTimes className="me-1" /> Limpiar filtros
                </button>
              </div>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light text-muted" style={{ fontSize: '14px' }}>
                <tr>
                  <th>Obra</th>
                  <th>Cliente</th>
                  <th>Responsable</th>
                  <th>Fecha Registro</th>
                  <th>Fecha Resolución</th>
                  <th>Falla</th>
                  <th>Ubicación</th>
                  <th>Estado</th>
                  <th>Solución</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '14px' }}>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
                    </td>
                  </tr>
                ) : filteredDatos.length > 0 ? (
                  filteredDatos.map((item, index) => (
                    <tr key={index}>
                      <td className="fw-semibold">{item.obra}</td>
                      <td>{item.cliente || '-'}</td>
                      <td>{item.responsable || '-'}</td>
                      <td>{formatFecha(item.fechaRegistro)}</td>
                      <td>{formatFecha(item.fechaResolucion)}</td>
                      <td>{item.fallaDetectada}</td>
                      <td>{item.ubicacionExacta}</td>
                      <td>
                        <span className={`badge ${
                          item.estadoActual === 'terminado' ? 'bg-success' : 
                          item.estadoActual === 'en proceso' ? 'bg-primary' : 
                          item.estadoActual === 'no aplica' ? 'bg-secondary' : 'bg-warning text-dark'
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
                    <td colSpan="9" className="text-center text-muted py-4">
                      No se encontraron datos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReporteBitacoraObra;
