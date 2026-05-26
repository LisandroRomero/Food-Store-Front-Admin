import { create } from "zustand";

import {
  getCategorias,
} from "../../categorias/services/categorias.services";

import {
  getIngredientes,
} from "../../ingredientes/services/ingredientes.service";

type Categoria = {
  id: number;
  nombre: string;
};

type Ingrediente = {
  id: number;
  nombre: string;
};

type CatalogosStore = {
  categorias: Categoria[];

  ingredientes: Ingrediente[];

  isLoading: boolean;

  loadCatalogos: () => Promise<void>;
};

export const useCatalogosStore =
  create<CatalogosStore>(
    (set) => ({
      categorias: [],

      ingredientes: [],

      isLoading: false,

      loadCatalogos:
        async () => {
          set({
            isLoading: true,
          });

          try {
            const [
              categoriasResponse,
              ingredientesResponse,
            ] = await Promise.all([
              getCategorias(),
              getIngredientes(),
            ]);

            set({
              categorias:
                categoriasResponse.data,
              ingredientes:
                ingredientesResponse.data,
            });
          } catch (error) {
            console.error(
              "Error cargando catálogos",
              error
            );
          } finally {
            set({
              isLoading: false,
            });
          }
        },
    })
  );