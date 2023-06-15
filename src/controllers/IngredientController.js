const API_URL = 'http://localhost:3000';

export const fetchIngredientes = async () => {
  try {
    const response = await fetch(`${API_URL}/ingredientes`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los ingredientes:', error);
    return [];
  }
};

export const agregarIngrediente = async (ingrediente) => {
  try {
    const response = await fetch(`${API_URL}/ingredientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingrediente),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al agregar el ingrediente:', error);
    return { success: false };
  }
};

export const editarIngrediente = async (ingrediente) => {
  try {
    const response = await fetch(`${API_URL}/ingredientes/${ingrediente.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingrediente),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al editar el ingrediente:', error);
    return { success: false };
  }
};

export const borrarIngrediente = async (id) => {
  console.log(`${API_URL}/ingredientes/${id}`);
  try {
    console.log(`${API_URL}/ingredientes/${id}`);
    const response = await fetch(`${API_URL}/ingredientes/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Ingrediente eliminado exitosamente');
      return { success: true };
    } else {
      const error = await response.json();
      console.error('Error al eliminar el ingrediente:', error);
      return { success: false, error };
    }
  } catch (error) {
    console.error('Error en la solicitud de borrado del ingrediente:', error);
    return { success: false, error };
  }
};







