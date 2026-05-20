import { useForm } from "@tanstack/react-form";
import type { CreateIngrediente } from "../types/ingredientes.type";

type Props = {
  defaultValues?: CreateIngrediente;

  onSubmit: (values: CreateIngrediente) => void;
};

const IngredienteForm = ({
  defaultValues,
  onSubmit,
}: Props) => {
  const form = useForm({
    defaultValues: {
      nombre: defaultValues?.nombre ?? "",
      descripcion: defaultValues?.descripcion ?? "",
      es_alergeno: defaultValues?.es_alergeno ?? false,
    },

    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      {/* Nombre */}
      <form.Field name="nombre">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label className="font-medium">
              Nombre
            </label>

            <input
              value={field.state.value}
              onChange={(e) =>
                field.handleChange(e.target.value)
              }
              placeholder="Nombre"
              className="border rounded-lg px-3 py-2"
            />
          </div>
        )}
      </form.Field>

      {/* Descripción */}
      <form.Field name="descripcion">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label className="font-medium">
              Descripción
            </label>

            <input
              value={field.state.value}
              onChange={(e) =>
                field.handleChange(e.target.value)
              }
              placeholder="Descripción"
              className="border rounded-lg px-3 py-2"
            />
          </div>
        )}
      </form.Field>

      {/* Checkbox */}
      <form.Field name="es_alergeno">
        {(field) => (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={(e) =>
                field.handleChange(e.target.checked)
              }
            />

            <label>Es alérgeno</label>
          </div>
        )}
      </form.Field>

      {/* Botón */}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
      >
        Guardar
      </button>
    </form>
  );
}


export default IngredienteForm;