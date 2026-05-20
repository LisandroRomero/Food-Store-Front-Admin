import type { ICategoria } from "../../categorias/types/categorias.types";
import type { IIngrediente } from "../../ingredientes/types/ingredientes.type";

export interface IProducto {
  id: number;
  nombre: string
  descripcion: string;
  imagenes_url: string[];
  precio_base: number;
  stock_cantidad: number;
  disponible: boolean;
  categorias: ICategoria[];
  ingredientes: IIngrediente[]
}

export interface IProductoResponse {
  data: IProducto[];
  total: number;
}

export type CreateProducto = {
  nombre: string;
  descripcion?: string;
  precio_base: number;
  imagenes_url: string[];
  stock_cantidad: number;
  disponible: boolean;

  categoria_ids: number[];
  ingrediente_ids: number[];
};