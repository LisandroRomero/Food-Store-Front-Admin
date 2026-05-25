import type {
  Producto,
} from "../types/productos.type";

type Props = {
  productos: Producto[];

  onView: (
    id: number
  ) => void;

  onEdit: (
    producto: Producto
  ) => void;

  onDelete: (
    id: number
  ) => void;
};

export default function ProductoTable({
  productos,
  onView,
  onEdit,
  onDelete,
}: Props) {
  if (productos.length === 0) {
    return (
      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-10
          text-center
          text-slate-400
        "
      >
        No hay productos
      </div>
    );
  }

  return (
    <div
      className="
        overflow-x-auto
        bg-slate-900
        rounded-2xl
        shadow
        border
        border-slate-800
      "
    >
      <table className="w-full">
        <thead
          className="
            bg-slate-800
            text-slate-200
          "
        >
          <tr>
            <th className="p-4 text-left">
              #
            </th>

            <th className="p-4 text-left">
              Nombre
            </th>

            <th className="p-4 text-left">
              Precio
            </th>

            <th className="p-4 text-left">
              Stock
            </th>

            <th className="p-4 text-left">
              Disponible
            </th>

            <th className="p-4 text-left">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {productos.map(
            (producto, index) => (
              <tr
                key={producto.id}
                className="
                  border-t
                  border-slate-800
                "
              >
                <td className="p-4">
                  {index + 1}
                </td>

                <td className="p-4">
                  {producto.nombre}
                </td>

                <td className="p-4">
                  $
                  {
                    producto.precio_base
                  }
                </td>

                <td className="p-4">
                  {
                    producto.stock_cantidad
                  }
                </td>

                <td className="p-4">
                  <span
                    className={
                      producto.disponible
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }
                  >
                    {producto.disponible
                      ? "Sí"
                      : "No"}
                  </span>
                </td>

                <td
                  className="
                    p-4
                    flex
                    gap-2
                  "
                >
                  <button
                    onClick={() =>
                      onView(
                        producto.id
                      )
                    }
                    className="
                      bg-slate-700
                      hover:bg-slate-600
                      text-slate-100
                      px-3
                      py-1
                      rounded-lg
                      transition
                    "
                  >
                    Ver
                  </button>

                  <button
                    onClick={() =>
                      onEdit(
                        producto
                      )
                    }
                    className="
                      bg-yellow-500
                      hover:bg-yellow-600
                      text-white
                      px-3
                      py-1
                      rounded-lg
                      transition
                    "
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      onDelete(
                        producto.id
                      )
                    }
                    className="
                      bg-red-500
                      hover:bg-red-600
                      text-white
                      px-3
                      py-1
                      rounded-lg
                      transition
                    "
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}