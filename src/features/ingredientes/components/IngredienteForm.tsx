import { useForm } from "@tanstack/react-form";

import type {
  IIngrediente,
  IIngredienteCreate,
  IIngredienteUpdate,
} from "../types/ingredientes.type";

const UNIDADES_MEDIDA = [
  { id: 1, nombre: "kilogramo", simbolo: "kg", tipo: "masa" },
  { id: 2, nombre: "gramo", simbolo: "g", tipo: "masa" },
  { id: 3, nombre: "litro", simbolo: "L", tipo: "volumen" },
  { id: 4, nombre: "mililitro", simbolo: "mL", tipo: "volumen" },
  { id: 5, nombre: "pieza", simbolo: "u", tipo: "unidad" },
  { id: 6, nombre: "docena", simbolo: "doc", tipo: "unidad" },
  { id: 7, nombre: "metro cuadrado", simbolo: "m²", tipo: "area" },
];

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
  const defaultUnidadId =
    UNIDADES_MEDIDA.find(
      (u) =>
        u.nombre ===
        initial?.unidad_medida?.nombre
    )?.id ?? undefined;

  const form = useForm({
    defaultValues: {
      nombre: initial?.nombre ?? "",
      descripcion:
        initial?.descripcion ?? "",
      es_alergeno:
        initial?.es_alergeno ?? false,
      stock_cantidad:
        initial?.stock_cantidad ?? 0,
      unidad_medida_id: defaultUnidadId,
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

      <form.Field
        name="stock_cantidad"
        validators={{
          onChange: ({ value }) =>
            value < 0
              ? "El stock no puede ser negativo"
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
              Stock
            </label>

            <input
              type="number"
              min={0}
              className={inputClass}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) =>
                field.handleChange(
                  Number(e.target.value)
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

      <form.Field name="unidad_medida_id">
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
              Unidad de Medida
            </label>

            <select
              className={inputClass}
              value={
                field.state.value ?? ""
              }
              onBlur={field.handleBlur}
              onChange={(e) =>
                field.handleChange(() =>
                  e.target.value
                    ? Number(e.target.value)
                    : undefined
                )
              }
            >
              <option value="">
                Seleccionar...
              </option>

              {UNIDADES_MEDIDA.map((u) => (
                <option
                  key={u.id}
                  value={u.id}
                >
                  {u.nombre} ({u.simbolo})
                </option>
              ))}
            </select>

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