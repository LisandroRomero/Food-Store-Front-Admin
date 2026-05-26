import { useEffect, useMemo } from "react";

import { usePedidosStore } from "../store/pedidos.store";

export default function PedidosKanbanPage() {
  const {
    pedidos,
    loading,
    loadPedidos,
    advancePedido,
  } = usePedidosStore();

  useEffect(() => {
    loadPedidos();
  }, [loadPedidos]);

  /* =========================
     GROUP PEDIDOS
  ========================= */

  const groupedPedidos = useMemo(() => {
    return {
      PENDIENTE: pedidos.filter(
        (p) => p.estado_codigo === "PENDIENTE"
      ),

      CONFIRMADO: pedidos.filter(
        (p) => p.estado_codigo === "CONFIRMADO"
      ),

      EN_PREPARACION: pedidos.filter(
        (p) =>
          p.estado_codigo ===
          "EN_PREPARACION"
      ),

      EN_CAMINO: pedidos.filter(
        (p) => p.estado_codigo === "EN_CAMINO"
      ),

      ENTREGADO: pedidos.filter(
        (p) => p.estado_codigo === "ENTREGADO"
      ),
    };
  }, [pedidos]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="p-6">
        Cargando pedidos...
      </div>
    );
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <section className="h-full overflow-x-auto p-6 lg:p-8">
      <h1 className="mb-6 text-2xl font-bold">
        Pedidos
      </h1>

      <div className="flex gap-6">
        {Object.entries(groupedPedidos).map(
          ([estado, pedidos]) => (
            <div
              key={estado}
              className="min-h-[80vh] min-w-[320px] rounded-2xl bg-white p-4 shadow"
            >
              {/* HEADER */}

              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  {estado.replaceAll(
                    "_",
                    " "
                  )}
                </h2>

                <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold">
                  {pedidos.length}
                </span>
              </div>

              {/* CARDS */}

              <div className="space-y-4">
                {pedidos.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="rounded-2xl border bg-gray-50 p-4"
                  >
                    {/* TOP */}

                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-bold">
                        Pedido #
                        {pedido.id}
                      </h3>

                      <span className="text-sm text-gray-500">
                        {
                          pedido.forma_pago_codigo
                        }
                      </span>
                    </div>

                    {/* CLIENTE */}

                    <p className="font-medium">
                      {
                        pedido.usuario
                          .nombre
                      }{" "}
                      {
                        pedido.usuario
                          .apellido
                      }
                    </p>

                    {/* PRODUCTOS */}

                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      {pedido.detalle_pedidos
                        .slice(0, 2)
                        .map((detalle) => (
                          <p
                            key={
                              detalle.producto_id
                            }
                          >
                            {
                              detalle.cantidad
                            }
                            x{" "}
                            {
                              detalle.nombre_snapshot
                            }
                          </p>
                        ))}

                      {pedido
                        .detalle_pedidos
                        .length > 2 && (
                        <p>
                          +
                          {pedido
                            .detalle_pedidos
                            .length - 2}{" "}
                          más
                        </p>
                      )}
                    </div>

                    {/* TOTAL */}

                    <div className="mt-4">
                      <p className="text-lg font-bold">
                        ${pedido.total}
                      </p>
                    </div>

                    {/* ACTIONS */}

                    {pedido.estado_codigo !==
                      "ENTREGADO" && (
                      <div className="mt-4">
                        <button
                          onClick={() =>
                            advancePedido(
                              pedido.id
                            )
                          }
                          className="w-full rounded-xl bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
                        >
                          Avanzar estado
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}