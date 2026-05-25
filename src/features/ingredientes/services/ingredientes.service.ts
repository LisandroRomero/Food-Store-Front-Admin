import type {
  IIngrediente,
  IIngredienteResponse,
  CreateIngrediente,
  UpdateIngrediente,
} from "../types/ingredientes.type";

import { apiClient } from "../../../api/axiosInstance";

const endpoint = "/ingredientes";

export const getIngredientes = async (): Promise<
  IIngrediente[]
> => {
  try {
    const response =
      await apiClient.get<IIngredienteResponse>(
        endpoint
      );

    return response.data.data;
  } catch (error) {
    console.log(
      "Error trayendo ingredientes:",
      error
    );
    throw error;
  }
};

export const createIngrediente = async (
  ingrediente: CreateIngrediente
): Promise<IIngrediente> => {
  try {
    const response =
      await apiClient.post<IIngrediente>(
        endpoint,
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

export const updateIngrediente = async (
  id: number,
  ingrediente: UpdateIngrediente
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