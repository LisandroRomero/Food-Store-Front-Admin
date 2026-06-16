import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";

import MultiImageUploader from "../../../shared/MultiImageUploader";

import { getCategorias } from "../../categorias/services/categorias.services";
import { getIngredientes } from "../../ingredientes/services/ingredientes.service";

import type {
  Producto,
  CreateProductoDTO,
  UpdateProductoDTO,
} from "../types/productos.type";

const UNIDADES_MEDIDA = [
  { id: 1, nombre: "kilogramo", simbolo: "kg", tipo: "masa" },
  { id: 2, nombre: "gramo", simbolo: "g", tipo: "masa" },
  { id: 3, nombre: "litro", simbolo: "L", tipo: "volumen" },
  { id: 4, nombre: "mililitro", simbolo: "mL", tipo: "volumen" },
  { id: 5, nombre: "pieza", simbolo: "u", tipo: "unidad" },
  { id: 6, nombre: "docena", simbolo: "doc", tipo: "unidad" },
  { id: 7, nombre: "metro cuadrado", simbolo: "m²", tipo: "area" },
] as const;

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
        initial?.imagenes_url ?? [],
      stock_cantidad:
        initial?.stock_cantidad ?? 0,
      disponible:
        initial?.disponible ?? true,
      unidad_medida_id:
        initial?.unidad_medida?.id,
      categorias:
        initial?.categorias?.map((c) => ({
          id: c.id,
          es_principal: c.es_principal,
        })) ?? [],
      ingredientes:
        initial?.ingredientes?.map((i) => ({
          id: i.id,
          cantidad: i.cantidad,
          es_removible: i.es_removible,
        })) ?? [],
    },
    onSubmit: async ({ value }) => {
      const formattedData: CreateProductoDTO = {
        ...value,
        ingredientes: value.ingredientes.map((i) => ({
          id: i.id,
          cantidad: i.cantidad,
          unidad_medida_id: value.unidad_medida_id,
          es_removible: i.es_removible,
        })),
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

      {/* Nombre + Precio + Unidad Medida */}
      <div className="grid grid-cols-3 gap-4">
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
                step="0.01"
                min="0"
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

        <form.Field name="unidad_medida_id">
          {(field) => (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Unidad de Medida
              </label>
              <select
                className={inputClass}
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value
                      ? Number(e.target.value)
                      : undefined as any
                  )
                }
              >
                <option value="">
                  Seleccionar...
                </option>
                {UNIDADES_MEDIDA.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} ({u.simbolo})
                  </option>
                ))}
              </select>
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
          <MultiImageUploader
            value={field.state.value}
            onChange={field.handleChange}
            label="Imágenes del producto"
          />
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
              <div className="max-h-48 overflow-y-auto space-y-1">
                {(ingData?.data ?? []).map(
                  (i: any) => {
                    const current =
                      field.state.value.find(
                        (si) => si.id === i.id
                      );
                    const isSelected = !!current;
                    return (
                      <div
                        key={i.id}
                        className="flex items-center gap-2 text-sm p-1 hover:bg-gray-50 rounded"
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
                                    cantidad: 1,
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
                          <>
                            <input
                              type="number"
                              min={0}
                              step="0.1"
                              className="w-16 rounded border border-gray-300 px-1.5 py-1 text-xs text-center outline-none focus:border-blue-500"
                              value={
                                current?.cantidad ?? 1
                              }
                              onClick={(e) =>
                                e.stopPropagation()
                              }
                              onChange={(e) =>
                                field.handleChange(
                                  field.state.value.map(
                                    (si) =>
                                      si.id === i.id
                                        ? {
                                            ...si,
                                            cantidad:
                                              Number(
                                                e.target
                                                  .value
                                              ) || 0,
                                          }
                                        : si
                                  )
                                )
                              }
                            />
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
                                current?.es_removible
                                  ? "bg-amber-600 text-white"
                                  : "bg-gray-200"
                              }`}
                            >
                              Removible
                            </button>
                          </>
                        )}
                      </div>
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
