export const MAX_MONTO_DIGITOS = 8;
export const MAX_MONTO_VALOR = 99_999_999;
export const MENSAJE_MONTO_MAX_DIGITOS =
  'El monto no puede superar 8 dígitos.';

export const extraerDigitosMonto = (valor) => String(valor).replace(/\D/g, '');

export const limitarDigitosMonto = (valor) =>
  extraerDigitosMonto(valor).slice(0, MAX_MONTO_DIGITOS);

export const formatInputMonto = (valor) => {
  const num = limitarDigitosMonto(valor);
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const parseMonto = (valorFormateado) =>
  parseInt(String(valorFormateado).replace(/\./g, ''), 10) || 0;

export const esMontoValido = (monto) =>
  monto > 0 && extraerDigitosMonto(monto).length <= MAX_MONTO_DIGITOS;
