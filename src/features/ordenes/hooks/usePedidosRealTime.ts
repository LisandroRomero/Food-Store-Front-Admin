
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
        case "PEDIDO_CREADO":
        case "PEDIDO_ACTUALIZADO":
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