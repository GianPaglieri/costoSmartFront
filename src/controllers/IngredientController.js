import api from '../components/AxiosConfig';
import { sendAuthenticatedRequest } from './LoginController';
import LoginController from './LoginController';

const getToken = () => LoginController.getToken();

export const fetchIngredientes = async () => {
  try {
    const { ingredientes } = await sendAuthenticatedRequest(`/ingredientes`);
    return ingredientes;
  } catch (error) {
    console.error('Error al obtener los ingredientes:', error.message);
    throw error;
  }
};

export const fetchIngredientesMenosStock = async () => {
  try {
    const response = await sendAuthenticatedRequest(`/ingredientes/menosstock`);
    return response;
  } catch (error) {
    console.error('Error al obtener los ingredientes con menos stock:', error.message);
    return [];
  }
};

export const agregarIngrediente = async (ingrediente) => {
  try {
    const token = getToken();
    const response = await api.post(`/ingredientes`, ingrediente, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al agregar el ingrediente:', error);
    return { success: false };
  }
};

export const editarIngrediente = async (ingrediente) => {
  try {
    const token = getToken();
    const response = await api.put(`/ingredientes/${ingrediente.id}`, ingrediente, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al editar el ingrediente:', error);
    return { success: false };
  }
};

export const borrarIngrediente = async (id) => {
  try {
    const token = getToken();
    const response = await api.delete(`/ingredientes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { success: true };
    } else {
      console.error('Error al eliminar el ingrediente:', response.data);
      const payload = response.data || {};
      return {
        success: false,
        error: payload.error || 'Error al eliminar el ingrediente',
        recetas: payload.details?.recetas ?? [],
      };
    }
  } catch (error) {
    console.error('Error en la solicitud de borrado del ingrediente:', error);
    const payload = error?.response?.data || {};
    const recetas = Array.isArray(payload.details?.recetas) ? payload.details.recetas : [];
    const message =
      payload.error ||
      payload.message ||
      error?.message ||
      'Error al eliminar el ingrediente';
    return { success: false, error: message, recetas };
  }
};
