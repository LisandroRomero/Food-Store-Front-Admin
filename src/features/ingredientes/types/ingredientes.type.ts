export interface IIngrediente {
    id: number
    nombre: string
    descripcion: string
    es_alergeno:boolean
}

export interface IIngredientesResponse {
  data: IIngrediente[];
  total: number;
};

export type CreateIngrediente = Omit<IIngrediente, "id">;