import axios from 'axios';
import {  sendAuthenticatedRequest } from './LoginController';
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


export const fetchTortas = async () => {
  try {
    const token = await waitUntilTokenIsAvailable();
    const response = await sendAuthenticatedRequest(`${baseUrl}/tortas`, token);
 
    return response; // Retorna la respuesta completa
  } catch (error) {
    console.error('Error al obtener las tortas:', error.message);
    throw error;
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

export const agregarTorta = async (torta) => {
  try {
    const token = await waitUntilTokenIsAvailable();
    console.log('Token utilizado para agregar la torta:', token);
    console.log('Datos de la torta a agregar:', torta); // Agregamos este console log

    const formData = new FormData();
    formData.append('nombre_torta', torta.nombre_torta);
    formData.append('descripcion_torta', torta.descripcion_torta);
    formData.append('imagen', torta.imagen);  // La imagen debe ser un objeto File

    // Imprime el contenido del FormData para depuración
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    const response = await axios.post(`${baseUrl}/tortas`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',  // Importante para manejar archivos
      }
    });

    console.log('Respuesta del servidor al agregar la torta:', response);
    return response.data;
  } catch (error) {
    console.error('Error al agregar la torta:', error);
    return { success: false };
  }
};




export const editarTorta = async (torta) => {
  try {
    const token = await waitUntilTokenIsAvailable();
    console.log('Token utilizado para editar la torta:', token);
    console.log('Datos del torta a editar:', torta);

    const formData = new FormData();
    formData.append('nombre_torta', torta.nombre_torta);
    formData.append('descripcion_torta', torta.descripcion_torta);

    // Solo incluir la imagen si fue modificada
    if (torta.imagen instanceof File) {
      formData.append('imagen', torta.imagen);
    }

    const response = await axios.put(`${baseUrl}/tortas/${torta.ID_TORTA}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    });

    console.log('Respuesta del servidor al editar torta:', response);
    return response.data;
  } catch (error) {
    console.error('Error al editar la torta:', error);
    return { success: false };
  }
};


export const borrarTorta = async (id) => {
  try {
    const token = await waitUntilTokenIsAvailable();
    console.log('Token utilizado para borrar la torta:', token); // Agregar este console log
    console.log('ID de la torta a borrar:', id); // Agregar este console log
    const response = await axios.delete(`${baseUrl}/tortas/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (response.status === 200) {
      console.log('Torta eliminada exitosamente');
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