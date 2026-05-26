import { create } from "zustand";

import type {
  IPedido,
  PedidoHistorialUpdate,
} from "../types/pedidos.type";

import {
  getPedidos,
  updatePedidoEstado,
} from "../services/pedidos.service";

interface PedidosStore {
  pedidos: IPedido[];

  loading: boolean;

  selectedPedido: IPedido | null;

  loadPedidos: () => Promise<void>;

  advancePedido: (
    id: number
  ) => Promise<void>;

  cancelPedido: (
    id: number,
    motivo?: string
  ) => Promise<void>;

  setSelectedPedido: (
    pedido: IPedido | null
  ) => void;
}

export const usePedidosStore =
  create<PedidosStore>((set, get) => ({
    pedidos: [],

    loading: false,

    selectedPedido: null,



    loadPedidos: async () => {
      try {
        set({ loading: true });

        const pedidos =
          await getPedidos();

        set({
          pedidos,
          loading: false,
        });
      } catch (error) {
        console.error(
          "Error cargando pedidos:",
          error
        );

        set({ loading: false });
      }
    },

    

    advancePedido: async (
      id: number
    ) => {
      try {
        const data: PedidoHistorialUpdate =
          {
            estado_bool: true,
          };

        const updatedPedido =
          await updatePedidoEstado(
            id,
            data
          );

        set({
          pedidos:
            get().pedidos.map(
              (pedido) =>
                pedido.id === id
                  ? updatedPedido
                  : pedido
            ),
        });
      } catch (error) {
        console.error(
          "Error avanzando pedido:",
          error
        );
      }
    },

   

    cancelPedido: async (
      id: number,
      motivo?: string
    ) => {
      try {
        const data: PedidoHistorialUpdate =
          {
            estado_bool: false,
            motivo,
          };

        const updatedPedido =
          await updatePedidoEstado(
            id,
            data
          );

        set({
          pedidos:
            get().pedidos.map(
              (pedido) =>
                pedido.id === id
                  ? updatedPedido
                  : pedido
            ),
        });
      } catch (error) {
        console.error(
          "Error cancelando pedido:",
          error
        );
      }
    },

   

    setSelectedPedido: (
      pedido
    ) => {
      set({
        selectedPedido: pedido,
      });
    },
  }));