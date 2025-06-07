import axios from 'axios';
import { sendAuthenticatedRequest } from './LoginController';
import LoginController from './LoginController';


const baseUrl = 'http://149.50.131.253/api';

const waitUntilTokenIsAvailable = async () => {
  let token = LoginController.getToken();
  while (!token) {
      console.log('Esperando a que se obtenga un token de autenticación...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      token = LoginController.getToken();
  }
  return token;
};

export const fetchIngredientes = async () => {
  try {
    const token = await waitUntilTokenIsAvailable();
    const { ingredientes } = await sendAuthenticatedRequest(`${baseUrl}/ingredientes`, token);
    return ingredientes;
  } catch (error) {
    console.error('Error al obtener los ingredientes:', error.message);
    throw error;
  }
};

export const fetchIngredientesMenosStock = async () => {
  try {
    const token = await waitUntilTokenIsAvailable();
    const response = await sendAuthenticatedRequest(`${baseUrl}/ingredientes/menosstock`, token);
    return response;
  } catch (error) {
    console.error('Error al obtener los ingredientes con menos stock:', error.message);
    return [];
  }
};

export const agregarIngrediente = async (ingrediente) => {
  try {
    const token = await waitUntilTokenIsAvailable();
    console.log('Token utilizado para agregar el ingrediente:', token); // Agregar este console log
    console.log('Datos del ingrediente a agregar:', ingrediente); // Agregar este console log
    const response = await axios.post(`${baseUrl}/ingredientes`, ingrediente, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    console.log('Respuesta del servidor al agregar ingrediente:', response); // Agregar este console log
    return response.data;
  } catch (error) {
    console.error('Error al agregar el ingrediente:', error);
    return { success: false };
  }
};

export const editarIngrediente = async (ingrediente) => {
  try {
    const token = await waitUntilTokenIsAvailable();
    console.log('Token utilizado para editar el ingrediente:', token); // Agregar este console log
    console.log('Datos del ingrediente a editar:', ingrediente); // Agregar este console log
    const response = await axios.put(`${baseUrl}/ingredientes/${ingrediente.id}`, ingrediente, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    console.log('Respuesta del servidor al editar ingrediente:', response); // Agregar este console log
    return response.data;
  } catch (error) {
    console.error('Error al editar el ingrediente:', error);
    return { success: false };
  }
};

export const borrarIngrediente = async (id) => {
  try {
    const token = await waitUntilTokenIsAvailable();
    console.log('Token utilizado para borrar el ingrediente:', token); // Agregar este console log
    console.log('ID del ingrediente a borrar:', id); // Agregar este console log
    const response = await axios.delete(`${baseUrl}/ingredientes/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (response.status === 200) {
      console.log('Ingrediente eliminado exitosamente');
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
