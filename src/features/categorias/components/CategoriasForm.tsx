import { useForm } from "@tanstack/react-form";

import type {
  ICategoria,
  ICategoriaCreate,
  ICategoriaUpdate,
} from "../types/categorias.types";

type Props = {
  initial?: ICategoria | null;

  onSubmit: (
    values: ICategoriaCreate | ICategoriaUpdate
  ) => void;

  isPending?: boolean;
  error?: string | null;
};

const CategoriaForm = ({
  initial,
  onSubmit,
  isPending = false,
  error = null,
}: Props) => {
  const form = useForm({
    defaultValues: {
      nombre: initial?.nombre ?? "",
      descripcion: initial?.descripcion ?? "",
      imagen_url: initial?.imagen_url ?? "",
      parent_id: initial?.parent_id ?? null,
    },

    onSubmit: async ({ value }) => {
      onSubmit(value);
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
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500 mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="descripcion"
        validators={{
          onChange: ({ value }) =>
            !value.trim()
              ? "La descripción es obligatoria"
              : undefined,
        }}
      >
        {(field) => (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Descripción
            </label>
            <textarea
              className={inputClass}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              rows={3}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-500 mt-1">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="imagen_url">
        {(field) => (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              URL de imagen
            </label>
            <input
              className={inputClass}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="https://..."
            />
          </div>
        )}
      </form.Field>

      <form.Field name="parent_id">
        {(field) => (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Categoría padre (ID)
            </label>
            <input
              type="number"
              className={inputClass}
              value={field.state.value ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                field.handleChange(value === "" ? null : Number(value));
              }}
              placeholder="ID de categoría padre"
            />
          </div>
        )}
      </form.Field>

      <button
        type="submit"
        disabled={isPending}
        className="
          w-full
          bg-blue-600
          text-white
          font-semibold
          py-2
          rounded-lg
          hover:bg-blue-700
          transition-colors
          disabled:opacity-50
        "
      >
        {isPending
          ? "Guardando..."
          : initial
          ? "Actualizar"
          : "Crear"}
      </button>
    </form>
  );
};

export default CategoriaForm;
