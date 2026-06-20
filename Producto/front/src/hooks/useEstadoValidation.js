/**
 * useEstadoValidation.js
 * Hook y funciones utilitarias para validar el estado de clientes y obras
 * antes de permitir la creación de obras, usuarios, tickets u observaciones.
 *
 * Reglas de negocio (CU-17):
 *   - Cliente "Inactivo"  → no se puede crear obra, usuario, ticket ni observación asociados.
 *   - Obra "Inactiva" o "Garantía Vencida" → no se puede crear ticket ni observación asociados.
 */

import { useState, useCallback } from 'react';

// ─── Helpers puros (sin hooks) ────────────────────────────────────────────────

/**
 * Devuelve true si el cliente está activo.
 * Acepta el objeto cliente completo o sólo la cadena de estado.
 */
export const clienteEstaActivo = (clienteOrEstado) => {
  if (!clienteOrEstado) return false;
  const estado =
    typeof clienteOrEstado === 'string'
      ? clienteOrEstado
      : clienteOrEstado.estado;
  return estado === 'Activo';
};

/**
 * Devuelve true si la obra permite crear tickets/observaciones.
 * Acepta el objeto obra completo o sólo la cadena de estado.
 */
export const obraEstaActiva = (obraOrEstado) => {
  if (!obraOrEstado) return false;
  const estado =
    typeof obraOrEstado === 'string'
      ? obraOrEstado
      : obraOrEstado.estadoObra || obraOrEstado.estado_obra;
  return estado === 'Activa';
};

/**
 * Mensaje de error estándar cuando el cliente está inactivo.
 */
export const mensajeClienteInactivo = (nombreEmpresa = 'El cliente') =>
  `${nombreEmpresa} está marcado como Inactivo. No es posible crear nuevas obras, usuarios, tickets u observaciones para este cliente. Actívalo primero en Gestión de Clientes.`;

/**
 * Mensaje de error estándar cuando la obra no está activa.
 */
export const mensajeObraNoActiva = (nombreObra = 'La obra', estadoObra = '') =>
  `"${nombreObra}" tiene estado "${estadoObra}". Solo se pueden crear tickets y observaciones en obras Activas.`;

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * useEstadoValidation
 *
 * Provee funciones para verificar el estado de un cliente u obra
 * consultando el backend en tiempo real, más un estado de error
 * centralizado para mostrarlo en el formulario.
 *
 * Uso:
 *   const { estadoError, limpiarEstadoError,
 *           validarCliente, validarObra } = useEstadoValidation();
 */
const useEstadoValidation = () => {
  const [estadoError, setEstadoError] = useState('');

  const limpiarEstadoError = useCallback(() => setEstadoError(''), []);

  /**
   * Consulta el backend y valida que el cliente esté Activo.
   * @param {number|string} idCliente
   * @returns {Promise<boolean>} true = válido, false = bloqueado
   */
  const validarCliente = useCallback(async (idCliente) => {
    if (!idCliente) return false;
    try {
      const res = await fetch(`http://localhost:8080/api/clientes/${idCliente}`);
      if (!res.ok) {
        setEstadoError('No se pudo verificar el estado del cliente.');
        return false;
      }
      const cliente = await res.json();
      if (!clienteEstaActivo(cliente)) {
        setEstadoError(mensajeClienteInactivo(cliente.nombreEmpresa));
        return false;
      }
      limpiarEstadoError();
      return true;
    } catch {
      setEstadoError('Error de conexión al verificar el cliente.');
      return false;
    }
  }, [limpiarEstadoError]);

  /**
   * Consulta el backend y valida que la obra esté Activa.
   * @param {number|string} idObra
   * @returns {Promise<boolean>} true = válido, false = bloqueado
   */
  const validarObra = useCallback(async (idObra) => {
    if (!idObra) return false;
    try {
      const res = await fetch(`http://localhost:8080/api/obras/${idObra}`);
      if (!res.ok) {
        setEstadoError('No se pudo verificar el estado de la obra.');
        return false;
      }
      const obra = await res.json();
      if (!obraEstaActiva(obra)) {
        setEstadoError(
          mensajeObraNoActiva(
            obra.nombreObra,
            obra.estadoObra || obra.estado_obra
          )
        );
        return false;
      }
      // Además verificar que el cliente de esa obra también esté activo
      if (obra.idCliente) {
        return await validarCliente(obra.idCliente);
      }
      limpiarEstadoError();
      return true;
    } catch {
      setEstadoError('Error de conexión al verificar la obra.');
      return false;
    }
  }, [validarCliente, limpiarEstadoError]);

  return {
    estadoError,
    setEstadoError,
    limpiarEstadoError,
    validarCliente,
    validarObra,
  };
};

export default useEstadoValidation;