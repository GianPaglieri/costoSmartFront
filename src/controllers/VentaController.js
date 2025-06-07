import axios from 'axios';
import { LoginController, sendAuthenticatedRequest } from './LoginController';

const baseUrl = 'http://149.50.131.253/api';

export const obtenerVentas = async () => {
    try {
        const token = await waitUntilTokenIsAvailable();
       
        const ventas = await sendAuthenticatedRequest(`${baseUrl}/ventas`);
       
        return ventas;
    } catch (error) {
        console.error('Error al obtener las ventas:', error.message);
        throw error;
    }
};

export const registrarVenta = async (idTorta, id_usuario) => {
  try {
    const token = await waitUntilTokenIsAvailable();
    console.log('Token utilizado para registrar la venta:', token); // Agregar este console log
    console.log('ID de la torta a vender:', idTorta); // Agregar este console log
    const response = await axios.post(`${baseUrl}/ventas`, {
      id_torta: idTorta,
      id_usuario: id_usuario // Incluye el ID del usuario en los datos enviados al servidor
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Respuesta del servidor al registrar venta:', response); // Agregar este console log
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      // Si hay una respuesta de error del servidor, devolverla para manejarla en el componente
      return error.response.data;
    } else {
      // Si no hay una respuesta de error del servidor, lanzar el error para manejarlo de manera general
      console.error('Error al registrar la venta:', error);
      throw error;
    }
  }
};


export const obtenerCantidadVentas = async () => {
  try {
      const token = await waitUntilTokenIsAvailable(); // Esperar hasta que el token esté disponible

      
      const response = await sendAuthenticatedRequest(`${baseUrl}/ventas/cantidad`);
     
      return response;
  } catch (error) {
      console.error('Error al obtener la cantidad de ventas:', error);
      throw error;
  }
};

export const obtenerCantidadVentasSemanales = async () => {
  try {
      const token = await waitUntilTokenIsAvailable();
    
      const response = await sendAuthenticatedRequest(`${baseUrl}/ventas/cantidad-semana`);
      console.log('Respuesta del servidor cuando obtengo las ventas semanales:', response); // Agregar este console log
      return response;
  } catch (error) {
      console.error('Error al obtener la cantidad de ventas semanales:', error);
      throw error;
  }
};

export const obtenerPorcentajeVentas = async () => {
  try {
      const token = await waitUntilTokenIsAvailable();
   
      const response = await sendAuthenticatedRequest(`${baseUrl}/ventas/porcentaje-ventas`);
      console.log('Respuesta del servidor cuando obtengo las ventas semanales:', response); // Agregar este console log
      return response;
  } catch (error) {
      console.error('Error al obtener el porcentaje de ventas:', error);
      throw error;
  }
};

export const obtenerGanancias = async () => {
  try {
      const token = await waitUntilTokenIsAvailable(); // Esperar hasta que el token esté disponible
      
      const response = await sendAuthenticatedRequest(`${baseUrl}/ventas/ganancias`);
      
      return response;
  } catch (error) {
      console.error('Error al obtener ganancias:', error);
      throw error;
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

const handleTokenExpiration = () => {
    console.error('El token de autenticación ha expirado o es inválido');
};

const handleGeneralError = (error) => {
    console.error('Ocurrió un error:', error.message);
    throw error;
};
