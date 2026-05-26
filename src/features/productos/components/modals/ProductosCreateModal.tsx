import { useQuery } from "@tanstack/react-query";

import ProductoForm from "../ProductosForm";

import type {
  ProductoFormValues,
} from "../../types/productos.type";

import {
  getCategorias,
} from "../../../categorias/services/categorias.services";

import {
  getIngredientes,
} from "../../../ingredientes/services/ingredientes.service";

type Props = {
  isOpen: boolean;

  onClose: () => void;

  onSubmit: (
    values: ProductoFormValues
  ) => void | Promise<void>;

  isLoading?: boolean;
};

export default function ProductosCreateModal({
  isOpen: open,
  onClose,
  onSubmit,
  isLoading = false,
}: Props) {

  const {
    data: categoriasResp,
    isLoading: categoriasLoading,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });

  const {
    data: ingredientesResp,
    isLoading: ingredientesLoading,
  } = useQuery({
    queryKey: ["ingredientes"],
    queryFn: getIngredientes,
  });

  const categorias = categoriasResp?.data ?? [];
  const ingredientes = ingredientesResp?.data ?? [];

  if (!open) return null;

  const loading =
    categoriasLoading ||
    ingredientesLoading;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/50
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          bg-slate-900
          p-6
          rounded-xl
          w-full
          max-w-2xl
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            mb-5
          "
        >
          <h2
            className="
              text-xl
              font-semibold
            "
          >
            Crear producto
          </h2>

          <button
            onClick={onClose}
            className="
              text-slate-400
              hover:text-white
            "
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div
            className="
              py-10
              text-center
              text-slate-400
            "
          >
            Cargando datos...
          </div>
        ) : (
          <ProductoForm
            categorias={categorias ?? []}
            ingredientes={ingredientes ?? []}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}