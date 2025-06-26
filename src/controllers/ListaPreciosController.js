import axios from 'axios';
import { LoginController, sendAuthenticatedRequest } from './LoginController';
const baseUrl = 'http://149.50.131.253/api';


export const fetchListaPrecios = async () => {
  try {
    const response = await sendAuthenticatedRequest(`${baseUrl}/lista_precios`);
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


const getToken = () => LoginController.getToken();
