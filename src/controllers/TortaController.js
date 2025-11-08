import api from '../components/AxiosConfig';
import { sendAuthenticatedRequest } from './LoginController';
import LoginController from './LoginController';

const getToken = () => LoginController.getToken();

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

const normalizeTortaResponse = (item = {}) => {
  const costo = toNumber(item.costo_total);
  const precioLista = toNumber(item.precio_lista ?? item.precio);
  const margen = toNumber(item.porcentaje_ganancia);

  return {
    ...item,
    costo_total: costo ?? 0,
    precio_lista: precioLista ?? costo ?? 0,
    porcentaje_ganancia: margen ?? 0,
  };
};

export const fetchTortas = async () => {
  try {
    const response = await sendAuthenticatedRequest('tortas/tortas-con-precios');
    if (!Array.isArray(response)) {
      return [];
    }
    return response.map(normalizeTortaResponse);
  } catch (error) {
    console.error('Error al obtener las tortas:', error.message);
    throw error;
  }
};


export const agregarTorta = async (torta) => {
  try {
    const token = getToken();

    const formData = new FormData();
    formData.append('nombre_torta', torta.nombre_torta);
    formData.append('descripcion_torta', torta.descripcion_torta);
    if (torta.imagen instanceof File) {
      formData.append('imagen', torta.imagen);
    }
    formData.append('porcentaje_ganancia', torta.porcentaje_ganancia ?? 0);

    const response = await api.post(`/tortas`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al agregar la torta:', error);
    return { success: false };
  }
};




export const editarTorta = async (torta) => {
  try {
    const token = getToken();

    const formData = new FormData();
    formData.append('nombre_torta', torta.nombre_torta);
    formData.append('descripcion_torta', torta.descripcion_torta);

    // Solo incluir la imagen si fue modificada
    if (torta.imagen instanceof File) {
      formData.append('imagen', torta.imagen);
    }
    formData.append('porcentaje_ganancia', torta.porcentaje_ganancia ?? 0);

    const response = await api.put(`/tortas/${torta.ID_TORTA}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al editar la torta:', error);
    return { success: false };
  }
};


export const borrarTorta = async (id) => {
  try {
    const token = getToken();
    const response = await api.delete(`/tortas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { success: true };
    } else {
      console.error('Error al eliminar la torta:', response.data);
      const payload = response.data || {};
      return {
        success: false,
        error: payload.error || payload.message || 'Error al eliminar la torta',
      };
    }
  } catch (error) {
    console.error('Error en la solicitud de borrado de la torta:', error);
    const payload = error?.response?.data || {};
    const message =
      payload.error ||
      payload.message ||
      error?.userMessage ||
      error?.message ||
      'Error al eliminar la torta';
    return { success: false, error: message };
  }
};
