import axios ,{ type AxiosError, type AxiosResponse} from 'axios';
import { API_BASE_URL } from './config';
import { useAuthStore } from '../store/useAuthStore';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
    (config) => {
        return config;
    }
)


apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Acceso no autorizado - redirigiendo a login');
      useAuthStore().getState().clearSesion()
    }
    return Promise.reject(error);
  }
);