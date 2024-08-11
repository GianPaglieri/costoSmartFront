import axios from 'axios';

const baseUrl = 'http://localhost:3000';
let authToken = null;

export const sendAuthenticatedRequest = async (url) => {
    try {
        const token = authToken;
        
        if (!token) {
            throw new Error('No se ha obtenido un token de autenticación');
        }

        console.log('Token being sent:', token); // Add this line

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error al enviar la petición autenticada:', error.message);
        throw error;
    }
}

const storeToken = (token) => {
    authToken = token;
    console.log('Token almacenado:', authToken);
};

export const LoginController = {
    loginUser: async (email, contrasena) => {
        try {
            const response = await axios.post(`${baseUrl}/login`, { email, contrasena });
            const token = response.data.token;
            storeToken(token);
            console.log('Token obtained:', token);
            return token;
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
            throw new Error('Credenciales inválidas');
        }
    },

    getToken: () => {
        const token = authToken;
       
        return token;
    },

    afterLogin: async (email, contrasena, action) => {
        try {
            const token = await LoginController.loginUser(email, contrasena);
            return action();
        } catch (error) {
            console.error('Error en afterLogin:', error.message);
            throw error;
        }
    }
};

export default LoginController;
