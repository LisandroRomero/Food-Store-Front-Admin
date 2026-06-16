import { useEffect, useMemo } from "react";
import { usePedidosStore } from "../store/pedidos.store";
import { PedidoColumn } from "../components/PedidoColumn";
import { usePedidosRealtimeCocina } from "../hooks/usePedidosRealTimeCocina";

export default function CocinaKanbanPage() {
  const {
    pedidos,
    loading,
    loadPedidos,
    advancePedido,
  } = usePedidosStore();

  useEffect(() => {
    loadPedidos();
  }, [loadPedidos]);

  usePedidosRealtimeCocina();
  
  const groupedPedidos = useMemo(() => {
    return {
      
      CONFIRMADO: pedidos.filter(
        (p) => p.estado_codigo === "CONFIRMADO"
      ),
      EN_PREPARACION: pedidos.filter(
        (p) =>
          p.estado_codigo ===
          "EN_PREPARACION"
      )
     
    };
  }, [pedidos]);

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
            />
          )
        )}
      </div>
    </section>
  );
}