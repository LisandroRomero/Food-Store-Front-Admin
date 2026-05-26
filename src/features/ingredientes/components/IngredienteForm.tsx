import { useForm } from "@tanstack/react-form";

import type {
  IIngrediente,
  IIngredienteCreate,
  IIngredienteUpdate,
} from "../types/ingredientes.type";

type Props = {
  initial?: IIngrediente | null;

  onSubmit: (
    values:
      | IIngredienteCreate
      | IIngredienteUpdate
  ) => void;

  isPending?: boolean;
  error?: string | null;
};

const IngredienteForm = ({
  initial,
  onSubmit,
  isPending = false,
  error = null,
}: Props) => {
  const form = useForm({
    defaultValues: {
      nombre: initial?.nombre ?? "",
      descripcion:
        initial?.descripcion ?? "",
      es_alergeno:
        initial?.es_alergeno ?? false,
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
          onChange: ({
            value,
          }) =>
            !value.trim()
              ? "El nombre es obligatorio"
              : undefined,
        }}
      >
        {(field) => (
          <div>
            <label
              className="
                block
                text-xs
                font-medium
                text-gray-500
                mb-1
              "
            >
              Nombre
            </label>

            <input
              className={inputClass}
              value={
                field.state.value
              }
              onBlur={
                field.handleBlur
              }
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
        name="descripcion"
        validators={{
          onChange: ({
            value,
          }) =>
            !value.trim()
              ? "La descripción es obligatoria"
              : undefined,
        }}
      >
        {(field) => (
          <div>
            <label
              className="
                block
                text-xs
                font-medium
                text-gray-500
                mb-1
              "
            >
              Descripción
            </label>

            <textarea
              className={inputClass}
              value={
                field.state.value
              }
              onBlur={
                field.handleBlur
              }
              onChange={(e) =>
                field.handleChange(
                  e.target.value
                )
              }
              rows={3}
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

      <form.Field name="es_alergeno">
        {(field) => (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={
                field.state.value
              }
              onChange={(e) =>
                field.handleChange(
                  e.target.checked
                )
              }
              className="w-4 h-4 text-blue-600"
            />

            <span
              className="
                text-sm
                text-gray-700
                font-medium
              "
            >
              Contiene
              Alérgenos
            </span>
          </label>
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

export default IngredienteForm;