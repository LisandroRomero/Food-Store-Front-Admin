import type {
  Producto,
  ProductosResponse,
  CreateProductoDTO,
  UpdateProductoDTO,
  ProductoDisponibilidadDTO,
  ProductoFilters,
} from "../types/productos.type";

import { apiClient } from "../../../api/axiosInstance";

const endpoint = "/productos";

/* =========================
   GET ALL
========================= */
export const getProducts = async (
  offset = 0,
  limit = 20,
  nombre?: string
): Promise<ProductosResponse> => {
  try {
    const response =
      await apiClient.get<ProductosResponse>(
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
    console.error(
      "Error trayendo productos:",
      error
    );

    throw error;
  }
};

/* =========================
   GET BY ID
========================= */
export const getProductById = async (
  id: number
): Promise<Producto> => {
  try {
    const response =
      await apiClient.get<Producto>(
        `${endpoint}/${id}`
      );

    return response.data;
  } catch (error) {
    console.error(
      "Error trayendo producto:",
      error
    );

    throw error;
  }
};

/* =========================
   CREATE
========================= */
export const createProduct = async (
  productData: CreateProductoDTO
): Promise<Producto> => {
  try {
    const response =
      await apiClient.post<Producto>(
        endpoint,
        productData
      );

    return response.data;
  } catch (error) {
    console.error(
      "Error creando producto:",
      error
    );

    throw error;
  }
};

/* =========================
   UPDATE
========================= */
export const updateProduct = async (
  id: number,
  productData: UpdateProductoDTO
): Promise<Producto> => {
  try {
    const response =
      await apiClient.patch<Producto>(
        `${endpoint}/${id}`,
        productData
      );

    return response.data;
  } catch (error) {
    console.error(
      "Error actualizando producto:",
      error
    );

    throw error;
  }
};

/* =========================
   UPDATE DISPONIBILIDAD
========================= */
export const updateProductDisponibilidad =
  async (
    id: number,
    data: ProductoDisponibilidadDTO
  ): Promise<Producto> => {
    try {
      const response =
        await apiClient.patch<Producto>(
          `${endpoint}/${id}/disponibilidad`,
          data
        );

      return response.data;
    } catch (error) {
      console.error(
        "Error actualizando disponibilidad:",
        error
      );

      throw error;
    }
  };

/* =========================
   DELETE
========================= */
export const deleteProduct = async (
  id: number
): Promise<void> => {
  try {
    await apiClient.delete(
      `${endpoint}/${id}`
    );
  } catch (error) {
    console.error(
      "Error eliminando producto:",
      error
    );

    throw error;
  }
};