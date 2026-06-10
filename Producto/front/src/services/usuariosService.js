const API_URL = 'http://localhost:8080/api';

export const usuariosService = {
  // Obtener todos los usuarios
  getAllUsuarios: async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getAllUsuarios:', error);
      throw error;
    }
  },

  // Obtener usuarios asignados a una obra
  getUsuariosByObra: async (idObra) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/obra/${idObra}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los usuarios de la obra');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getUsuariosByObra:', error);
      throw error;
    }
  },

  // Obtener usuario por ID
  getUsuarioById: async (idUsuario) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${idUsuario}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener el usuario');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getUsuarioById:', error);
      throw error;
    }
  },

  // Crear usuario
  createUsuario: async (usuarioData) => {
    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear el usuario');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en createUsuario:', error);
      throw error;
    }
  },

  // Actualizar usuario
  updateUsuario: async (idUsuario, usuarioData) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${idUsuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en updateUsuario:', error);
      throw error;
    }
  },

  // Eliminar usuario
  deleteUsuario: async (idUsuario) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${idUsuario}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }
      
      return await response.text();
    } catch (error) {
      console.error('Error en deleteUsuario:', error);
      throw error;
    }
  },
};

// Made with Bob
