import axios from 'axios';
import { LoginController, sendAuthenticatedRequest } from './LoginController';

const baseUrl = 'http://149.50.131.253/api';

export const obtenerVentas = async () => {
    try {
        const ventas = await sendAuthenticatedRequest(`${baseUrl}/ventas`);
        return ventas;
    } catch (error) {
        console.error('Error al obtener las ventas:', error.message);
        throw error;
    }
};

export const registrarVenta = async (idTorta, id_usuario) => {
  try {
    const token = LoginController.getToken();
    const response = await axios.post(
      `${baseUrl}/ventas`,
      { id_torta: idTorta, id_usuario },
      { headers: { Authorization: `Bearer ${token}` } }
    );
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
      const response = await sendAuthenticatedRequest(`${baseUrl}/ventas/cantidad`);
      return response;
  } catch (error) {
      console.error('Error al obtener la cantidad de ventas:', error);
      throw error;
  }
};

export const obtenerCantidadVentasSemanales = async () => {
  try {
      const response = await sendAuthenticatedRequest(`${baseUrl}/ventas/cantidad-semana`);
      return response;
  } catch (error) {
      console.error('Error al obtener la cantidad de ventas semanales:', error);
      throw error;
  }
};

export const obtenerPorcentajeVentas = async () => {
  try {
      const response = await sendAuthenticatedRequest(`${baseUrl}/ventas/porcentaje-ventas`);
      return response;
  } catch (error) {
      console.error('Error al obtener el porcentaje de ventas:', error);
      throw error;
  }
};

export const obtenerGanancias = async () => {
  try {
      const response = await sendAuthenticatedRequest(`${baseUrl}/ventas/ganancias`);
      return response;
  } catch (error) {
      console.error('Error al obtener ganancias:', error);
      throw error;
  }
};

