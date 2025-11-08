import api from '../components/AxiosConfig';
import { LoginController, sendAuthenticatedRequest } from './LoginController';

const getToken = () => LoginController.getToken();

// Función para obtener todas las recetas
export const fetchRecetas = async () => {
  try {
    const response = await sendAuthenticatedRequest(`/recetas`);

    if (!Array.isArray(response)) {
      console.error('Formato de respuesta inesperado:', response);
      return [];
    }

    return response.map((receta) => {
      const idTorta = receta?.ID_TORTA ?? receta?.idTorta ?? receta?.id_torta;
      const nombreTorta = receta?.nombre_torta ?? receta?.nombreTorta ?? receta?.nombre ?? '';
      const descripcion = receta?.descripcion ?? receta?.descripcion_torta ?? receta?.detalle ?? '';
      const imagen = receta?.imagen ?? receta?.imagen_torta ?? null;
      const totalCost = Number(receta?.costos?.total ?? receta?.costo_total ?? 0);

      const ingredientes = Array.isArray(receta?.ingredientes)
        ? receta.ingredientes.map((ing) => {
            const unitCostRaw = ing?.unit_cost ?? ing?.unitCost ?? 0;
            const cantidadRaw =
              ing?.total_cantidad ?? ing?.cantidad ?? ing?.totalCantidad ?? ing?.cantidad_total ?? 0;
            const subtotalRaw =
              ing?.subtotal_cost ?? ing?.subtotalCost ?? Number(unitCostRaw || 0) * Number(cantidadRaw || 0);

            return {
              ID_INGREDIENTE: ing?.ID_INGREDIENTE ?? ing?.idIngrediente ?? ing?.id ?? ing?.ID ?? null,
              Nombre: ing?.Nombre ?? ing?.nombre ?? '',
              total_cantidad: Number(cantidadRaw ?? 0),
              unit_cost: Number(unitCostRaw ?? 0),
              subtotal_cost: Number(subtotalRaw ?? 0),
            };
          })
        : [];

      const parsedId =
        idTorta !== undefined && idTorta !== null && !Number.isNaN(Number(idTorta))
          ? Number(idTorta)
          : idTorta;

      return {
        ID_TORTA: parsedId,
        nombre_torta: nombreTorta,
        descripcion,
        descripcion_torta: descripcion,
        imagen,
        imagen_torta: imagen,
        costos: { total: totalCost },
        ingredientes,
      };
    });
  } catch (error) {
    console.error('Error al obtener las recetas:', error.message);
    throw error;
  }
};

// Función para agregar un nuevo ingrediente a una receta
export const agregarIngrediente = async (ID_TORTA, ID_INGREDIENTE, cantidad) => {
  try {
    const token = getToken();
    const cantidadNum = Number(cantidad);
    if (Number.isNaN(cantidadNum)) {
      return { success: false, error: 'Cantidad inválida' };
    }
    const response = await api.post(
      `/recetas/nueva-relacion`,
      { ID_TORTA, ID_INGREDIENTE, cantidad: cantidadNum },
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
    const response = await api.delete(
      `/recetas/${ID_TORTA}/${ID_INGREDIENTE}`,
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
    const { ID_TORTA, ID_INGREDIENTE } = receta;
    // Aceptar 0 como valor válido; validar numérico
    const total_cantidad = receta.total_cantidad;
    const cantidadNum = total_cantidad === '' ? NaN : Number(total_cantidad);
    if (!ID_TORTA || !ID_INGREDIENTE || Number.isNaN(cantidadNum)) {
      throw new Error('Faltan datos de la receta o cantidad inválida');
    }

    const token = getToken();
    const response = await api.put(
      `/recetas/${ID_TORTA}/${ID_INGREDIENTE}`,
      { total_cantidad: cantidadNum },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error al editar la receta:', error);
    return { success: false, error: error.message || 'Error interno' };
  }
};
