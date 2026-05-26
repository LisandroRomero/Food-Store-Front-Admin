export interface ICategoria {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  parent_id: number | null;
}

export interface ICategoriaCreate {
  nombre: string;
  descripcion: string;
  imagen_url?: string;
  parent_id?: number | null;
}

export interface ICategoriaUpdate {
  nombre?: string;
  descripcion?: string;
  imagen_url?: string;
  parent_id?: number | null;
}

export interface ICategoriaPaginado {
  total: number;
  data: ICategoria[];
}
