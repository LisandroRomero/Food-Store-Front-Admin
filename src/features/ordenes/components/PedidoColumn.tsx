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
    <div className="min-h-[80vh] min-w-[320px] rounded-2xl bg-white p-4 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          {estado.replaceAll("_", " ")}
        </h2>

        <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold">
          {pedidos.length}
        </span>
      </div>

      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <PedidoCard
            key={pedido.id}
            pedido={pedido}
            onAdvance={onAdvance}
            onCancel={onCancel}
          />
        ))}
      </div>
    </div>
  );
}
