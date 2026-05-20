export interface ICategoria {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  parent_id: number | null;
}

export interface ICategoriaResponse {
  data: ICategoria[];
  total: number;
};

export type CreateCategoria = Omit<ICategoria, "id">