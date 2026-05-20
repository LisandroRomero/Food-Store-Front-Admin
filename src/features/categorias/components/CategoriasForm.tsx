import { useForm } from "@tanstack/react-form";

import type { CreateCategoria } from "../types/categorias.types";

type Props = {
  defaultValues?: CreateCategoria;

  onSubmit: (values: CreateCategoria) => void;
};

export default function CategoriaForm({
  defaultValues,
  onSubmit,
}: Props) {
  const form = useForm({
    defaultValues: {
      nombre: defaultValues?.nombre ?? "",

      descripcion:
        defaultValues?.descripcion ?? "",

      imagen_url: defaultValues?.imagen_url ?? "",

      parent_id:
        defaultValues?.parent_id ?? null,
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
                field.handleChange(
                  e.target.value
                )
              }
              placeholder="Nombre"
              className="
                border
                border-gray-300
                rounded-lg
                px-3
                py-2
              "
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
                field.handleChange(
                  e.target.value
                )
              }
              placeholder="Descripción"
              className="
                border
                border-gray-300
                rounded-lg
                px-3
                py-2
              "
            />
          </div>
        )}
      </form.Field>

      {/* Imagen URL */}
      <form.Field name="imagen_url">
        {(field) => (
          <input type="hidden" value={field.state.value} readOnly />
        )}
      </form.Field>

      {/* Parent ID */}
      <form.Field name="parent_id">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label className="font-medium">
              Categoría padre
            </label>

            <input
              type="number"
              value={
                field.state.value ?? ""
              }
              onChange={(e) => {
                const value =
                  e.target.value;

                field.handleChange(
                  value === ""
                    ? null
                    : Number(value)
                );
              }}
              placeholder="Parent ID"
              className="
                border
                border-gray-300
                rounded-lg
                px-3
                py-2
              "
            />
          </div>
        )}
      </form.Field>

      {/* Submit */}
      <button
        type="submit"
        className="
          bg-blue-500
          hover:bg-blue-600
          text-white
          py-2
          rounded-lg
          transition
        "
      >
        Guardar
      </button>
    </form>
  );
}
