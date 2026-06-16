import { type IPedido } from "../types/pedidos.type";
import { PedidoCard } from "./PedidoCard";

interface PedidoColumnProps {
  estado: string;
  pedidos: IPedido[];
  onAdvance: (id: number) => void;
  onCancel: (id: number, motivo: string) => void;
}

export function PedidoColumn({
  estado,
  pedidos,
  onAdvance,
  onCancel,
}: PedidoColumnProps) {
  return (
    <div className="flex h-full flex-1 flex-col rounded-2xl bg-white p-4 shadow min-w-[280px]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          {estado === "EN_PREPARACION"
            ? "En preparación"
            : estado.charAt(0) + estado.slice(1).toLowerCase()}
        </h2>

        <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold">
          {pedidos.length}
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {pedidos.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-gray-400">Sin pedidos</p>
          </div>
        ) : (
          pedidos.map((pedido) => (
            <PedidoCard
              key={pedido.id}
              pedido={pedido}
              onAdvance={onAdvance}
              onCancel={onCancel}
            />
          ))
        )}
      </div>
    </div>
  );
}
