import { useForm } from "@tanstack/react-form";

import type {
  UserPublic,
  UserRole,
  IUserCreate,
  IUserUpdate,
} from "../../types/users.types";

type Props = {
  initial?: UserPublic | null;
  onSubmit: (
    data: IUserCreate | IUserUpdate
  ) => void;
  isPending?: boolean;
  error?: string | null;
};

const ALL_ROLES: UserRole[] = [
  "ADMIN",
  "STOCK",
  "PEDIDOS",
  "CLIENT",
];

const ROLES_LABEL: Record<UserRole, string> = {
  ADMIN: "Administrador",
  STOCK: "Stock",
  PEDIDOS: "Pedidos",
  CLIENT: "Cliente",
};

export default function UsersForm({
  initial,
  onSubmit,
  isPending = false,
  error = null,
}: Props) {
  const form = useForm({
    defaultValues: {
      nombre: initial?.nombre ?? "",
      apellido: initial?.apellido ?? "",
      celular: initial?.celular ?? "",
      email: "",
      password: "",
      roles:
        initial?.roles?.map(
          (r) => r.codigo
        ) ?? ([] as UserRole[]),
    },
    onSubmit: async ({ value }) => {
      const data: any = {
        nombre: value.nombre,
        apellido: value.apellido,
        celular: value.celular,
        roles: value.roles,
      };

      if (initial) {
        
        if (value.email)
          data.email = value.email;
        if (value.password)
          data.password = value.password;
      } else {
        // CREATE: email y password obligatorios
        data.email = value.email;
        data.password = value.password;
      }

      onSubmit(data);
    },
  });

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 outline-none";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      {/* Nombre + Apellido */}
      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="nombre"
          validators={{
            onChange: ({ value }) =>
              !value.trim()
                ? "El nombre es obligatorio"
                : undefined,
          }}
        >
          {(field) => (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Nombre
              </label>
              <input
                className={inputClass}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value
                  )
                }
              />
              {field.state.meta.errors
                .length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {
                    field.state.meta
                      .errors[0]
                  }
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="apellido"
          validators={{
            onChange: ({ value }) =>
              !value.trim()
                ? "El apellido es obligatorio"
                : undefined,
          }}
        >
          {(field) => (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Apellido
              </label>
              <input
                className={inputClass}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value
                  )
                }
              />
              {field.state.meta.errors
                .length > 0 && (
                <p className="text-sm text-red-500 mt-1">
                  {
                    field.state.meta
                      .errors[0]
                  }
                </p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* Celular */}
      <form.Field
        name="celular"
        validators={{
          onChange: ({ value }) =>
            !value.trim()
              ? "El celular es obligatorio"
              : undefined,
        }}
      >
        {(field) => (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Celular
            </label>
            <input
              className={inputClass}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) =>
                field.handleChange(
                  e.target.value
                )
              }
            />
            {field.state.meta.errors
              .length > 0 && (
              <p className="text-sm text-red-500 mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Email */}
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            if (!initial && !value.trim())
              return "El email es obligatorio";
            if (
              value &&
              !value.includes("@")
            )
              return "Email inválido";
            return undefined;
          },
        }}
      >
        {(field) => (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Email{" "}
              {initial &&
                "(dejar vacío para mantener)"}
            </label>
            <input
              className={inputClass}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) =>
                field.handleChange(
                  e.target.value
                )
              }
              placeholder={
                initial
                  ? "sin cambios"
                  : "correo@ejemplo.com"
              }
            />
            {field.state.meta.errors
              .length > 0 && (
              <p className="text-sm text-red-500 mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Password */}
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => {
            if (!initial && !value.trim())
              return "La contraseña es obligatoria";
            if (
              value &&
              value.length < 6
            )
              return "Mínimo 6 caracteres";
            return undefined;
          },
        }}
      >
        {(field) => (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Contraseña{" "}
              {initial &&
                "(dejar vacía para mantener)"}
            </label>
            <input
              className={inputClass}
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) =>
                field.handleChange(
                  e.target.value
                )
              }
              placeholder={
                initial
                  ? "sin cambios"
                  : "••••••"
              }
            />
            {field.state.meta.errors
              .length > 0 && (
              <p className="text-sm text-red-500 mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Roles */}
      <form.Field name="roles">
        {(field) => (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Roles
            </label>
            <div className="space-y-1">
              {ALL_ROLES.map((role) => {
                const isSelected =
                  field.state.value.includes(
                    role
                  );
                return (
                  <label
                    key={role}
                    className="flex items-center gap-2 text-sm p-1 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (
                          e.target.checked
                        )
                          field.handleChange(
                            [
                              ...field
                                .state
                                .value,
                              role,
                            ]
                          );
                        else
                          field.handleChange(
                            field.state.value.filter(
                              (r) =>
                                r !== role
                            )
                          );
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>
                      {ROLES_LABEL[role]}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </form.Field>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {isPending
          ? "Guardando..."
          : initial
          ? "Actualizar Usuario"
          : "Crear Usuario"}
      </button>
    </form>
  );
}
