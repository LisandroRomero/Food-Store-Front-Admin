export interface IProductoBasic {
  id: number;
  nombre: string;
}

export interface IIngrediente {
  id: number;
  nombre: string;
  descripcion: string;
  es_alergeno: boolean;
  activo: boolean;
  created_at: string;
  updated_at: string;
  producto_links?: IProductoBasic[];
}

export interface IIngredienteResponse {
  total: number;
  data: IIngrediente[];
}

export interface CreateIngrediente {
  nombre: string;
  descripcion: string;
  es_alergeno?: boolean;
}

export interface UpdateIngrediente {
  nombre?: string;
  descripcion?: string;
  es_alergeno?: boolean;
}