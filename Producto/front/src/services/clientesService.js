const API_URL = 'http://localhost:8080/api';

export const clientesService = {
  // Obtener todos los clientes
  getAllClientes: async () => {
    try {
      const response = await fetch(`${API_URL}/clientes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener los clientes');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getAllClientes:', error);
      throw error;
    }
  },

  // Obtener cliente por ID
  getClienteById: async (idCliente) => {
    try {
      const response = await fetch(`${API_URL}/clientes/${idCliente}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener el cliente');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getClienteById:', error);
      throw error;
    }
  },

  // Actualizar cliente
  updateCliente: async (idCliente, clienteData) => {
    try {
      const response = await fetch(`${API_URL}/clientes/${idCliente}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el cliente');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en updateCliente:', error);
      throw error;
    }
  },

  // Eliminar cliente
  deleteCliente: async (idCliente) => {
    try {
      const response = await fetch(`${API_URL}/clientes/${idCliente}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el cliente');
      }
      
      return await response.text();
    } catch (error) {
      console.error('Error en deleteCliente:', error);
      throw error;
    }
  },
};

// Made with Bob
