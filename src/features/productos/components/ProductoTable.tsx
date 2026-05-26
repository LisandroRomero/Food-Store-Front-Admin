import { useState } from "react";
import { Link } from "react-router-dom";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productos.service";

import type {
  Producto,
  CreateProductoDTO,
  UpdateProductoDTO,
} from "../types/productos.type";

import ProductosForm from "./ProductosForm";

import Modal from "../../../shared/Modal";

const columnHelper =
  createColumnHelper<Producto>();

const getColumns = (
  openEdit: (p: Producto) => void,
  deleteMut: any
) => [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => (
      <span className="text-gray-500 font-mono text-xs">
        #{info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor("imagenes_url", {
    header: "Imagen",
    cell: (info) => {
      const images = info.getValue();
      return images && images.length > 0 ? (
        <img
          src={images[0]}
          alt="Producto"
          className="w-12 h-12 object-cover rounded-lg"
        />
      ) : (
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">
          Sin img
        </div>
      );
    },
  }),

  columnHelper.accessor("nombre", {
    header: "Nombre",
    cell: (info) => (
      <span className="font-medium text-gray-800">
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor("precio_base", {
    header: "Precio",
    cell: (info) =>
      `$${info.getValue().toLocaleString()}`,
  }),

  columnHelper.accessor("stock_cantidad", {
    header: "Stock",
  }),

  columnHelper.accessor("disponible", {
    header: "Estado",
    cell: (info) => {
      const val = info.getValue();
      return (
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${
            val
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {val ? "Disponible" : "No disponible"}
        </span>
      );
    },
  }),

  columnHelper.display({
    id: "acciones",
    header: () => (
      <div className="text-right">Acciones</div>
    ),
    cell: (info) => (
      <div className="text-right space-x-3">
        <Link
          to={`/detalle/${info.row.original.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm cursor-pointer"
        >
          Ver
        </Link>

        <button
          onClick={() =>
            openEdit(info.row.original)
          }
          className="text-yellow-600 hover:text-yellow-800 font-medium text-sm cursor-pointer"
        >
          Editar
        </button>

        <button
          onClick={() => {
            if (confirm("¿Eliminar?"))
              deleteMut.mutate(
                info.row.original.id
              );
          }}
          className="text-red-600 hover:text-red-800 font-medium text-sm cursor-pointer"
        >
          Eliminar
        </button>
      </div>
    ),
  }),
];

export default function ProductosTable() {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] =
    useState(false);
  const [editing, setEditing] =
    useState<Producto | null>(null);
  const [mutError, setMutError] =
    useState<string | null>(null);
  const [searchTerm, setSearchTerm] =
    useState("");
  const [appliedSearch, setAppliedSearch] =
    useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, isLoading, isError } =
    useQuery({
      queryKey: [
        "productos",
        offset,
        appliedSearch,
      ],
      queryFn: () =>
        getProducts(
          offset,
          limit,
          appliedSearch
        ),
    });

  const createMut = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productos"],
      });
      closeModal();
    },
    onError: (err: Error) =>
      setMutError(err.message),
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateProductoDTO;
    }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productos"],
      });
      closeModal();
    },
    onError: (err: Error) =>
      setMutError(err.message),
  });

  const deleteMut = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["productos"],
      }),
  });

  const openEdit = (prod: Producto) => {
    setEditing(prod);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setMutError(null);
  };

  const handleSubmit = (
    formData: CreateProductoDTO | UpdateProductoDTO
  ) => {
    if (editing) {
      updateMut.mutate({
        id: editing.id,
        data: formData,
      });
    } else {
      createMut.mutate(
        formData as CreateProductoDTO
      );
    }
  };

  const columns = getColumns(openEdit, deleteMut);

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-400">
        Cargando productos...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500">
        Error al cargar productos.
      </div>
    );
  }

  const totalPages = data
    ? Math.ceil(data.total / limit)
    : 0;
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="space-y-6">
      {/* Search + New */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex w-full sm:w-auto gap-2">
          <input
            type="text"
            placeholder="Nombre del producto..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
          <button
            onClick={() => {
              setOffset(0);
              setAppliedSearch(searchTerm);
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Buscar
          </button>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Table */}
      <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase text-[11px] tracking-wider">
            {table
              .getHeaderGroups()
              .map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3"
                      >
                        {flexRender(
                          header.column
                            .columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    )
                  )}
                </tr>
              ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table
              .getRowModel()
              .rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {row
                    .getVisibleCells()
                    .map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3"
                      >
                        {flexRender(
                          cell.column
                            .columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </article>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            Página {currentPage} de{" "}
            {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={offset === 0}
              onClick={() =>
                setOffset(
                  Math.max(
                    0,
                    offset - limit
                  )
                )
              }
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              Anterior
            </button>
            <button
              disabled={
                offset + limit >=
                (data?.total ?? 0)
              }
              onClick={() =>
                setOffset(offset + limit)
              }
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          editing
            ? "Editar Producto"
            : "Nuevo Producto"
        }
      >
        <ProductosForm
          key={editing?.id ?? "new"}
          initial={editing}
          onSubmit={handleSubmit}
          isPending={
            createMut.isPending ||
            updateMut.isPending
          }
          error={mutError}
        />
      </Modal>
    </div>
  );
}
