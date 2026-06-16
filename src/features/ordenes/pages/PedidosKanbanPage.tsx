import { useCallback, useEffect, useMemo } from "react";
import { usePedidosStore } from "../store/pedidos.store";
import { PedidoColumn } from "../components/PedidoColumn";
import { usePedidosRealtime } from "../hooks/usePedidosRealTime";

export default function PedidosKanbanPage() {
  const {
    pedidos,
    loading,
    loadPedidos,
    advancePedido,
    cancelPedido,
  } = usePedidosStore();

  useEffect(() => {
    loadPedidos();
  }, [loadPedidos]);

  usePedidosRealtime();

  const groupedPedidos = useMemo(() => {
    return {
      PENDIENTE: pedidos.filter(
        (p) => p.estado_codigo === "PENDIENTE"
      ),
      CONFIRMADO: pedidos.filter(
        (p) => p.estado_codigo === "CONFIRMADO"
      ),
      EN_PREPARACION: pedidos.filter(
        (p) => p.estado_codigo === "EN_PREPARACION"
      ),
      ENTREGADO: pedidos.filter(
        (p) => p.estado_codigo === "ENTREGADO"
      ),
    };
  }, [pedidos]);

  const handleCancel = useCallback(
    (id: number, motivo: string) => {
      void cancelPedido(id, motivo);
    },
    [cancelPedido]
  );

  if (loading) {
    return (
      <div className="p-6">
        Cargando pedidos...
      </div>
    );
  }

  return (
    <section className="h-full overflow-x-auto p-6 lg:p-8">
      <h1 className="mb-6 text-2xl font-bold">
        Pedidos
      </h1>

      <div className="flex gap-6">
        {Object.entries(groupedPedidos).map(
          ([estado, pedidos]) => (
            <PedidoColumn
              key={estado}
              estado={estado}
              pedidos={pedidos}
              onAdvance={advancePedido}
              onCancel={handleCancel}
            />
          )
        )}
      </div>
    </section>
  );
}
