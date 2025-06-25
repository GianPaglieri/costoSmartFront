import axios from 'axios';
import { isTokenValid } from '../utils/auth';

const instance = axios.create({
  baseURL: 'http://149.50.131.253/api'
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token && !isTokenValid(token)) {
      localStorage.removeItem('token');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
