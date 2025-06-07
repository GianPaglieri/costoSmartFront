import axios from 'axios';
import { LoginController, sendAuthenticatedRequest } from './LoginController';
const baseUrl = 'http://149.50.131.253/api';


export const fetchListaPrecios = async () => {
  try {
    const token = await waitUntilTokenIsAvailable();
        console.log('Token utilizado para obtener ventas:', token);
        const response = await sendAuthenticatedRequest(`${baseUrl}/lista_precios`);
        console.log('Lista de precios', response);
    return response;
  } catch (error) {
    console.error('Error al obtener la lista de precios:', error);
    return [];
  }
};
export const fetchPrecioPorIdTorta = async (ID_TORTA) => {
  try {
    const response = await axios.get(`${baseUrl}/lista_precios/${ID_TORTA}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el precio de la torta:', error);
    return null;
  }
};


const waitUntilTokenIsAvailable = async () => {
  let token = LoginController.getToken();
  while (!token) {
      console.log('Esperando a que se obtenga un token de autenticación...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      token = LoginController.getToken();
  }
  return token;
};
