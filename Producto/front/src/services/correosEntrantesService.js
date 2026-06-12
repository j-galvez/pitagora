const API_URL = 'http://localhost:8080/api';

const getUsuarioParams = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const idUsuario = usuario.idUsuario || usuario.id_usuario;
  const rol = usuario.rol || '';
  const params = new URLSearchParams();
  if (idUsuario) params.append('id_usuario', idUsuario);
  if (rol) params.append('rol', rol);
  return params;
};

export const correosEntrantesService = {
  getGrupos: async () => {
    const params = getUsuarioParams();
    const response = await fetch(`${API_URL}/correos-entrantes?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al obtener los correos entrantes');
    }

    return response.json();
  },

  getDetalleGrupo: async (asuntoNormalizado, correo) => {
    const params = getUsuarioParams();
    params.append('asunto', asuntoNormalizado);
    params.append('correo', correo);

    const response = await fetch(`${API_URL}/correos-entrantes/detalle?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al obtener el detalle del grupo');
    }

    return response.json();
  },
};
