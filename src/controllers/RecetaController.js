import axios from 'axios';
import { LoginController, sendAuthenticatedRequest } from './LoginController';

const baseUrl = 'http://149.50.131.253/api';

const getToken = () => LoginController.getToken();

// Función para obtener todas las recetas
export const fetchRecetas = async () => {
  try {
    const response = await sendAuthenticatedRequest(`${baseUrl}/recetas`);

    if (Array.isArray(response)) {
      return response;
    } else {
      console.error('Formato de respuesta inesperado:', response);
      return [];
    }
  } catch (error) {
    console.error('Error al obtener las recetas:', error.message);
    throw error;
  }
};

// Función para obtener una receta por ID
export const fetchRecetasById = async (ID_TORTA) => {
  try {
    const token = getToken();
    const response = await axios.get(`${baseUrl}/recetas/${ID_TORTA}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener la receta por ID:', error);
    throw error;
  }
};

// Función para agregar una nueva receta
export const agregarReceta = async (receta) => {
  try {
    const token = getToken();
    const response = await axios.post(`${baseUrl}/recetas`, receta, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error al agregar la receta:', error);
    return { success: false };
  }
};

// Función para agregar un nuevo ingrediente a una receta
export const agregarIngrediente = async (ID_TORTA, ID_INGREDIENTE, cantidad) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${baseUrl}/recetas/nueva-relacion`,
      { ID_TORTA, ID_INGREDIENTE, cantidad },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data && response.data.message === 'Nueva relación agregada exitosamente') {
      return { success: true, message: response.data.message };
    } else {
      console.error('Respuesta no válida del servidor al agregar ingrediente:', response.data);
      return { success: false, error: 'Respuesta no válida del servidor' };
    }
  } catch (error) {
    console.error('Error al agregar ingrediente:', error);
    return { success: false, error: 'Error al agregar ingrediente' };
  }
};

// Función para eliminar un ingrediente de una receta
export const eliminarIngrediente = async (ID_TORTA, ID_INGREDIENTE) => {
  try {
    const token = getToken();
    const response = await axios.delete(
      `${baseUrl}/recetas/${ID_TORTA}/${ID_INGREDIENTE}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 200) {
      return { success: true, message: 'Ingrediente eliminado exitosamente' };
    } else {
      console.error('Error al eliminar el ingrediente');
      return { success: false, error: 'Error al eliminar el ingrediente' };
    }
  } catch (error) {
    console.error('Error en la solicitud de borrado del ingrediente:', error);
    return { success: false, error: 'Error al eliminar el ingrediente' };
  }
};

// Función para editar una receta
export const editarReceta = async (receta) => {
  try {
    const { ID_TORTA, ID_INGREDIENTE, total_cantidad } = receta;

    // Verificar que los valores no sean undefined
    if (!ID_TORTA || !ID_INGREDIENTE || !total_cantidad) {
      throw new Error('Faltan datos de la receta');
    }

    const token = getToken();
    const response = await axios.put(
      `${baseUrl}/recetas/${ID_TORTA}/${ID_INGREDIENTE}`,
      { total_cantidad },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error al editar la receta:', error);
    return { success: false, error: error.message || 'Error interno' };
  }
};


// Función para borrar una receta
export const borrarReceta = async (id) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${baseUrl}/recetas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 204) {
      return { success: true };
    } else {
      console.error('Error al eliminar la receta');
      return { success: false, error: 'Error al eliminar la receta' };
    }
  } catch (error) {
    console.error('Error en la solicitud de borrado de la receta:', error);
    return { success: false, error };
  }
};

export { baseUrl };
