import axios from 'axios';

const baseUrl = 'http://149.50.131.253/api';
let authToken = null;

export const sendAuthenticatedRequest = async (url) => {
    try {
        const token = authToken;
        
        if (!token) {
            console.error('Error en sendAuthenticatedRequest: No hay token almacenado');
            throw new Error('No se ha obtenido un token de autenticación');
        }

        console.log('Enviando petición autenticada a:', url);
        console.log('Token being sent:', token);

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Respuesta recibida:', response.status, response.data);
        return response.data;
    } catch (error) {
        console.error('Error en sendAuthenticatedRequest:', {
            message: error.message,
            response: error.response ? {
                status: error.response.status,
                data: error.response.data
            } : 'No response'
        });
        throw error;
    }
}

const storeToken = (token) => {
    authToken = token;
    console.log('Token almacenado en storeToken:', authToken);
};

export const LoginController = {
    loginUser: async (email, contrasena) => {
        try {
            console.log('Iniciando loginUser con:', { email, contrasena: contrasena ? '*****' : 'undefined' });
            console.log('URL de login:', `${baseUrl}/login`);
            
            const response = await axios.post(`${baseUrl}/login`, { email, contrasena })
                .catch(error => {
                    console.error('Error en axios.post:', {
                        message: error.message,
                        response: error.response ? {
                            status: error.response.status,
                            data: error.response.data
                        } : 'No response'
                    });
                    throw error;
                });

            console.log('Respuesta completa del servidor:', response);
            
            if (!response.data.token) {
                console.error('El servidor no devolvió un token en la respuesta:', response.data);
                throw new Error('No se recibió token en la respuesta');
            }

            const token = response.data.token;
            storeToken(token);
            console.log('Login exitoso, token obtenido:', token);
            return token;
        } catch (error) {
            console.error('Error en loginUser:', {
                message: error.message,
                stack: error.stack,
                response: error.response ? error.response.data : 'No response data'
            });
            throw new Error('Credenciales inválidas');
        }
    },

    getToken: () => {
        const token = authToken;
        console.log('Obteniendo token actual:', token);
        return token;
    },

    afterLogin: async (email, contrasena, action) => {
        try {
            console.log('Iniciando afterLogin con:', { email });
            const token = await LoginController.loginUser(email, contrasena);
            console.log('Token obtenido en afterLogin:', token);
            const result = await action();
            console.log('Action completada en afterLogin');
            return result;
        } catch (error) {
            console.error('Error en afterLogin:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }
};

export default LoginController;