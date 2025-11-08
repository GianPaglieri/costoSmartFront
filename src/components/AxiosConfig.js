import axios from 'axios';
import { isTokenValid } from '../utils/auth';

const DEFAULT_API_BASE = 'http://149.50.131.253/api';

const isLocalhost = () => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return /^(localhost|127\.|0\.0\.0\.0|192\.168\.|10\.)/.test(host);
};

const shouldUseProxy = () => process.env.NODE_ENV === 'development' && isLocalhost();

const resolveBaseURL = () => {
  if (shouldUseProxy()) {
    return '/api';
  }
  return process.env.REACT_APP_API_URL || DEFAULT_API_BASE;
};

const instance = axios.create({
  baseURL: resolveBaseURL(),
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
