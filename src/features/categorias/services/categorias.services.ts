import type {
  ICategoria,
  ICategoriaResponse,
} from "../types/categorias.types";

import { apiClient } from "../../../api/axiosInstance";

const endpoint = "/categorias";

export const getCategorias = async (): Promise<
  ICategoria[]
> => {
  try {
    const response =
      await apiClient.get<ICategoriaResponse>(
        endpoint
      );

    return response.data.data;
  } catch (error) {
    console.log(
      "Error trayendo categorias:",
      error
    );
    throw error;
  }
};

export const createCategoria = async (
  categoria: Omit<ICategoria, "id">
): Promise<ICategoria> => {
  try {
    const response =
      await apiClient.post<ICategoria>(
        endpoint,
        categoria
      );

    return response.data;
  } catch (error) {
    console.log(
      "Error creando categoria:",
      error
    );
    throw error;
  }
};

export const deleteCategoria = async (
  id: number
): Promise<void> => {
  try {
    await apiClient.delete(
      `${endpoint}/${id}`
    );
  } catch (error) {
    console.log(
      "Error eliminando categoria:",
      error
    );
    throw error;
  }
};

export const updateCategoria = async (
  id: number,
  categoria: Omit<ICategoria, "id">
): Promise<ICategoria> => {
  try {
    const response =
      await apiClient.patch<ICategoria>(
        `${endpoint}/${id}`,
        categoria
      );

    return response.data;
  } catch (error) {
    console.log(
      "Error actualizando categoria:",
      error
    );
    throw error;
  }
};