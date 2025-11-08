import api from '../components/AxiosConfig';

let authToken = null;
const getToken = () => authToken || localStorage.getItem('token');

export const sendAuthenticatedRequest = async (url) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No se ha obtenido un token de autenticación');
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error en sendAuthenticatedRequest:', error);
    throw error;
  }
};

const storeToken = (token) => {
  authToken = token;
  try {
    localStorage.setItem('token', token);
  } catch (_) {
    // ignore storage errors (e.g., SSR)
  }
};

const storeUserInfo = (user) => {
  try {
    if (user) {
      const normalized = {
        ...user,
        name: user.name || user.nombre || null,
        role: user.role || user.rol || 'Administrador',
      };
      localStorage.setItem('userInfo', JSON.stringify(normalized));
    } else {
      localStorage.removeItem('userInfo');
    }
  } catch (_) {
    // ignore storage errors
  }
};

export const LoginController = {
  loginUser: async (email, contrasena) => {
    try {
      const { data } = await api.post('/users/login', { email, contrasena });
      const { token, user } = data || {};

      if (!token) {
        throw new Error('No se recibió token en la respuesta');
      }

      storeToken(token);
      storeUserInfo(user ?? null);
      return { token, user: user ?? null };
    } catch (error) {
      console.error('Error en loginUser:', error);
      const serverErrors = error?.response?.data?.errors;
      const details = Array.isArray(serverErrors)
        ? serverErrors.map((e) => e?.msg || e?.message).filter(Boolean).join('. ')
        : null;
      const message =
        details ||
        error?.response?.data?.error ||
        error?.userMessage ||
        error?.message ||
        'Error al autenticar';
      throw new Error(message);
    }
  },

  getToken: () => getToken(),
};

export default LoginController;
