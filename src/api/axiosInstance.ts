import axios, {
  type InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "./config";
import { useAuthStore } from "../features/users/store/useAuthStore";
import { requestRefresh } from "./authApi";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig
  ) => {
    const token =
      useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest?.url?.includes(
        "/auth/refresh"
      )
    ) {
      useAuthStore
        .getState()
        .clearSession();

      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse =
          await requestRefresh();

        const newAccessToken =
          refreshResponse.access_token;

        // Guardar nuevo access token
        useAuthStore.setState({
          accessToken: newAccessToken,
        });

        // Actualizar request original
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        return apiClient(originalRequest);
      } catch (refreshError) {
        useAuthStore
          .getState()
          .clearSession();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);