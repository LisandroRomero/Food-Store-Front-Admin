import { useForm } from "@tanstack/react-form";

import { useEffect } from "react";

import type {
  CreateProducto,
} from "../types/productos.type";

const EMPTY_VALUES: CreateProducto = {
  nombre: "",
  descripcion: "",
  imagenes_url: [],
  precio_base: 0,
  stock_cantidad: 0,
  disponible: true,
  categoria_ids: [],
  ingrediente_ids: [],
};

type Props = {
  defaultValues?: CreateProducto;

  onSubmit: (
    values: CreateProducto
  ) => void;
};

export default function ProductoForm({
  defaultValues,
  onSubmit,
}: Props) {
  const form = useForm({
    defaultValues: EMPTY_VALUES,

    onSubmit: async ({
      value,
    }) => {
      onSubmit(value);
    },
  });

  // RESET PARA EDIT
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    } else {
      form.reset(EMPTY_VALUES);
    }
  }, [defaultValues, form]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        form.handleSubmit();
      }}
      className="
        flex
        flex-col
        gap-4
      "
    >
      {/* NOMBRE */}
      <form.Field name="nombre">
        {(field) => (
          <div
            className="
              flex
              flex-col
              gap-1
            "
          >
            <label className="font-medium">
              Nombre
            </label>

            <input
              value={
                field.state.value
              }
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
                bg-slate-950
                text-slate-100
              "
            />
          </div>
        )}
      </form.Field>

      {/* DESCRIPCION */}
      <form.Field name="descripcion">
        {(field) => (
          <div
            className="
              flex
              flex-col
              gap-1
            "
          >
            <label className="font-medium">
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
              placeholder="Descripción"
              className="
                border
                border-gray-300
                rounded-lg
                px-3
                py-2
                bg-slate-950
                text-slate-100
              "
            />
          </div>
        )}
      </form.Field>

      {/* IMAGENES */}
      <form.Field name="imagenes_url">
        {(field) => (
          <div
            className="
              flex
              flex-col
              gap-1
            "
          >
            <label className="font-medium">
              Imágenes URL
            </label>

            <input
              value={(
                field.state.value ??
                []
              ).join(",")}
              onChange={(e) =>
                field.handleChange(
                  e.target.value
                    .split(",")
                    .map((url) => url.trim())
                    .filter(Boolean)
                )
              }
              placeholder="url1,url2"
              className="
                border
                border-gray-300
                rounded-lg
                px-3
                py-2
                bg-slate-950
                text-slate-100
              "
            />
          </div>
        )}
      </form.Field>

      {/* PRECIO */}
      <form.Field name="precio_base">
        {(field) => (
          <div
            className="
              flex
              flex-col
              gap-1
            "
          >
            <label className="font-medium">
              Precio base
            </label>

            <input
              type="number"
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
              placeholder="Precio"
              className="
                border
                border-gray-300
                rounded-lg
                px-3
                py-2
                bg-slate-950
                text-slate-100
              "
            />
          </div>
        )}
      </form.Field>

      {/* STOCK */}
      <form.Field name="stock_cantidad">
        {(field) => (
          <div
            className="
              flex
              flex-col
              gap-1
            "
          >
            <label className="font-medium">
              Stock
            </label>

            <input
              type="number"
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
              placeholder="Stock"
              className="
                border
                border-gray-300
                rounded-lg
                px-3
                py-2
                bg-slate-950
                text-slate-100
              "
            />
          </div>
        )}
      </form.Field>

      {/* DISPONIBLE */}
      <form.Field name="disponible">
        {(field) => (
          <div
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

            <label>
              Disponible
            </label>
          </div>
        )}
      </form.Field>

      {/* CATEGORIAS */}
      <form.Field name="categoria_ids">
        {(field) => (
          <div
            className="
              flex
              flex-col
              gap-1
            "
          >
            <label className="font-medium">
              IDs Categorías
            </label>

            <input
              value={(
                field.state.value ??
                []
              ).join(",")}
              onChange={(e) =>
                field.handleChange(
                  e.target.value
                    .split(",")
                    .map((id) =>
                      Number(id.trim())
                    )
                    .filter(
                      (n) => !isNaN(n)
                    )
                )
              }
              placeholder="1,2,3"
              className="
                border
                border-gray-300
                rounded-lg
                px-3
                py-2
                bg-slate-950
                text-slate-100
              "
            />
          </div>
        )}
      </form.Field>

      {/* INGREDIENTES */}
      <form.Field name="ingrediente_ids">
        {(field) => (
          <div
            className="
              flex
              flex-col
              gap-1
            "
          >
            <label className="font-medium">
              IDs Ingredientes
            </label>

            <input
              value={(
                field.state.value ??
                []
              ).join(",")}
              onChange={(e) =>
                field.handleChange(
                  e.target.value
                    .split(",")
                    .map((id) =>
                      Number(id.trim())
                    )
                    .filter(
                      (n) => !isNaN(n)
                    )
                )
              }
              placeholder="1,2,3"
              className="
                border
                border-gray-300
                rounded-lg
                px-3
                py-2
                bg-slate-950
                text-slate-100
              "
            />
          </div>
        )}
      </form.Field>

      {/* SUBMIT */}
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
