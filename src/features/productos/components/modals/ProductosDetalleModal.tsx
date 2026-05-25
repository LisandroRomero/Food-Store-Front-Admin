import { useQuery } from "@tanstack/react-query";

import { ClipLoader } from "react-spinners";

import { getProductById } from "../../services/productos.service";

import type {
  Producto,
} from "../../types/productos.type";

import Modal from "../../../../shared/Modal";

import defaultProductoImg from "../../../../assets/descarga.jpg";

type Props = {
  isOpen: boolean;

  productoId: number | null;

  onClose: () => void;
};

type FieldProps = {
  label: string;

  value: React.ReactNode;
};

function Field({
  label,
  value,
}: FieldProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-1
      "
    >
      <span
        className="
          text-xs
          uppercase
          tracking-wide
          text-slate-400
        "
      >
        {label}
      </span>

      <div
        className="
          text-sm
          text-slate-100
        "
      >
        {value}
      </div>
    </div>
  );
}

function ProductoDetalle({
  producto,
}: {
  producto: Producto;
}) {
  return (
    <div
      className="
        flex
        flex-col
        gap-5
      "
    >
      {/* HEADER */}
      <div
        className="
          flex
          items-start
          gap-4
        "
      >
        <img
          src={
            producto.imagenes_url?.[0] ??
            defaultProductoImg
          }
          onError={(e) => {
            e.currentTarget.src =
              defaultProductoImg;
          }}
          alt={producto.nombre}
          className="
            h-24
            w-24
            rounded-xl
            object-cover
            border
            border-slate-800
          "
        />

        <div
          className="
            flex
            flex-col
            gap-1
          "
        >
          <h3
            className="
              text-lg
              font-semibold
              text-slate-100
            "
          >
            {producto.nombre}
          </h3>

          <p
            className="
              text-sm
              text-slate-400
            "
          >
            {producto.descripcion ||
              "Sin descripción"}
          </p>
        </div>
      </div>

      {/* INFO */}
      <div
        className="
          grid
          grid-cols-2
          gap-4
        "
      >
        <Field
          label="ID"
          value={producto.id}
        />

        <Field
          label="Precio"
          value={`$ ${producto.precio_base}`}
        />

        <Field
          label="Stock"
          value={
            producto.stock_cantidad
          }
        />

        <Field
          label="Disponible"
          value={
            producto.disponible ? (
              <span
                className="
                  text-emerald-400
                  font-medium
                "
              >
                Sí
              </span>
            ) : (
              <span
                className="
                  text-rose-400
                  font-medium
                "
              >
                No
              </span>
            )
          }
        />

        <Field
          label="Activo"
          value={
            producto.activo ? (
              <span
                className="
                  text-emerald-400
                  font-medium
                "
              >
                Sí
              </span>
            ) : (
              <span
                className="
                  text-rose-400
                  font-medium
                "
              >
                No
              </span>
            )
          }
        />

        <Field
          label="Unidad"
          value={
            producto.unidad_medida
              ?.nombre ?? "-"
          }
        />
      </div>

      {/* CATEGORIAS */}
      <Field
        label="Categorías"
        value={
          producto.categorias.length >
          0
            ? producto.categorias
                .map(
                  (categoria) =>
                    categoria.nombre
                )
                .join(", ")
            : "-"
        }
      />

      {/* INGREDIENTES */}
      <Field
        label="Ingredientes"
        value={
          producto.ingredientes
            .length > 0
            ? producto.ingredientes
                .map(
                  (ingrediente) =>
                    ingrediente.nombre
                )
                .join(", ")
            : "-"
        }
      />

      {/* FECHAS */}
      <div
        className="
          grid
          grid-cols-2
          gap-4
        "
      >
        <Field
          label="Creado"
          value={new Date(
            producto.created_at
          ).toLocaleString()}
        />

        <Field
          label="Actualizado"
          value={new Date(
            producto.updated_at
          ).toLocaleString()}
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
  const enabled =
    isOpen &&
    productoId !== null;

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "producto",
      productoId,
    ],

    queryFn: () =>
      getProductById(
        productoId as number
      ),

    enabled,

    staleTime: 1000 * 60,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        data
          ? `Detalle: ${data.nombre}`
          : "Detalle producto"
      }
    >
      {isLoading && (
        <div
          className="
            flex
            items-center
            justify-center
            py-10
          "
        >
          <ClipLoader />
        </div>
      )}

      {isError && (
        <div
          className="
            py-6
            text-sm
            text-rose-400
          "
        >
          Error cargando el producto.
        </div>
      )}

      {data && (
        <ProductoDetalle
          producto={data}
        />
      )}
    </Modal>
  );
}