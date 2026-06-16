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

  const { activos, cerrados } = useMemo(() => {
    const mapa: Record<string, typeof pedidos> = {
      CONFIRMADO: pedidos.filter(
        (p) => p.estado_codigo === "CONFIRMADO"
      ),
      EN_PREPARACION: pedidos.filter(
        (p) => p.estado_codigo === "EN_PREPARACION"
      ),
    };
    const cerradosList = pedidos.filter(
      (p) =>
        p.estado_codigo === "ENTREGADO" ||
        p.estado_codigo === "CANCELADO"
    );
    return { activos: mapa, cerrados: cerradosList };
  }, [pedidos]);

  if (loading) {
    return (
      <div className="p-6">
        Cargando pedidos...
      </div>
    );
  }

  return (
    <section className="flex h-full flex-col overflow-hidden p-6 lg:p-8">
      <h1 className="mb-6 text-2xl font-bold shrink-0">
        Cocina
      </h1>

      {/* Kanban activo */}
      <div className="flex-1 flex gap-6 overflow-x-auto">
        {Object.entries(activos).map(([estado, pedidos]) => (
          <PedidoColumn
            key={estado}
            estado={estado}
            pedidos={pedidos}
            onAdvance={advancePedido}
          />
        ))}
      </div>

      {/* Historial colapsable */}
      {cerrados.length > 0 && (
        <details className="group mt-6 shrink-0">
          <summary className="cursor-pointer select-none list-none flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            <span className="transition-transform group-open:rotate-90 inline-block">
              ▶
            </span>
            Historial ({cerrados.length})
          </summary>
          <div className="mt-3 bg-white rounded-xl border border-slate-200 overflow-hidden opacity-70">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">ID</th>
                  <th className="px-5 py-3 text-left">Descripción</th>
                  <th className="px-5 py-3 text-left">Total</th>
                  <th className="px-5 py-3 text-left">Estado</th>
                  <th className="px-5 py-3 text-left">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cerrados.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3 text-slate-400">#{p.id}</td>
                    <td className="px-5 py-3 text-slate-500">
                      {p.detalle_pedidos
                        .map((d) => `${d.cantidad}x ${d.nombre_snapshot}`)
                        .join(", ")}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      ${Number(p.total).toFixed(2)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          p.estado_codigo === "ENTREGADO"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {p.estado_codigo === "ENTREGADO"
                          ? "Entregado"
                          : "Cancelado"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-xs">
                      {new Date(p.updated_at).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </section>
  );
}
