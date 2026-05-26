import { useState } from "react";

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
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categorias.services";

import type {
  ICategoria,
  ICategoriaCreate,
  ICategoriaUpdate,
} from "../types/categorias.types";

import CategoriaForm from "./CategoriasForm";

import Modal from "../../../shared/Modal";

const columnHelper =
  createColumnHelper<ICategoria>();

const getColumns = (
  openEdit: (c: ICategoria) => void,
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

  columnHelper.accessor("nombre", {
    header: "Nombre",
    cell: (info) => (
      <span className="font-medium text-gray-800">
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor("descripcion", {
    header: "Descripción",
    cell: (info) => (
      <span className="text-gray-500 text-sm">
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor("parent_id", {
    header: "Padre",
    cell: (info) => {
      const val = info.getValue();
      return (
        <span className="text-gray-500 text-sm">
          {val ?? "—"}
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
      <div className="text-right space-x-2">
        <button
          onClick={() => openEdit(info.row.original)}
          className="text-xs bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg transition-colors"
        >
          Editar
        </button>
        <button
          onClick={() => {
            if (confirm("¿Eliminar categoría?")) {
              deleteMut.mutate(info.row.original.id);
            }
          }}
          className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors"
        >
          Eliminar
        </button>
      </div>
    ),
  }),
];

export default function CategoriasTable() {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ICategoria | null>(null);
  const [mutError, setMutError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["categorias", appliedSearch],
    queryFn: () => getCategorias(0, 50, appliedSearch),
  });

  const createMut = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      closeModal();
    },
    onError: (err: Error) => setMutError(err.message),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ICategoriaUpdate }) =>
      updateCategoria(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      closeModal();
    },
    onError: (err: Error) => setMutError(err.message),
  });

  const deleteMut = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categorias"] }),
  });

  const openEdit = (cat: ICategoria) => {
    setEditing(cat);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setMutError(null);
  };

  const handleSubmit = (formData: ICategoriaCreate | ICategoriaUpdate) => {
    if (editing) {
      updateMut.mutate({ id: editing.id, data: formData });
    } else {
      createMut.mutate(formData as ICategoriaCreate);
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
        Cargando categorías...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search + New button */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 outline-none focus:border-blue-500"
            placeholder="Buscar categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setAppliedSearch(searchTerm)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Buscar
          </button>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Nueva
        </button>
      </div>

      {/* Table */}
      <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-gray-500 uppercase text-[11px] tracking-wider">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? "Editar categoría" : "Nueva categoría"}
      >
        <CategoriaForm
          key={editing?.id ?? "new"}
          initial={editing}
          onSubmit={handleSubmit}
          isPending={createMut.isPending || updateMut.isPending}
          error={mutError}
        />
      </Modal>
    </div>
  );
}
