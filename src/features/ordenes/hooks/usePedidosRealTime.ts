
import { useCallback } from "react";

import { useWebSocket, type WsMessage } from "../../../hooks/useWebSocket";
import { usePedidosStore } from "../store/pedidos.store";

export function usePedidosRealtime(enabled = true) {
  const loadPedidos = usePedidosStore(
    (state) => state.loadPedidos,
  );

  const handleMessage = useCallback(
    (msg: WsMessage) => {
      switch (msg.event) {
        case "WS_CONNECTED":
        case "NUEVO_PEDIDO":
        case "PEDIDO_CONFIRMADO":
        case "PEDIDO_EN_PREPARACION":
        case "PEDIDO_ENTREGADO":
        case "PEDIDO_CANCELADO":
          void loadPedidos();
          break;

        default:
          break;
      }
    },
    [loadPedidos],
  );

  useWebSocket({
    enabled,
    onMessage: handleMessage,
  });
}