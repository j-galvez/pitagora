const API_URL = 'http://localhost:8080/api/reportes';

/**
 * Obtiene los datos para el reporte de trazabilidad de obras
 * @returns {Promise<Array>} Array de objetos ReporteObraDTO
 */
export const obtenerReporteTrazabilidad = async () => {
  try {
    const response = await fetch(`${API_URL}/trazabilidad-obras`);
    if (!response.ok) {
      throw new Error('Error al obtener el reporte de trazabilidad');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerReporteTrazabilidad:', error);
    throw error;
  }
};

/**
 * Obtiene los datos para el reporte de costos por obra
 * @returns {Promise<Array>} Array de objetos ObraCostoDTO
 */
export const obtenerReporteCostos = async () => {
  try {
    const response = await fetch(`${API_URL}/costos-por-obra`);
    if (!response.ok) {
      throw new Error('Error al obtener el reporte de costos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerReporteCostos:', error);
    throw error;
  }
};
