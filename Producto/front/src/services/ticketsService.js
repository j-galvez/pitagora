const API_URL = 'http://localhost:8080/api';

export const ticketsService = {
  // Obtener todos los tickets
  getAllTickets: async () => {
    try {
      const response = await fetch(`${API_URL}/tickets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener los tickets');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getAllTickets:', error);
      throw error;
    }
  },

  // Obtener ticket por ID
  getTicketById: async (idTicket) => {
    try {
      const response = await fetch(`${API_URL}/tickets/${idTicket}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener el ticket');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getTicketById:', error);
      throw error;
    }
  },

  // Actualizar ticket
  updateTicket: async (idTicket, ticketData) => {
    try {
      const response = await fetch(`${API_URL}/tickets/${idTicket}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el ticket');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en updateTicket:', error);
      throw error;
    }
  },

  // Eliminar ticket
  deleteTicket: async (idTicket) => {
    try {
      const response = await fetch(`${API_URL}/tickets/${idTicket}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el ticket');
      }
      
      return await response.text();
    } catch (error) {
      console.error('Error en deleteTicket:', error);
      throw error;
    }
  },
};

// Made with Bob
