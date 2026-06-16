import { useState } from "react";
import { type IPedido } from "../types/pedidos.type";
import Modal from "../../../shared/Modal";

interface PedidoCardProps {
  pedido: IPedido;
  onAdvance: (id: number) => void;
  onCancel: (id: number, motivo: string) => void;
}

export function PedidoCard({
  pedido,
  onAdvance,
  onCancel,
}: PedidoCardProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [motivo, setMotivo] = useState("");

  const puedeCancelar =
    pedido.estado_codigo === "PENDIENTE" ||
    pedido.estado_codigo === "CONFIRMADO";

  const handleConfirmCancel = () => {
    if (!motivo.trim()) return;
    onCancel(pedido.id, motivo.trim());
    setShowCancelModal(false);
    setMotivo("");
  };

  return (
    <>
      <div className="rounded-2xl border bg-gray-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold">Pedido #{pedido.id}</h3>

          <span className="text-sm text-gray-500">
            {pedido.forma_pago_codigo}
          </span>
        </div>

        <p className="font-medium">
          {pedido.usuario.nombre} {pedido.usuario.apellido}
        </p>

        <div className="mt-3 space-y-1 text-sm text-gray-600">
          {pedido.detalle_pedidos.slice(0, 2).map((detalle) => (
            <p key={detalle.producto_id}>
              {detalle.cantidad}x {detalle.nombre_snapshot}
            </p>
          ))}

          {pedido.detalle_pedidos.length > 2 && (
            <p>+{pedido.detalle_pedidos.length - 2} m&aacute;s</p>
          )}
        </div>

        <div className="mt-4">
          <p className="text-lg font-bold">${pedido.total}</p>
        </div>

        {pedido.estado_codigo !== "ENTREGADO" && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onAdvance(pedido.id)}
              className="flex-1 rounded-xl bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            >
              Avanzar estado
            </button>

            {puedeCancelar && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
              >
                Cancelar
              </button>
            )}
          </div>
        )}
      </div>

      {showCancelModal && (
        <Modal
          open={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setMotivo("");
          }}
          title={"Cancelar Pedido #" + pedido.id}
        >
          <p className="mb-4 text-sm text-gray-600">
            {"\u00bf"}Estas seguro de que queres cancelar este pedido? Esta
            accion no se puede deshacer.
          </p>

          <label className="mb-1 block text-sm font-medium text-gray-700">
            Motivo de cancelacion{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: Cliente solicito cancelacion..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                setShowCancelModal(false);
                setMotivo("");
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Volver
            </button>
            <button
              onClick={handleConfirmCancel}
              disabled={!motivo.trim()}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirmar cancelacion
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
