export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGE_SIZE_MB = 10;
export const MENSAJE_IMAGEN_MUY_GRANDE =
  'La imagen supera el tamaño máximo permitido (10 MB). Seleccione un archivo de menor tamaño.';

export function esImagenValida(file) {
  return file && file.size <= MAX_IMAGE_SIZE_BYTES;
}
