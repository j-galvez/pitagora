const API_URL = 'http://localhost:8080/api';

export const costosObservacionService = {
  getCostosPorObservacion: async (idObservacion) => {
    const response = await fetch(`${API_URL}/costos-observacion/observacion/${idObservacion}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los costos de la observación');
    }

    return response.json();
  },

  crearCosto: async ({ idObservacion, monto, descripcion, idUsuario }) => {
    const response = await fetch(`${API_URL}/costos-observacion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idObservacion, monto, descripcion, idUsuario }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al crear el costo');
    }

    return response.json();
  },

  actualizarCosto: async (idCosto, { monto, descripcion }) => {
    const response = await fetch(`${API_URL}/costos-observacion/${idCosto}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monto, descripcion }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al actualizar el costo');
    }

    return response.json();
  },

  eliminarCosto: async (idCosto) => {
    const response = await fetch(`${API_URL}/costos-observacion/${idCosto}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al eliminar el costo');
    }

    return response.text();
  },
};
