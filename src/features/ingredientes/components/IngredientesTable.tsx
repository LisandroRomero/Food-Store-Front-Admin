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
  getIngredientes,
  createIngrediente,
  updateIngrediente,
  deleteIngrediente,
} from "../services/ingredientes.service";

import type {
  IIngrediente,
  IIngredienteCreate,
  IIngredienteUpdate,
} from "../types/ingredientes.type";

import IngredienteForm from "./IngredienteForm";

import Modal from "../../../shared/Modal";

const columnHelper =
  createColumnHelper<IIngrediente>();

const getColumns = (
  openEdit: (
    i: IIngrediente
  ) => void,

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

  columnHelper.accessor(
    "es_alergeno",
    {
      header: "Estado",

      cell: (info) => (
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${
            info.getValue()
              ? "text-amber-600 font-bold"
              : "text-gray-400"
          }`}
        >
          {info.getValue()
            ? "⚠️ Sí"
            : "No"}
        </span>
      ),
    }
  ),

  columnHelper.accessor("activo", {
    header: "Estado",

    cell: (info) => (
      <span
        className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${
          info.getValue()
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-600"
        }`}
      >
        {info.getValue()
          ? "Activo"
          : "No activo"}
      </span>
    ),
  }),

  columnHelper.display({
    id: "acciones",

    header: () => (
      <div className="text-right">
        Acciones
      </div>
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
            openEdit(
              info.row.original
            )
          }
          className="text-yellow-600 hover:text-yellow-800 font-medium text-sm cursor-pointer"
        >
          Editar
        </button>

        <button
          onClick={() => {
            if (
              confirm("¿Eliminar?")
            ) {
              deleteMut.mutate(
                info.row.original.id
              );
            }
          }}
          className="text-red-600 hover:text-red-800 font-medium text-sm cursor-pointer"
        >
          Eliminar
        </button>
      </div>
    ),
  }),
];

export default function IngredientesTable() {
  const queryClient =
    useQueryClient();

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<IIngrediente | null>(
      null
    );

  const [mutError, setMutError] =
    useState<string | null>(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    appliedSearch,
    setAppliedSearch,
  ] = useState("");

  const { data, isLoading } =
    useQuery({
      queryKey: [
        "ingredientes",
        appliedSearch,
      ],

      queryFn: () =>
        getIngredientes(
          0,
          50,
          appliedSearch
        ),
    });
  const createMut = useMutation({
    mutationFn: createIngrediente,

    onSuccess: () => {
      queryClient.invalidateQueries(
        {
          queryKey: [
            "ingredientes",
          ],
        }
      );

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
      data: IIngredienteUpdate;
    }) =>
      updateIngrediente(
        id,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries(
        {
          queryKey: [
            "ingredientes",
          ],
        }
      );

      closeModal();
    },

    onError: (err: Error) =>
      setMutError(err.message),
  });

  const deleteMut = useMutation({
    mutationFn: deleteIngrediente,

    onSuccess: () =>
      queryClient.invalidateQueries(
        {
          queryKey: [
            "ingredientes",
          ],
        }
      ),
  });

  const openEdit = (
    ing: IIngrediente
  ) => {
    setEditing(ing);

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);

    setEditing(null);

    setMutError(null);
  };

  const handleSubmit = (
    formData:
      | IIngredienteCreate
      | IIngredienteUpdate
  ) => {
    if (editing) {
      updateMut.mutate({
        id: editing.id,
        data: formData,
      });
    } else {
      createMut.mutate(
        formData as IIngredienteCreate
      );
    }
  };

  const columns = getColumns(
    openEdit,
    deleteMut
  );

  const table = useReactTable({
    data: data?.data ?? [],

    columns,

    getCoreRowModel:
      getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-400">
        Cargando ingredientes...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 outline-none focus:border-blue-500"
            placeholder="Buscar ingrediente..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

          <button
            onClick={() =>
              setAppliedSearch(
                searchTerm
              )
            }
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Buscar
          </button>
        </div>

        <button
          onClick={() =>
            setModalOpen(true)
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Nuevo
        </button>
      </div>
      <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
  <table className="w-full text-left text-sm">
    <thead className="bg-gray-50 border-b text-gray-500 uppercase text-[11px] tracking-wider">
      {table.getHeaderGroups().map(
        (headerGroup) => (
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
        )
      )}
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
      
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          editing
            ? "Editar Ingrediente"
            : "Nuevo Ingrediente"
        }
      >
        <IngredienteForm
          key={
            editing?.id ?? "new"
          }
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