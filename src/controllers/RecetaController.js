import axios from 'axios';

const baseUrl = 'http://localhost:3000';

export const fetchRecetas = async () => {
  try {
    const response = await axios.get(`${baseUrl}/recetas`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las recetas:', error);
    return [];
  }
};