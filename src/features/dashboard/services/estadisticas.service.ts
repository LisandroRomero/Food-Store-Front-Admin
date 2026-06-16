import type {
  ResumenResponse,
  VentasPeriodoItem,
  ProductoTopItem,
  PedidosEstadoItem,
  IngresosResponse,
} from "../types/estadisticas.types";

import { apiClient } from "../../../api/axiosInstance";

const endpoint = "/estadisticas";

export const getResumen = async (): Promise<ResumenResponse> => {
  try {
    const response =
      await apiClient.get<ResumenResponse>(
        `${endpoint}/resumen`
      );

    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener resumen de estadísticas:",
      error
    );

    throw error;
  }
};

function ultimos30Dias() {
  const hoy = new Date();
  const desde = new Date();
  desde.setDate(desde.getDate() - 30);
  return {
    desde: desde.toISOString().split("T")[0],
    hasta: hoy.toISOString().split("T")[0],
  };
}

export const getVentasPeriodo = async (
  desde?: string,
  hasta?: string,
  agrupacion?: "day" | "week" | "month"
): Promise<VentasPeriodoItem[]> => {
  try {
    const { desde: d, hasta: h } = ultimos30Dias();

    const response =
      await apiClient.get<VentasPeriodoItem[]>(
        `${endpoint}/ventas`,
        {
          params: {
            desde: desde ?? d,
            hasta: hasta ?? h,
            ...(agrupacion && { agrupacion }),
          },
        }
      );

    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener ventas por período:",
      error
    );

    throw error;
  }
};

export const getProductosTop = async (
  limit = 5
): Promise<ProductoTopItem[]> => {
  try {
    const response =
      await apiClient.get<ProductoTopItem[]>(
        `${endpoint}/productos-top/${limit}`
      );

    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener productos top:",
      error
    );

    throw error;
  }
};

export const getPedidosPorEstado =
  async (): Promise<PedidosEstadoItem[]> => {
    try {
      const response =
        await apiClient.get<PedidosEstadoItem[]>(
          `${endpoint}/pedidos-por-estado`
        );

      return response.data;
    } catch (error) {
      console.error(
        "Error al obtener pedidos por estado:",
        error
      );

      throw error;
    }
  };

export const getIngresos = async (
  desde?: string,
  hasta?: string
): Promise<IngresosResponse[]> => {
  try {
    const { desde: d, hasta: h } = ultimos30Dias();

    const response =
      await apiClient.get<IngresosResponse[]>(
        `${endpoint}/ingresos`,
        {
          params: {
            desde: desde ?? d,
            hasta: hasta ?? h,
          },
        }
      );

    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener ingresos:",
      error
    );

    throw error;
  }
};
