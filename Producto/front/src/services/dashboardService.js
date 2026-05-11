const API_URL = 'http://localhost:8080/api/dashboard';

/**
 * Obtiene las estadísticas generales del dashboard
 * @returns {Promise<Object>} Objeto con totalTickets, ticketsAbiertos, observacionesAbiertas, observacionesAltaUrgencia
 */
export const obtenerEstadisticas = async () => {
  try {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) {
      throw new Error('Error al obtener estadísticas');
    }
    return await response.json();
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

// Made with Bob
