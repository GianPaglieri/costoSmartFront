import axios from 'axios';
import { sendAuthenticatedRequest } from './LoginController';
import LoginController from './LoginController';


const baseUrl = 'http://149.50.131.253/api';

const getToken = () => LoginController.getToken();

export const fetchIngredientes = async () => {
  try {
    const { ingredientes } = await sendAuthenticatedRequest(`${baseUrl}/ingredientes`);
    return ingredientes;
  } catch (error) {
    console.error('Error al obtener los ingredientes:', error.message);
    throw error;
  }
};

export const fetchIngredientesMenosStock = async () => {
  try {
    const response = await sendAuthenticatedRequest(`${baseUrl}/ingredientes/menosstock`);
    return response;
  } catch (error) {
    console.error('Error al obtener los ingredientes con menos stock:', error.message);
    return [];
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

export const editarIngrediente = async (ingrediente) => {
  try {
    const token = getToken();
    const response = await axios.put(`${baseUrl}/ingredientes/${ingrediente.id}`, ingrediente, {
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
    const response = await axios.delete(`${baseUrl}/ingredientes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return { success: true };
    } else {
      console.error('Error al eliminar el ingrediente:', response.data);
      return { success: false, error: response.data };
    }
  } catch (error) {
    console.error('Error en la solicitud de borrado del ingrediente:', error);
    return { success: false, error };
  }
};
