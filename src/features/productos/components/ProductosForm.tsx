import { useEffect } from "react";

import { useForm } from "@tanstack/react-form";

import type {
  ProductoFormValues,
} from "../types/productos.type";

type Categoria = {
  id: number;
  nombre: string;
};

type Ingrediente = {
  id: number;
  nombre: string;
};

const EMPTY_VALUES: ProductoFormValues = {
  nombre: "",
  unidad_medida_id: 1,
  descripcion: "",
  precio_base: 0,
  imagenes_url: [],
  stock_cantidad: 0,
  disponible: true,
  categorias: [],
  ingredientes: [],
};

type Props = {
  defaultValues?: ProductoFormValues;

  categorias: Categoria[];

  ingredientes: Ingrediente[];

  onSubmit: (
    values: ProductoFormValues
  ) => void | Promise<void>;

  isLoading?: boolean;
};

export default function ProductoForm({
  defaultValues,
  categorias,
  ingredientes,
  onSubmit,
  isLoading = false,
}: Props) {
  const form = useForm({
    defaultValues:
      defaultValues ?? EMPTY_VALUES,

    onSubmit: async ({
      value,
    }) => {
      console.log(
        "FORM VALUES",
        value
      );

      await onSubmit(value);
    },
  });

  useEffect(() => {
    form.reset(
      defaultValues ??
        EMPTY_VALUES
    );
  }, [defaultValues]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        e.stopPropagation();

        form.handleSubmit();
      }}
      className="
        flex
        flex-col
        gap-5
      "
    >
      {/* NOMBRE */}
      <form.Field name="nombre">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label>
              Nombre
            </label>

            <input
              type="text"
              value={
                field.state.value
              }
              onChange={(e) =>
                field.handleChange(
                  e.target.value
                )
              }
              className="
                border
                border-slate-700
                rounded-lg
                px-3
                py-2
                bg-slate-950
              "
            />
          </div>
        )}
      </form.Field>

      {/* DESCRIPCION */}
      <form.Field name="descripcion">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label>
              Descripción
            </label>

            <textarea
              value={
                field.state.value
              }
              onChange={(e) =>
                field.handleChange(
                  e.target.value
                )
              }
              className="
                border
                border-slate-700
                rounded-lg
                px-3
                py-2
                min-h-28
                bg-slate-950
              "
            />
          </div>
        )}
      </form.Field>

      {/* PRECIO */}
      <form.Field name="precio_base">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label>
              Precio
            </label>

            <input
              type="number"
              min={0}
              step="0.01"
              value={
                field.state.value
              }
              onChange={(e) =>
                field.handleChange(
                  Number(
                    e.target.value
                  )
                )
              }
              className="
                border
                border-slate-700
                rounded-lg
                px-3
                py-2
                bg-slate-950
              "
            />
          </div>
        )}
      </form.Field>

      {/* STOCK */}
      <form.Field name="stock_cantidad">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label>
              Stock
            </label>

            <input
              type="number"
              min={0}
              value={
                field.state.value
              }
              onChange={(e) =>
                field.handleChange(
                  Number(
                    e.target.value
                  )
                )
              }
              className="
                border
                border-slate-700
                rounded-lg
                px-3
                py-2
                bg-slate-950
              "
            />
          </div>
        )}
      </form.Field>

      {/* DISPONIBLE */}
      <form.Field name="disponible">
        {(field) => (
          <label
            className="
              flex
              items-center
              gap-2
            "
          >
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
            />

            Disponible
          </label>
        )}
      </form.Field>

      {/* CATEGORIAS */}
<form.Field name="categorias">
  {(field) => (
    <div className="flex flex-col gap-1">
      <label>
        Categorías
      </label>

      <select
        multiple
        value={(field.state.value ?? []).map(
          (c: any) =>
            String(c.id)
        )}
        onChange={(e) => {
          const selected =
            Array.from(
              e.target.selectedOptions
            ).map((option) => ({
              id: Number(
                option.value
              ),
              es_principal: false,
            }));

          field.handleChange(
            selected
          );
        }}
        className="
          border
          border-slate-700
          rounded-lg
          px-3
          py-2
          bg-slate-950
          min-h-40
        "
      >
        {(categorias ?? []).map(
          (categoria) => (
            <option
              key={categoria.id}
              value={categoria.id}
            >
              {categoria.nombre}
            </option>
          )
        )}
      </select>
    </div>
  )}
</form.Field>

{/* INGREDIENTES */}
<form.Field name="ingredientes">
  {(field) => (
    <div className="flex flex-col gap-1">
      <label>
        Ingredientes
      </label>

      <select
        multiple
        value={(field.state.value ?? []).map(
          (i: any) =>
            String(i.id)
        )}
        onChange={(e) => {
          const selected =
            Array.from(
              e.target.selectedOptions
            ).map((option) => ({
              id: Number(
                option.value
              ),
              cantidad: 1,
              unidad_medida_id: 1,
              es_removible: true,
            }));

          field.handleChange(
            selected
          );
        }}
        className="
          border
          border-slate-700
          rounded-lg
          px-3
          py-2
          bg-slate-950
          min-h-52
        "
      >
        {(ingredientes ?? []).map(
          (
            ingrediente
          ) => (
            <option
              key={
                ingrediente.id
              }
              value={
                ingrediente.id
              }
            >
              {
                ingrediente.nombre
              }
            </option>
          )
        )}
      </select>
    </div>
  )}
</form.Field>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={isLoading}
        className="
          bg-blue-500
          hover:bg-blue-600
          disabled:opacity-50
          text-white
          py-2
          rounded-lg
        "
      >
        {isLoading
          ? "Guardando..."
          : "Guardar"}
      </button>
    </form>
  );
}