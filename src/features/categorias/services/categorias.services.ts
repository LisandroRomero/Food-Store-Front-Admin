import type {
  ICategoria,
  ICategoriaCreate,
  ICategoriaUpdate,
  ICategoriaPaginado,
} from "../types/categorias.types";

import { apiClient } from "../../../api/axiosInstance";

const endpoint = "/categorias";

/* =========================
   GET ALL (paginated)
========================= */
export const getCategorias = async (
  offset = 0,
  limit = 20,
  nombre?: string
): Promise<ICategoriaPaginado> => {
  try {
    const response = await apiClient.get<ICategoriaPaginado>(endpoint, {
      params: {
        offset,
        limit,
        ...(nombre && { nombre }),
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error trayendo categorias:", error);
    throw error;
  }
};

/* =========================
   GET BY ID
========================= */
export const getCategoriaById = async (
  id: number
): Promise<ICategoria> => {
  try {
    const response = await apiClient.get<ICategoria>(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error trayendo categoria:", error);
    throw error;
  }
};

/* =========================
   CREATE
========================= */
export const createCategoria = async (
  data: ICategoriaCreate
): Promise<ICategoria> => {
  try {
    const response = await apiClient.post<ICategoria>(`${endpoint}/`, data);
    return response.data;
  } catch (error) {
    console.log("Error creando categoria:", error);
    throw error;
  }
};

/* =========================
   UPDATE
========================= */
export const updateCategoria = async (
  id: number,
  data: ICategoriaUpdate
): Promise<ICategoria> => {
  try {
    const response = await apiClient.patch<ICategoria>(`${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    console.log("Error actualizando categoria:", error);
    throw error;
  }
};

/* =========================
   DELETE
========================= */
export const deleteCategoria = async (
  id: number
): Promise<void> => {
  try {
    await apiClient.delete(`${endpoint}/${id}`);
  } catch (error) {
    console.log("Error eliminando categoria:", error);
    throw error;
  }
};
