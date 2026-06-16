export interface IIngredienteProductoBasic {
  id: number;
  nombre: string;
  precio_base: number;
  stock_cantidad: number;
}

export interface IIngredienteUnidadMedida {
  nombre: string;
  simbolo: string;
  tipo: string;
}

export interface IIngrediente {
  id: number;
  nombre: string;
  descripcion: string;
  stock_cantidad: number;
  unidad_medida: IIngredienteUnidadMedida | null;
  es_alergeno: boolean;
  activo: boolean;
  created_at: string;
  updated_at: string;
  producto_links: IIngredienteProductoBasic[];
}

export interface IIngredienteCreate {
  nombre: string;
  descripcion: string;
  stock_cantidad: number;
  unidad_medida_id: number;
  es_alergeno?: boolean;
}

export interface IIngredienteUpdate {
  nombre?: string;
  descripcion?: string;
  stock_cantidad?: number;
  unidad_medida_id?: number;
  es_alergeno?: boolean;
}

export interface IIngredientePaginado {
  total: number;
  data: IIngrediente[];
}
