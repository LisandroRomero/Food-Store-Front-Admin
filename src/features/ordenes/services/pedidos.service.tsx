import type {
  IPedido,
  IPedidoCreate,
  PedidoHistorialUpdate,
} from "../types/pedidos.type";

import { apiClient } from "../../../api/axiosInstance";

const endpoint = "/pedidos";


export const getPedidos =
  async (): Promise<IPedido[]> => {
    try {
      const response =
        await apiClient.get<IPedido[]>(
          endpoint
        );

      return response.data ?? [];
    } catch (error) {
      console.error(
        "Error trayendo pedidos:",
        error
      );

      throw error;
    }
  };


export const getPedidoById = async (
  id: number
): Promise<IPedido> => {
  try {
    const response =
      await apiClient.get<IPedido>(
        `${endpoint}/${id}`
      );

    return response.data;
  } catch (error) {
    console.error(
      "Error trayendo pedido:",
      error
    );

    throw error;
  }
};


export const createPedido = async (
  pedidoData: IPedidoCreate
): Promise<IPedido> => {
  try {
    const response =
      await apiClient.post<IPedido>(
        endpoint,
        pedidoData
      );

    return response.data;
  } catch (error) {
    console.error(
      "Error creando pedido:",
      error
    );

    throw error;
  }
};


export const updatePedidoEstado =
  async (
    id: number,
    data: PedidoHistorialUpdate
  ): Promise<IPedido> => {
    try {
      const response =
        await apiClient.patch<IPedido>(
          `${endpoint}/${id}`,
          data
        );

      return response.data;
    } catch (error) {
      console.error(
        "Error actualizando estado del pedido:",
        error
      );

      throw error;
    }
  };


export const deletePedido = async (
  id: number
): Promise<void> => {
  try {
    await apiClient.delete(
      `${endpoint}/${id}`
    );
  } catch (error) {
    console.error(
      "Error eliminando pedido:",
      error
    );

    throw error;
  }
};