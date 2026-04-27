const API_BASE_URL = 'http://localhost:3000/api';

export const ticketService = {
  // Obtener tickets de una obra específica (ej: la obra id 1)
  getTicketsByObra: async (idObra: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/obra/${idObra}/detalle`);
      if (!response.ok) throw new Error('Error al obtener tickets');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error en ticketService:", error);
      return [];
    }
  },

  // Crear un nuevo ticket
  createTicket: async (ticketData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error al crear ticket:", error);
      throw error;
    }
  }
};
