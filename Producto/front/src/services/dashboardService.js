const API_URL = 'http://localhost:8080/api/dashboard';

const API_BASE = 'http://localhost:8080/api';

const contarObservacionesTerminadas = async () => {
  const response = await fetch(`${API_BASE}/observaciones`);
  if (!response.ok) return 0;
  const observaciones = await response.json();
  return observaciones.filter((o) =>
    (o.estadoObservacion || o.estado_observacion || '').toLowerCase() === 'terminado'
  ).length;
};

/**
 * Obtiene las estadísticas generales del dashboard
 * @returns {Promise<Object>} Objeto con totalTickets, ticketsAbiertos, observacionesAbiertas, observacionesTerminadas, etc.
 */
export const obtenerEstadisticas = async () => {
  try {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) {
      throw new Error('Error al obtener estadísticas');
    }
    const data = await response.json();

    let observacionesTerminadas = data.observacionesTerminadas;
    if (observacionesTerminadas === undefined || observacionesTerminadas === null) {
      observacionesTerminadas = await contarObservacionesTerminadas();
    }

    return {
      totalTickets: data.totalTickets ?? 0,
      ticketsAbiertos: data.ticketsAbiertos ?? 0,
      observacionesAbiertas: data.observacionesAbiertas ?? 0,
      observacionesTerminadas,
      observacionesAltaUrgencia: data.observacionesAltaUrgencia ?? 0,
      clientesActivos: data.clientesActivos ?? 0,
      obrasActivas: data.obrasActivas ?? 0,
    };
  } catch (error) {
    console.error('Error en obtenerEstadisticas:', error);
    throw error;
  }
};

/**
 * Obtiene el top 5 de fallas más reportadas
 * @returns {Promise<Array>} Array de objetos con nombreCategoria y cantidad
 */
export const obtenerTopFallas = async () => {
  try {
    const response = await fetch(`${API_URL}/top-fallas`);
    if (!response.ok) {
      throw new Error('Error al obtener top fallas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerTopFallas:', error);
    throw error;
  }
};

/**
 * Obtiene el top 5 de obras con mayor costo acumulado
 * @returns {Promise<Array>} Array de objetos con idObra, nombreObra y montoTotal
 */
export const obtenerTopObrasPorCosto = async () => {
  try {
    const response = await fetch(`${API_URL}/top-obras-costo`);
    if (!response.ok) {
      throw new Error('Error al obtener top obras por costo');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerTopObrasPorCosto:', error);
    throw error;
  }
};

/**
 * Obtiene las obras asociadas a una categoría (drill-down)
 * @param {string} nombreCategoria - Nombre de la categoría
 * @returns {Promise<Array>} Array de objetos con idObra, nombreObra y cantidad
 */
export const obtenerObrasPorCategoria = async (nombreCategoria) => {
  try {
    const response = await fetch(`${API_URL}/obras-por-categoria?categoria=${encodeURIComponent(nombreCategoria)}`);
    if (!response.ok) {
      throw new Error('Error al obtener obras por categoría');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerObrasPorCategoria:', error);
    throw error;
  }
};

// Made with Bob
