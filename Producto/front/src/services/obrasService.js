const API_URL = 'http://localhost:8080/api';

export const obrasService = {
  // Obtener todas las obras
  getAllObras: async () => {
    try {
      const response = await fetch(`${API_URL}/obras`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener las obras');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getAllObras:', error);
      throw error;
    }
  },

  // Obtener obra por ID
  getObraById: async (idObra) => {
    try {
      const response = await fetch(`${API_URL}/obras/${idObra}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener la obra');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getObraById:', error);
      throw error;
    }
  },

  // Actualizar obra
  updateObra: async (idObra, obraData) => {
    try {
      const response = await fetch(`${API_URL}/obras/${idObra}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obraData),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar la obra');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en updateObra:', error);
      throw error;
    }
  },

  // Eliminar obra
  deleteObra: async (idObra) => {
    try {
      const response = await fetch(`${API_URL}/obras/${idObra}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar la obra');
      }
      
      return await response.text();
    } catch (error) {
      console.error('Error en deleteObra:', error);
      throw error;
    }
  },

  // Obtener observaciones de una obra
  getObservacionesByObra: async (idObra) => {
    try {
      const response = await fetch(`${API_URL}/obras/${idObra}/observaciones`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener las observaciones de la obra');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getObservacionesByObra:', error);
      throw error;
    }
  },

  // Obtener obras de un cliente
  getObrasByCliente: async (idCliente) => {
    try {
      const response = await fetch(`${API_URL}/obras/cliente/${idCliente}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener las obras del cliente');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getObrasByCliente:', error);
      throw error;
    }
  },
};

// Made with Bob
