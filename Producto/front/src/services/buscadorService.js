const API_URL = 'http://localhost:8080/api/buscador';

/**
 * Realiza una búsqueda general de mensajes y observaciones
 * @param {string} query - Texto a buscar
 * @returns {Promise<Array>} Array de objetos SearchResultDTO
 */
export const buscarGeneral = async (query) => {
  try {
    const response = await fetch(`${API_URL}/general?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Error al realizar la búsqueda');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en buscarGeneral:', error);
    throw error;
  }
};
