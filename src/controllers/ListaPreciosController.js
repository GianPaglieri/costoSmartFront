import { sendAuthenticatedRequest } from './LoginController';

const toNumber = (value) => {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isNaN(value) ? null : value;
  }
  const parsed = parseFloat(String(value).replace(',', '.'));
  return Number.isNaN(parsed) ? null : parsed;
};

const normalizeListaPrecio = (item = {}) => {
  const costo = toNumber(item.costo_total);
  const precioLista = toNumber(item.precio_lista ?? item.precio ?? item.costo_total);
  const margen = toNumber(item.porcentaje_ganancia);

  return {
    ...item,
    costo_total: costo ?? 0,
    precio_lista: precioLista ?? costo ?? 0,
    porcentaje_ganancia: margen ?? 0,
  };
};

export const fetchListaPrecios = async () => {
  try {
    const response = await sendAuthenticatedRequest(`/lista_precios`);
    if (!Array.isArray(response)) {
      return [];
    }
    return response.map(normalizeListaPrecio);
  } catch (error) {
    console.error('Error al obtener la lista de precios:', error);
    return [];
  }
};
