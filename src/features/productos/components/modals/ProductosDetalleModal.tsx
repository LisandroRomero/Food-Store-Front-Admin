import { useQuery } from "@tanstack/react-query";

import { ClipLoader } from "react-spinners";

import { getProductById } from "../../services/productos.service";
import type { IProducto } from "../../types/productos.type";

import Modal from "../../../../shared/Modal";

import defaultProductoImg from "../../assets/descarga.jpg";

type Props = {
  isOpen: boolean;
  productoId: number | null;
  onClose: () => void;
};

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <div className="text-sm text-slate-100">
        {value}
      </div>
    </div>
  );
}

function renderProductoDetalle(producto: IProducto) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <img
          src={producto.imagenes_url?.[0] || defaultProductoImg}
          onError={(e) => {
            e.currentTarget.src = defaultProductoImg;
          }}
          alt={producto.nombre}
          className="h-24 w-24 rounded-xl object-cover border border-slate-800"
        />

        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            {producto.nombre}
          </h3>
          <p className="text-sm text-slate-400">
            {producto.descripcion || "Sin descripción"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Precio" value={`$ ${producto.precio_base}`} />
        <Field label="Stock" value={producto.stock_cantidad} />
        <Field
          label="Disponible"
          value={
            producto.disponible ? (
              <span className="text-emerald-400">Sí</span>
            ) : (
              <span className="text-rose-400">No</span>
            )
          }
        />
        <Field label="ID" value={producto.id} />
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Field
          label="Categorías"
          value={
            producto.categorias?.length
              ? producto.categorias.map((c) => c.nombre).join(", ")
              : "-"
          }
        />
        <Field
          label="Ingredientes"
          value={
            producto.ingredientes?.length
              ? producto.ingredientes
                  .map((i) => i.nombre)
                  .join(", ")
              : "-"
          }
        />
      </div>
    </div>
  );
}

export default function ProductoDetalleModal({
  isOpen,
  productoId,
  onClose,
}: Props) {
  const enabled = isOpen && productoId != null;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["producto", productoId],
    queryFn: () => getProductById(productoId as number),
    enabled,
    staleTime: 1000 * 60,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={data ? `Detalle: ${data.nombre}` : "Detalle de producto"}
    >
      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <ClipLoader />
        </div>
      )}

      {isError && (
        <p className="text-sm text-rose-400">
          Error cargando el detalle del producto.
        </p>
      )}

      {data && renderProductoDetalle(data)}
    </Modal>
  );
}
