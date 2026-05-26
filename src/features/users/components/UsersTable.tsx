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
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  assignRole,
  removeRole,
} from "../services/users.service";

import type {
  UserPublic,
  UserRole,
  IUserCreate,
  IUserUpdate,
} from "../types/users.types";

import UsersForm from "./UsersForm";
import Modal from "../../../shared/Modal";

const columnHelper = createColumnHelper<UserPublic>();

const ROLES_LABEL: Record<UserRole, string> = {
  ADMIN: "Admin",
  STOCK: "Stock",
  PEDIDOS: "Pedidos",
  CLIENT: "Cliente",
};

const getColumns = (
  openEdit: (u: UserPublic) => void,
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
    cell: (info) => {
      const user = info.row.original;
      return (
        <span className="font-medium text-gray-800">
          {user.nombre} {user.apellido}
        </span>
      );
    },
  }),

  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => (
      <span className="text-gray-600 text-sm">
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor("celular", {
    header: "Celular",
    cell: (info) => (
      <span className="text-gray-600 text-sm">
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor("roles", {
    header: "Roles",
    cell: (info) => {
      const roles = info.getValue();
      return (
        <div className="flex gap-1 flex-wrap">
          {roles.map((r) => (
            <span
              key={r.codigo}
              className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700"
            >
              {ROLES_LABEL[r.codigo]}
            </span>
          ))}
          {roles.length === 0 && (
            <span className="text-[11px] text-gray-400">—</span>
          )}
        </div>
      );
    },
  }),

  columnHelper.accessor("activo", {
    header: "Estado",
    cell: (info) => {
      const active = info.getValue();
      return (
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
            active
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              active ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {active ? "Activo" : "Inactivo"}
        </span>
      );
    },
  }),

  columnHelper.display({
    id: "acciones",
    header: () => <div className="text-right">Acciones</div>,
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
            if (confirm("¿Desactivar usuario?")) {
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

export default function UsersTable() {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UserPublic | null>(null);
  const [mutError, setMutError] = useState<string | null>(null);
  const [rolFilter, setRolFilter] = useState<UserRole | "">("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", rolFilter],
    queryFn: () =>
      getUsers(0, 50, rolFilter ? (rolFilter as UserRole) : undefined),
  });

  // CREATE
  const createMut = useMutation({
    mutationFn: createUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeModal();
    },
    onError: (err: Error) => setMutError(err.message),
  });

  // UPDATE
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUserUpdate }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeModal();
    },
    onError: (err: Error) => setMutError(err.message),
  });

  // ASSIGN ROLE
  const assignRoleMut = useMutation({
    mutationFn: ({
      userId,
      codigo_rol,
    }: {
      userId: number;
      codigo_rol: UserRole;
    }) => assignRole(userId, { rol: codigo_rol }),
  });

  // REMOVE ROLE
  const removeRoleMut = useMutation({
    mutationFn: ({
      userId,
      codigo_rol,
    }: {
      userId: number;
      codigo_rol: UserRole;
    }) => removeRole(userId, { rol: codigo_rol }),
  });

  // DELETE
  const deleteMut = useMutation({
    mutationFn: deleteUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["users"] }),
    onError: (err: Error) => setMutError(err.message),
  });

  const openEdit = (user: UserPublic) => {
    setEditing(user);
    setMutError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setMutError(null);
  };

  // ===== SUBMIT: coordina update/register + roles =====
  const handleSubmit = async (
    formData: IUserCreate | IUserUpdate,
    selectedRoles: UserRole[]
  ) => {
    setMutError(null);

    if (editing) {
      // 1) Update basic fields
      updateMut.mutate(
        { id: editing.id, data: formData },
        {
          onSuccess: () => {
            // 2) Diff roles
            const currentRoles: UserRole[] = editing.roles.map(
              (r) => r.codigo
            );
            const toAdd = selectedRoles.filter(
              (r) => !currentRoles.includes(r)
            );
            const toRemove = currentRoles.filter(
              (r) => !selectedRoles.includes(r)
            );

            // 3) Apply role changes sequentially
            const promises: Promise<any>[] = [];
            toAdd.forEach((r) => {
              promises.push(
                assignRoleMut.mutateAsync({
                  userId: editing.id,
                  codigo_rol: r,
                })
              );
            });
            toRemove.forEach((r) => {
              promises.push(
                removeRoleMut.mutateAsync({
                  userId: editing.id,
                  codigo_rol: r,
                })
              );
            });

            if (promises.length > 0) {
              Promise.all(promises)
                .then(() => {
                  queryClient.invalidateQueries({
                    queryKey: ["users"],
                  });
                  closeModal();
                })
                .catch((err: any) =>
                  setMutError(
                    err?.message ?? "Error actualizando roles"
                  )
                );
            } else {
              closeModal();
            }
          },
        }
      );
    } else {
      // CREATE: register first, then assign roles
      createMut.mutate(formData as IUserCreate, {
        onSuccess: (createdUser) => {
          if (selectedRoles.length > 0) {
            const promises = selectedRoles.map((r) =>
              assignRoleMut.mutateAsync({
                userId: createdUser.id,
                codigo_rol: r,
              })
            );
            Promise.all(promises)
              .then(() => {
                queryClient.invalidateQueries({
                  queryKey: ["users"],
                });
                closeModal();
              })
              .catch((err: any) =>
                setMutError(
                  err?.message ?? "Error asignando roles"
                )
              );
          } else {
            closeModal();
          }
        },
      });
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
        Cargando usuarios...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500 bg-red-50 rounded-lg">
        Error cargando usuarios: {(error as Error)?.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters + New button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-500 font-medium">
            Filtrar por rol:
          </label>
          <select
            value={rolFilter}
            onChange={(e) =>
              setRolFilter(e.target.value as UserRole | "")
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Todos</option>
            {(["ADMIN", "STOCK", "PEDIDOS", "CLIENT"] as UserRole[]).map(
              (r) => (
                <option key={r} value={r}>
                  {ROLES_LABEL[r]}
                </option>
              )
            )}
          </select>

          <span className="text-xs text-gray-400">
            {data?.total ?? 0} usuario(s)
          </span>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Nuevo
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
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={getColumns(openEdit, deleteMut).length}
                  className="text-center py-12 text-gray-400"
                >
                  No hay usuarios
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
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
        title={editing ? "Editar usuario" : "Nuevo usuario"}
      >
        <UsersForm
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
