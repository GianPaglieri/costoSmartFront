import api from '../components/AxiosConfig';
import { LoginController, sendAuthenticatedRequest } from './LoginController';

export const obtenerVentas = async () => {
    try {
        const ventas = await sendAuthenticatedRequest(`/ventas`);
        return ventas;
    } catch (error) {
        console.error('Error al obtener las ventas:', error.message);
        throw error;
    }
};

export const registrarVenta = async (idTorta, id_usuario) => {
  try {
    const token = LoginController.getToken();
    const response = await api.post(
      `/ventas`,
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
      const response = await sendAuthenticatedRequest(`/ventas/cantidad`);
      return response;
  } catch (error) {
      console.error('Error al obtener la cantidad de ventas:', error);
      throw error;
  }
};

export const obtenerCantidadVentasSemanales = async () => {
  try {
      const response = await sendAuthenticatedRequest(`/ventas/cantidad-semana`);
      return response;
  } catch (error) {
      console.error('Error al obtener la cantidad de ventas semanales:', error);
      throw error;
  }
};

export const obtenerPorcentajeVentas = async () => {
  try {
      const response = await sendAuthenticatedRequest(`/ventas/porcentaje-ventas`);
      return response;
  } catch (error) {
      console.error('Error al obtener el porcentaje de ventas:', error);
      throw error;
  }
};

export const obtenerGanancias = async () => {
  try {
      const response = await sendAuthenticatedRequest(`/ventas/ganancias`);
      return response;
  } catch (error) {
      console.error('Error al obtener ganancias:', error);
      throw error;
  }
};

