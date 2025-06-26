import axios from 'axios';

const baseUrl = 'http://149.50.131.253/api';
let authToken = null;
const getToken = () => authToken || localStorage.getItem('token');

export const sendAuthenticatedRequest = async (url) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No se ha obtenido un token de autenticación');
    }
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error en sendAuthenticatedRequest:', error);
    throw error;
  }
};

const storeToken = (token) => {
  authToken = token;
};

export const LoginController = {
    loginUser: async (email, contrasena) => {
        try {
            const response = await axios.post(`${baseUrl}/login`, { email, contrasena });

            if (!response.data.token) {
                throw new Error('No se recibió token en la respuesta');
            }

            const token = response.data.token;
            storeToken(token);
            return token;
        } catch (error) {
            console.error('Error en loginUser:', error);
            throw new Error('Credenciales inválidas');
        }
    },

    getToken: () => getToken(),

    afterLogin: async (email, contrasena, action) => {
        try {
            await LoginController.loginUser(email, contrasena);
            const result = await action();
            return result;
        } catch (error) {
            console.error('Error en afterLogin:', error);
            throw error;
        }
    }
};

export default LoginController;