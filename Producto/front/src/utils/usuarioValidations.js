export const validarCorreo = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

export const validarTelefono = (telefono) => /^\d{9}$/.test(telefono);

export const validarCamposObligatoriosUsuario = (formData, { requireObra = false } = {}) => {
  const fieldErrors = {};

  if (!formData.nombre?.trim()) {
    fieldErrors.nombre = 'El nombre es requerido.';
  }
  if (!formData.apellidoPaterno?.trim()) {
    fieldErrors.apellidoPaterno = 'El apellido paterno es requerido.';
  }
  if (!formData.apellidoMaterno?.trim()) {
    fieldErrors.apellidoMaterno = 'El apellido materno es requerido.';
  }
  if (!formData.correo || !validarCorreo(formData.correo)) {
    fieldErrors.correo = 'Ingrese un correo válido.';
  }
  if (!validarTelefono(formData.telefono)) {
    fieldErrors.telefono = 'El teléfono debe tener exactamente 9 dígitos.';
  }
  if (!formData.direccionCalle?.trim()) {
    fieldErrors.direccionCalle = 'La calle es requerida.';
  }
  if (!formData.idRegion) {
    fieldErrors.idRegion = 'Debe seleccionar una región.';
  }
  if (!formData.idComuna) {
    fieldErrors.idComuna = 'Debe seleccionar una comuna.';
  }
  if (!formData.rol?.trim()) {
    fieldErrors.rol = 'El rol es requerido.';
  }
  if (requireObra && !formData.idObra) {
    fieldErrors.idObra = 'Para el rol usuario debe asignarse una obra.';
  }

  const firstErrorField = Object.keys(fieldErrors)[0];
  const message = firstErrorField ? fieldErrors[firstErrorField] : '';

  return {
    ok: firstErrorField === undefined,
    message,
    fieldErrors,
  };
};
