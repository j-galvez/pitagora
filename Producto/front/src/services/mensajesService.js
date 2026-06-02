const API_URL = 'http://localhost:8080/api';

export const mensajesService = {
  getMensajesPorObservacion: async (idObservacion) => {
    const response = await fetch(`${API_URL}/mensajes/observacion/${idObservacion}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los mensajes de la observación');
    }

    return response.json();
  },

  crearMensaje: async ({ idObservacion, idUsuario, mensaje }, imagenFile) => {
    const formData = new FormData();
    formData.append(
      'mensaje',
      new Blob(
        [JSON.stringify({ idObservacion, idUsuario, mensaje: mensaje || null })],
        { type: 'application/json' }
      )
    );

    if (imagenFile) {
      formData.append('imagen', imagenFile);
    }

    const response = await fetch(`${API_URL}/mensajes`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al crear el mensaje');
    }

    return response.json();
  },
};
