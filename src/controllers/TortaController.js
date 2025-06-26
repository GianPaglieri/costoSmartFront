import axios from 'axios';
import { sendAuthenticatedRequest } from './LoginController';
import LoginController from './LoginController';

const baseUrl = 'http://149.50.131.253/api';

const getToken = () => LoginController.getToken();


export const fetchTortas = async () => {
  try {
    const response = await sendAuthenticatedRequest(`${baseUrl}/tortas`);
    return response; // Retorna la respuesta completa
  } catch (error) {
    console.error('Error al obtener las tortas:', error.message);
    throw error;
  }
};


export const agregarIngrediente = async (ingrediente) => {
  try {
    const token = getToken();
    const response = await axios.post(`${baseUrl}/ingredientes`, ingrediente, {
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

export const agregarTorta = async (torta) => {
  try {
    const token = getToken();

    const formData = new FormData();
    formData.append('nombre_torta', torta.nombre_torta);
    formData.append('descripcion_torta', torta.descripcion_torta);
    formData.append('imagen', torta.imagen);  // La imagen debe ser un objeto File


    const response = await axios.post(`${baseUrl}/tortas`, formData, {
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

    const response = await axios.put(`${baseUrl}/tortas/${torta.ID_TORTA}`, formData, {
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
    const response = await axios.delete(`${baseUrl}/tortas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { success: true };
    } else {
      console.error('Error al eliminar la torta:', response.data);
      return { success: false, error: response.data };
    }
  } catch (error) {
    console.error('Error en la solicitud de borrado de la torta:', error);
    return { success: false, error };
  }
};