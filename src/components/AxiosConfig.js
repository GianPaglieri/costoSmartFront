import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://149.50.131.253/api'
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Suponiendo que has guardado el token en LocalStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token agregado al encabezado de autorización:', token); // Agrega este console.log para verificar que el token se esté agregando correctamente
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
