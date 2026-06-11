import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "./config";
import { useAuthStore } from "../features/users/store/useAuthStore";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig
  ) => {
    const token =
      useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`, 
          {}, 
          { withCredentials: true } 
        );

        const newAccessToken = response.data.access_token;

        
        useAuthStore.setState({ accessToken: newAccessToken });

        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        
        useAuthStore.getState().clearSession();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },

  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn(
        "Acceso no autorizado - cerrando sesión"
      );

      useAuthStore
        .getState()
        .clearSession();
    }

    return Promise.reject(error);
  }
);