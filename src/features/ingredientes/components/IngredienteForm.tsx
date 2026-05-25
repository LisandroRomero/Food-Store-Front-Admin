import { useForm } from "@tanstack/react-form";

import type {
  CreateIngrediente,
  UpdateIngrediente,
} from "../types/ingredientes.type";

type Props = {
  defaultValues?:
    | CreateIngrediente
    | UpdateIngrediente;

  onSubmit: (
    values:
      | CreateIngrediente
      | UpdateIngrediente
  ) => void;

  submitText?: string;
};

const IngredienteForm = ({
  defaultValues,
  onSubmit,
  submitText = "Guardar",
}: Props) => {
  const form = useForm({
    defaultValues: {
      nombre: defaultValues?.nombre ?? "",
      descripcion:
        defaultValues?.descripcion ?? "",
      es_alergeno:
        defaultValues?.es_alergeno ?? false,
    },

    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      {/* Nombre */}
      <form.Field
        name="nombre"
        validators={{
          onChange: ({ value }) =>
            !value
              ? "El nombre es obligatorio"
              : undefined,
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-1">
            <label className="font-medium">
              Nombre
            </label>

            <input
              value={field.state.value}
              onChange={(e) =>
                field.handleChange(
                  e.target.value
                )
              }
              placeholder="Ingrese un nombre"
              className="border rounded-lg px-3 py-2"
            />

            {field.state.meta.errors.length >
              0 && (
              <span className="text-red-500 text-sm">
                {
                  field.state.meta.errors[0]
                }
              </span>
            )}
          </div>
        )}
      </form.Field>

      {/* Descripción */}
      <form.Field
        name="descripcion"
        validators={{
          onChange: ({ value }) =>
            !value
              ? "La descripción es obligatoria"
              : undefined,
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-1">
            <label className="font-medium">
              Descripción
            </label>

            <textarea
              value={field.state.value}
              onChange={(e) =>
                field.handleChange(
                  e.target.value
                )
              }
              placeholder="Ingrese una descripción"
              rows={4}
              className="border rounded-lg px-3 py-2 resize-none"
            />

            {field.state.meta.errors.length >
              0 && (
              <span className="text-red-500 text-sm">
                {
                  field.state.meta.errors[0]
                }
              </span>
            )}
          </div>
        )}
      </form.Field>

      {/* Es alérgeno */}
      <form.Field name="es_alergeno">
        {(field) => (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={(e) =>
                field.handleChange(
                  e.target.checked
                )
              }
              className="w-4 h-4"
            />

            <span>Es alérgeno</span>
          </label>
        )}
      </form.Field>

      {/* Botón */}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 transition-colors text-white py-2 rounded-lg"
      >
        {submitText}
      </button>
    </form>
  );
};

export default IngredienteForm;