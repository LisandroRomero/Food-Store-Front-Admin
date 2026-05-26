import type {
  IIngrediente,
  IIngredienteCreate,
  IIngredienteUpdate,
  IIngredientePaginado,
} from "../types/ingredientes.type";

import { apiClient } from "../../../api/axiosInstance";

const endpoint = "/ingredientes";

/* =========================
   GET ALL
========================= */
export const getIngredientes = async (
  offset = 0,
  limit = 20,
  nombre?: string
): Promise<IIngredientePaginado> => {
  try {
    const response =
      await apiClient.get<IIngredientePaginado>(
        endpoint,
        {
          params: {
            offset,
            limit,
            ...(nombre && { nombre }),
          },
        }
      );

    return response.data;
  } catch (error) {
    console.log(
      "Error trayendo ingredientes:",
      error
    );
    throw error;
  }
};

/* =========================
   GET BY ID
========================= */
export const getIngredienteById = async (
  id: number
): Promise<IIngrediente> => {
  try {
    const response =
      await apiClient.get<IIngrediente>(
        `${endpoint}/${id}`
      );

    return response.data;
  } catch (error) {
    console.log(
      "Error trayendo ingrediente:",
      error
    );
    throw error;
  }
};

/* =========================
   CREATE
========================= */
export const createIngrediente = async (
  ingrediente: IIngredienteCreate
): Promise<IIngrediente> => {
  try {
    const response =
      await apiClient.post<IIngrediente>(
        `${endpoint}/`,
        ingrediente
      );

    return response.data;
  } catch (error) {
    console.log(
      "Error creando ingrediente:",
      error
    );
    throw error;
  }
};

/* =========================
   UPDATE
========================= */
export const updateIngrediente = async (
  id: number,
  ingrediente: IIngredienteUpdate
): Promise<IIngrediente> => {
  try {
    const response =
      await apiClient.patch<IIngrediente>(
        `${endpoint}/${id}`,
        ingrediente
      );

    return response.data;
  } catch (error) {
    console.log(
      "Error actualizando ingrediente:",
      error
    );
    throw error;
  }
};

/* =========================
   DELETE
========================= */
export const deleteIngrediente = async (
  id: number
): Promise<void> => {
  try {
    await apiClient.delete(
      `${endpoint}/${id}`
    );
  } catch (error) {
    console.log(
      "Error eliminando ingrediente:",
      error
    );
    throw error;
  }
};