// ========================================
// BASE TYPES
// ========================================

export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface Activable {
  activo: boolean;
}

export interface Disponible {
  disponible: boolean;
}

// ========================================
// ENUMS / UNIONS
// ========================================

export type UnidadTipo =
  | "masa"
  | "volumen"
  | "unidad";

// ========================================
// UNIDAD DE MEDIDA
// ========================================

export interface UnidadMedida {
  id?: number;

  nombre: string;

  simbolo: string;

  tipo: UnidadTipo;
}

// ========================================
// CATEGORÍA
// ========================================

export interface CategoriaBasic {
  id: number;

  nombre: string;

  es_principal: boolean;
}

// ========================================
// INGREDIENTE
// ========================================

export interface IngredienteBasic {
  id: number;

  nombre: string;

  es_alergeno: boolean;

  cantidad: number;

  unidad_medida: UnidadMedida;

  es_removible: boolean;
}

// ========================================
// PRODUCTO (READ MODEL)
// ========================================

export interface Producto
  extends BaseEntity,
    Activable,
    Disponible {
  nombre: string;

  unidad_medida: UnidadMedida;

  descripcion?: string;

  precio_base: number;

  imagenes_url: string[];

  stock_cantidad: number;

  categorias: CategoriaBasic[];

  ingredientes: IngredienteBasic[];
}

// ========================================
// PRODUCTO CREATE/UPDATE HELPERS
// ========================================

export interface ProductoCategoriaDTO {
  id: number;

  es_principal: boolean;
}

export interface ProductoIngredienteDTO {
  id: number;

  cantidad: number;

  unidad_medida_id: number;

  es_removible: boolean;
}

// ========================================
// CREATE DTO
// ========================================

export interface CreateProductoDTO {
  nombre: string;

  unidad_medida_id: number;

  descripcion: string;

  precio_base: number;

  imagenes_url: string[];

  stock_cantidad: number;

  disponible: boolean;

  categorias: ProductoCategoriaDTO[];

  ingredientes: ProductoIngredienteDTO[];
}

// ========================================
// UPDATE DTO
// ========================================

export interface UpdateProductoDTO {
  nombre?: string;

  unidad_medida_id?: number;

  descripcion?: string;

  precio_base?: number;

  imagenes_url?: string[];

  stock_cantidad?: number;

  disponible?: boolean;

  categorias?: ProductoCategoriaDTO[];

  ingredientes?: ProductoIngredienteDTO[];
}

// ========================================
// DISPONIBILIDAD DTO
// ========================================

export interface ProductoDisponibilidadDTO {
  disponible: boolean;
}

// ========================================
// RESPONSE PAGINADA
// ========================================

export interface ProductosResponse {
  total: number;

  data: Producto[];
}

// ========================================
// FILTROS
// ========================================

export interface ProductoFilters {
  offset?: number;

  limit?: number;

  nombre?: string;

  categoria_id?: number;

  disponible?: boolean;
}

// ========================================
// FORM TYPES
// ========================================

export interface ProductoCategoriaForm {
  id: number;

  es_principal: boolean;
}

export interface ProductoIngredienteForm {
  id: number;

  cantidad: number;

  unidad_medida_id: number;

  es_removible: boolean;
}

export interface ProductoFormValues {
  nombre: string;

  unidad_medida_id: number;

  descripcion: string;

  precio_base: number;

  imagenes_url: string[];

  stock_cantidad: number;

  disponible: boolean;

  categorias: ProductoCategoriaForm[];

  ingredientes: ProductoIngredienteForm[];
}

