const axios = require('axios');

const baseUrl = 'http://localhost:3000';

const registrarVenta = async (idTorta) => {
  try {
    const response = await axios.post(`${baseUrl}/ventas`, { id_torta: idTorta });
    return response.data;
  } catch (error) {
    console.error('Error al registrar la venta:', error);
    throw error;
  }
};

const obtenerCantidadVentas = async () => {
  try {
    const response = await axios.get(`${baseUrl}/ventas/cantidad`);
    const cantidadVentas = response.data.cantidadVentas;
    return cantidadVentas;
  } catch (error) {
    console.error(error);
    // Aquí podrías manejar el error adecuadamente, como lanzar una excepción o retornar un valor por defecto
    throw error;
  }
};

module.exports = {
  registrarVenta,
  obtenerCantidadVentas
};

