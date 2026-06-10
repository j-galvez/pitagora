const API_URL = 'http://localhost:8080/api';

const postObservacion = async (observacionData, fotosFiles = []) => {
  const formData = new FormData();
  formData.append(
    'observacion',
    new Blob([JSON.stringify(observacionData)], { type: 'application/json' })
  );
  fotosFiles.forEach((file) => formData.append('fotos', file));

  const response = await fetch(`${API_URL}/observaciones`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al crear la observación');
  }

  return response.json();
};

export const observacionesService = {
  // Obtener todas las observaciones
  getAllObservaciones: async () => {
    try {
      const response = await fetch(`${API_URL}/observaciones`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener las observaciones');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getAllObservaciones:', error);
      throw error;
    }
  },

  // Obtener observaciones por ticket
  getObservacionesByTicket: async (idTicket) => {
    try {
      const response = await fetch(`${API_URL}/observaciones/ticket/${idTicket}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener las observaciones del ticket');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getObservacionesByTicket:', error);
      throw error;
    }
  },

  // Obtener observación por ID
  getObservacionById: async (idObservacion) => {
    try {
      const response = await fetch(`${API_URL}/observaciones/${idObservacion}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener la observación');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getObservacionById:', error);
      throw error;
    }
  },

  // Crear observación (sin fotos)
  createObservacion: async (observacionData) => {
    try {
      return await postObservacion(observacionData, []);
    } catch (error) {
      console.error('Error en createObservacion:', error);
      throw error;
    }
  },

  // Crear observación con fotos (máx. 2)
  createObservacionConFotos: async (observacionData, fotosFiles = []) => {
    try {
      return await postObservacion(observacionData, fotosFiles);
    } catch (error) {
      console.error('Error en createObservacionConFotos:', error);
      throw error;
    }
  },

  // Actualizar observación
  updateObservacion: async (idObservacion, observacionData) => {
    try {
      const response = await fetch(`${API_URL}/observaciones/${idObservacion}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(observacionData),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar la observación');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en updateObservacion:', error);
      throw error;
    }
  },

  // Eliminar observación
  deleteObservacion: async (idObservacion) => {
    try {
      const response = await fetch(`${API_URL}/observaciones/${idObservacion}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar la observación');
      }
      
      return await response.text();
    } catch (error) {
      console.error('Error en deleteObservacion:', error);
      throw error;
    }
  },

  // Obtener observaciones por estado
  getObservacionesByEstado: async (estado) => {
    try {
      const response = await fetch(`${API_URL}/observaciones/estado/${estado}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener las observaciones por estado');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getObservacionesByEstado:', error);
      throw error;
    }
  },

  // Obtener observaciones por urgencia
  getObservacionesByUrgencia: async (urgencia) => {
    try {
      const response = await fetch(`${API_URL}/observaciones/urgencia/${urgencia}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener las observaciones por urgencia');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getObservacionesByUrgencia:', error);
      throw error;
    }
  },
};

// Made with Bob
