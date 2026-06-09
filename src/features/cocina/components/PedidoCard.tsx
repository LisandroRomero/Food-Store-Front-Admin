import { type IPedido } from "../types/pedidos.type";


interface PedidoCardProps {
  pedido: IPedido;
  onAdvance: (id: number) => void;
}

export function PedidoCard({
  pedido,
  onAdvance,
}: PedidoCardProps) {
  return (
    <div className="rounded-2xl border bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold">
          Pedido #{pedido.id}
        </h3>

        <span className="text-sm text-gray-500">
          {pedido.forma_pago_codigo}
        </span>
      </div>

      <p className="font-medium">
        {pedido.usuario.nombre}{" "}
        {pedido.usuario.apellido}
      </p>

      <div className="mt-3 space-y-1 text-sm text-gray-600">
        {pedido.detalle_pedidos
          .slice(0, 2)
          .map((detalle) => (
            <p key={detalle.producto_id}>
              {detalle.cantidad}x{" "}
              {detalle.nombre_snapshot}
            </p>
          ))}

        {pedido.detalle_pedidos.length > 2 && (
          <p>
            +
            {pedido.detalle_pedidos.length - 2} más
          </p>
        )}
      </div>

      <div className="mt-4">
        <p className="text-lg font-bold">
          ${pedido.total}
        </p>
      </div>

      {pedido.estado_codigo !==
        "ENTREGADO" && (
        <div className="mt-4">
          <button
            onClick={() =>
              onAdvance(pedido.id)
            }
            className="w-full rounded-xl bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          >
            Avanzar estado
          </button>
        </div>
      )}
    </div>
  );
}