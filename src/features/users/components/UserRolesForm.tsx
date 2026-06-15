import { useState } from "react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  assignRole,
  removeRole,
} from "../services/users.service";

import type {
  UserPublic,
  UserRole,
  IUserRoleAction,
} from "../types/users.types";

type Props = {
  user: UserPublic;
  onClose: () => void;
};

const ROLES_LABEL: Record<UserRole, string> = {
  ADMIN: "Admin",
  STOCK: "Stock",
  PEDIDOS: "Pedidos",
  CLIENT: "Cliente",
};

const ALL_ROLES: UserRole[] = [
  "ADMIN",
  "STOCK",
  "PEDIDOS",
  "CLIENT",
];

export default function UserRolesForm({
  user,
  onClose,
}: Props) {
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | null>(
    null
  );

  const [selectedRoles, setSelectedRoles] =
    useState<UserRole[]>(
      user.roles.map((r) => r.codigo)
    );

  const assignRoleMut = useMutation({
    mutationFn: (data: IUserRoleAction) =>
      assignRole(data.usuario_id, data),

    onError: (err: Error) =>
      setError(err.message),
  });

  const removeRoleMut = useMutation({
    mutationFn: (data: IUserRoleAction) =>
      removeRole(data.usuario_id, data),

    onError: (err: Error) =>
      setError(err.message),
  });

  const handleSave = async () => {
    try {
      setError(null);

      const currentRoles = user.roles.map(
        (r) => r.codigo
      );

      const toAdd = selectedRoles.filter(
        (role) => !currentRoles.includes(role)
      );

      const toRemove = currentRoles.filter(
        (role) => !selectedRoles.includes(role)
      );

      const promises = [
        ...toAdd.map((role) =>
          assignRoleMut.mutateAsync({
            usuario_id: user.id,
            codigo_rol: role,
            expires_at: null,
          })
        ),

        ...toRemove.map((role) =>
          removeRoleMut.mutateAsync({
            usuario_id: user.id,
            codigo_rol: role,
            expires_at: null,
          })
        ),
      ];

      await Promise.all(promises);

      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      onClose();
    } catch (err: any) {
      setError(
        err?.message ??
          "Error actualizando roles"
      );
    }
  };

  const isPending =
    assignRoleMut.isPending ||
    removeRoleMut.isPending;

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {ALL_ROLES.map((role) => (
          <label
            key={role}
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedRoles.includes(
                role
              )}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedRoles((prev) => [
                    ...prev,
                    role,
                  ]);
                } else {
                  setSelectedRoles((prev) =>
                    prev.filter(
                      (r) => r !== role
                    )
                  );
                }
              }}
            />

            <span>
              {ROLES_LABEL[role]}
            </span>
          </label>
        ))}
      </div>

      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="px-4 py-2 rounded-lg border border-gray-300"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
        >
          {isPending
            ? "Guardando..."
            : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}