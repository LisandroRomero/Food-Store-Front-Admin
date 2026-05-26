import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";

import { getCategorias } from "../../categorias/services/categorias.services";
import { getIngredientes } from "../../ingredientes/services/ingredientes.service";

import type {
  Producto,
  CreateProductoDTO,
  UpdateProductoDTO,
} from "../types/productos.type";

interface ProductFormProps {
  initial?: Producto | null;
  onSubmit: (
    data: CreateProductoDTO | UpdateProductoDTO
  ) => void;
  isPending: boolean;
  error: string | null;
}

export default function ProductosForm({
  initial,
  onSubmit,
  isPending,
  error,
}: ProductFormProps) {
  const { data: catData } = useQuery({
    queryKey: ["categorias-select"],
    queryFn: () => getCategorias(0, 100),
  });

  const { data: ingData } = useQuery({
    queryKey: ["ingredientes-select"],
    queryFn: () => getIngredientes(0, 100),
  });

  const form = useForm({
    defaultValues: {
      nombre: initial?.nombre ?? "",
      descripcion: initial?.descripcion ?? "",
      precio_base: initial?.precio_base ?? 0,
      imagenes_url:
        initial?.imagenes_url?.join("\n") ?? "",
      stock_cantidad:
        initial?.stock_cantidad ?? 0,
      disponible:
        initial?.disponible ?? true,
      categorias:
        initial?.categorias?.map((c) => ({
          id: c.id,
          es_principal: c.es_principal,
        })) ?? [],
      ingredientes:
        initial?.ingredientes?.map((i) => ({
          id: i.id,
          es_removible: i.es_removible,
        })) ?? [],
    },
    onSubmit: async ({ value }) => {
      const formattedData = {
        ...value,
        imagenes_url: value.imagenes_url
          .split("\n")
          .filter((u: string) => u.trim()),
        unidad_medida_id: 1,
        ingredientes: value.ingredientes.map(
          (i: { id: number; es_removible: boolean }) => ({
            id: i.id,
            cantidad: 1,
            unidad_medida_id: 1,
            es_removible: i.es_removible,
          })
        ),
      };
      onSubmit(formattedData);
    },
  });

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";

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

      {/* Nombre + Precio */}
      <div className="grid grid-cols-2 gap-4">
        <form.Field name="nombre">
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
                required
              />
            </div>
          )}
        </form.Field>

        <form.Field name="precio_base">
          {(field) => (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Precio Base
              </label>
              <input
                type="number"
                className={inputClass}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(
                    Number(e.target.value)
                  )
                }
                required
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* Descripción */}
      <form.Field name="descripcion">
        {(field) => (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Descripción
            </label>
            <textarea
              className={inputClass}
              value={field.state.value}
              onChange={(e) =>
                field.handleChange(
                  e.target.value
                )
              }
              rows={2}
            />
          </div>
        )}
      </form.Field>

      {/* Imágenes */}
      <form.Field name="imagenes_url">
        {(field) => (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Imágenes (una URL por línea)
            </label>
            <textarea
              className={inputClass}
              value={field.state.value}
              onChange={(e) =>
                field.handleChange(
                  e.target.value
                )
              }
              rows={2}
              placeholder="https://..."
            />
          </div>
        )}
      </form.Field>

      {/* Stock + Disponible */}
      <div className="flex items-center gap-4">
        <form.Field name="stock_cantidad">
          {(field) => (
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Stock
              </label>
              <input
                type="number"
                className={inputClass}
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(
                    Number(e.target.value)
                  )
                }
                required
              />
            </div>
          )}
        </form.Field>

        <form.Field name="disponible">
          {(field) => (
            <label className="flex items-center gap-2 mt-5 cursor-pointer">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) =>
                  field.handleChange(
                    e.target.checked
                  )
                }
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">
                Disponible
              </span>
            </label>
          )}
        </form.Field>
      </div>

      {/* Categorías + Ingredientes */}
      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        {/* Categorías */}
        <form.Field name="categorias">
          {(field) => (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
                Categorías
              </h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {(catData?.data ?? []).map(
                  (c: any) => {
                    const isSelected =
                      field.state.value.some(
                        (sc) => sc.id === c.id
                      );
                    return (
                      <label
                        key={c.id}
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
                                  {
                                    id: c.id,
                                    es_principal:
                                      false,
                                  },
                                ]
                              );
                            else
                              field.handleChange(
                                field.state.value.filter(
                                  (sc) =>
                                    sc.id !==
                                    c.id
                                )
                              );
                          }}
                        />
                        <span className="flex-1">
                          {c.nombre}
                        </span>
                        {isSelected && (
                          <button
                            type="button"
                            onClick={() =>
                              field.handleChange(
                                field.state.value.map(
                                  (sc) =>
                                    sc.id ===
                                    c.id
                                      ? {
                                          ...sc,
                                          es_principal:
                                            !sc.es_principal,
                                        }
                                      : sc
                                )
                              )
                            }
                            className={`text-[10px] px-1 rounded ${
                              field.state.value.find(
                                (sc) =>
                                  sc.id === c.id
                              )
                                ?.es_principal
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200"
                            }`}
                          >
                            Principal
                          </button>
                        )}
                      </label>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </form.Field>

        {/* Ingredientes */}
        <form.Field name="ingredientes">
          {(field) => (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
                Ingredientes
              </h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {(ingData?.data ?? []).map(
                  (i: any) => {
                    const isSelected =
                      field.state.value.some(
                        (si) => si.id === i.id
                      );
                    return (
                      <label
                        key={i.id}
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
                                  {
                                    id: i.id,
                                    es_removible:
                                      false,
                                  },
                                ]
                              );
                            else
                              field.handleChange(
                                field.state.value.filter(
                                  (si) =>
                                    si.id !==
                                    i.id
                                )
                              );
                          }}
                        />
                        <span className="flex-1">
                          {i.nombre}
                        </span>
                        {isSelected && (
                          <button
                            type="button"
                            onClick={() =>
                              field.handleChange(
                                field.state.value.map(
                                  (si) =>
                                    si.id ===
                                    i.id
                                      ? {
                                          ...si,
                                          es_removible:
                                            !si.es_removible,
                                        }
                                      : si
                                )
                              )
                            }
                            className={`text-[10px] px-1 rounded ${
                              field.state.value.find(
                                (si) =>
                                  si.id === i.id
                              )
                                ?.es_removible
                                ? "bg-amber-600 text-white"
                                : "bg-gray-200"
                            }`}
                          >
                            Removible
                          </button>
                        )}
                      </label>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </form.Field>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {isPending
          ? "Guardando..."
          : initial
          ? "Actualizar Producto"
          : "Crear Producto"}
      </button>
    </form>
  );
}
