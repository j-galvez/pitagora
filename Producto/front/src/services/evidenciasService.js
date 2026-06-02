const API_URL = 'http://localhost:8080/api';

export const evidenciasService = {
  getEvidenciasPorObservacion: async (idObservacion) => {
    const response = await fetch(`${API_URL}/evidencias/observacion/${idObservacion}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las evidencias de la observación');
    }

    return response.json();
  },
};
