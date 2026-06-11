import React, { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { costosObservacionService } from '../services/costosObservacionService';

const formatMoneda = (valor) => {
  if (valor === null || valor === undefined) return '$ 0';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(valor);
};

const formatInputMil = (valor) => {
  const num = String(valor).replace(/\D/g, '');
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const parseMonto = (valorFormateado) => parseInt(valorFormateado.replace(/\./g, ''), 10) || 0;

const CostosObservacionModal = ({ show, onHide, observacion, onCostosActualizados }) => {
  const [costos, setCostos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingAccion, setLoadingAccion] = useState(false);
  const [error, setError] = useState('');

  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [editMonto, setEditMonto] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');

  const idObservacion = observacion?.idObservacion || observacion?.id_observacion;

  const cargarCostos = useCallback(async () => {
    if (!idObservacion) return 0;

    setLoading(true);
    setError('');
    try {
      const data = await costosObservacionService.getCostosPorObservacion(idObservacion);
      const nuevoTotal = data.total || 0;
      setCostos(data.costos || []);
      setTotal(nuevoTotal);
      return nuevoTotal;
    } catch (err) {
      console.error(err);
      setError('Error al cargar los costos');
      return 0;
    } finally {
      setLoading(false);
    }
  }, [idObservacion]);

  useEffect(() => {
    if (!show) {
      setCostos([]);
      setTotal(0);
      setNuevoMonto('');
      setNuevaDescripcion('');
      setEditandoId(null);
      setEditMonto('');
      setEditDescripcion('');
      setError('');
      setLoading(false);
      setLoadingAccion(false);
      return;
    }

    if (idObservacion) {
      setNuevoMonto('');
      setNuevaDescripcion('');
      setEditandoId(null);
      setError('');
      cargarCostos();
    }
  }, [show, idObservacion, cargarCostos]);

  const notificarCambio = (nuevoTotal) => {
    if (onCostosActualizados && idObservacion) {
      onCostosActualizados(idObservacion, nuevoTotal);
    }
  };

  const handleAgregar = async () => {
    const monto = parseMonto(nuevoMonto);
    if (monto <= 0) {
      setError('Ingresa un monto mayor a 0');
      return;
    }
    if (!nuevaDescripcion.trim()) {
      setError('Ingresa una descripción');
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
    const idUsuario = usuario.idUsuario || usuario.id_usuario || null;

    setLoadingAccion(true);
    setError('');
    try {
      await costosObservacionService.crearCosto({
        idObservacion,
        monto,
        descripcion: nuevaDescripcion.trim(),
        idUsuario,
      });
      setNuevoMonto('');
      setNuevaDescripcion('');
      const nuevoTotal = await cargarCostos();
      notificarCambio(nuevoTotal);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al agregar el costo');
    } finally {
      setLoadingAccion(false);
    }
  };

  const iniciarEdicion = (costo) => {
    setEditandoId(costo.idCosto);
    setEditMonto(formatInputMil(String(costo.monto)));
    setEditDescripcion(costo.descripcion);
    setError('');
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditMonto('');
    setEditDescripcion('');
  };

  const guardarEdicion = async (idCosto) => {
    const monto = parseMonto(editMonto);
    if (monto <= 0) {
      setError('Ingresa un monto mayor a 0');
      return;
    }
    if (!editDescripcion.trim()) {
      setError('Ingresa una descripción');
      return;
    }

    setLoadingAccion(true);
    setError('');
    try {
      await costosObservacionService.actualizarCosto(idCosto, {
        monto,
        descripcion: editDescripcion.trim(),
      });
      cancelarEdicion();
      const nuevoTotal = await cargarCostos();
      notificarCambio(nuevoTotal);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al actualizar el costo');
    } finally {
      setLoadingAccion(false);
    }
  };

  const handleEliminar = async (idCosto) => {
    if (!window.confirm('¿Eliminar este costo?')) return;

    setLoadingAccion(true);
    setError('');
    try {
      await costosObservacionService.eliminarCosto(idCosto);
      const nuevoTotal = await cargarCostos();
      notificarCambio(nuevoTotal);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al eliminar el costo');
    } finally {
      setLoadingAccion(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
      onClick={onHide}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">Gestión de Costos</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onHide}></button>
          </div>

          <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label fw-bold text-muted small text-uppercase">Falla / Observación</label>
              <div className="p-2 bg-light rounded border text-primary fw-bold">
                {observacion?.falla}
              </div>
            </div>

            <div className="mb-4 p-3 bg-light rounded border d-flex justify-content-between align-items-center">
              <span className="fw-bold text-muted small text-uppercase">Total acumulado</span>
              <span className="fw-bold text-success fs-5">{formatMoneda(total)}</span>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <div className="mb-4">
              <label className="form-label fw-bold text-muted small text-uppercase">Agregar costo</label>
              <div className="row g-2 align-items-end">
                <div className="col-md-4">
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light">$</span>
                    <input
                      type="text"
                      className="form-control text-end"
                      placeholder="Monto"
                      value={nuevoMonto}
                      onChange={(e) => setNuevoMonto(formatInputMil(e.target.value))}
                      disabled={loadingAccion}
                    />
                  </div>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Descripción (ej. ladrillos)"
                    value={nuevaDescripcion}
                    onChange={(e) => setNuevaDescripcion(e.target.value)}
                    disabled={loadingAccion}
                  />
                </div>
                <div className="col-md-3">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm w-100"
                    onClick={handleAgregar}
                    disabled={loadingAccion}
                  >
                    {loadingAccion ? 'Guardando...' : 'Agregar costo'}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="form-label fw-bold text-muted small text-uppercase">Historial de costos</label>
              {loading ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div>
              ) : costos.length === 0 ? (
                <div className="text-center py-3 text-muted border rounded bg-light" style={{ fontSize: '13px' }}>
                  No hay costos registrados para esta observación.
                </div>
              ) : (
                <div className="table-responsive rounded border">
                  <table className="table table-sm table-hover mb-0 align-middle" style={{ fontSize: '13px' }}>
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3">Fecha</th>
                        <th>Descripción</th>
                        <th className="text-end">Monto</th>
                        <th className="text-center pe-3" style={{ width: '100px' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costos.map((costo) => (
                        <tr key={costo.idCosto}>
                          <td className="ps-3 text-muted">
                            {costo.fechaRegistro
                              ? new Date(costo.fechaRegistro).toLocaleDateString('es-ES')
                              : '-'}
                          </td>
                          {editandoId === costo.idCosto ? (
                            <>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={editDescripcion}
                                  onChange={(e) => setEditDescripcion(e.target.value)}
                                  disabled={loadingAccion}
                                />
                              </td>
                              <td>
                                <div className="input-group input-group-sm">
                                  <span className="input-group-text bg-light">$</span>
                                  <input
                                    type="text"
                                    className="form-control text-end"
                                    value={editMonto}
                                    onChange={(e) => setEditMonto(formatInputMil(e.target.value))}
                                    disabled={loadingAccion}
                                  />
                                </div>
                              </td>
                              <td className="text-center pe-3">
                                <div className="d-flex gap-1 justify-content-center">
                                  <button
                                    className="btn btn-success btn-sm py-0 px-1"
                                    onClick={() => guardarEdicion(costo.idCosto)}
                                    disabled={loadingAccion}
                                    title="Guardar"
                                  >
                                    <FaCheck style={{ fontSize: '11px' }} />
                                  </button>
                                  <button
                                    className="btn btn-outline-secondary btn-sm py-0 px-1"
                                    onClick={cancelarEdicion}
                                    disabled={loadingAccion}
                                    title="Cancelar"
                                  >
                                    <FaTimes style={{ fontSize: '11px' }} />
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>{costo.descripcion}</td>
                              <td className="text-end fw-bold text-success">{formatMoneda(costo.monto)}</td>
                              <td className="text-center pe-3">
                                <div className="d-flex gap-1 justify-content-center">
                                  <button
                                    className="btn btn-outline-primary btn-sm py-0 px-1"
                                    onClick={() => iniciarEdicion(costo)}
                                    disabled={loadingAccion}
                                    title="Editar"
                                  >
                                    <FaEdit style={{ fontSize: '11px' }} />
                                  </button>
                                  <button
                                    className="btn btn-outline-danger btn-sm py-0 px-1"
                                    onClick={() => handleEliminar(costo.idCosto)}
                                    disabled={loadingAccion}
                                    title="Eliminar"
                                  >
                                    <FaTrash style={{ fontSize: '11px' }} />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer bg-light border-0">
            <button type="button" className="btn btn-outline-secondary px-4" onClick={onHide}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostosObservacionModal;
