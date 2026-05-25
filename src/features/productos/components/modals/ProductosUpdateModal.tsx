import type {
  Producto,
  UpdateProductoDTO,
  ProductoFormValues,
} from "../../types/productos.type";

import ProductoForm from "../ProductosForm";

import Modal from "../../../../shared/Modal";

type Categoria = {
  id: number;
  nombre: string;
};

type Ingrediente = {
  id: number;
  nombre: string;
};

type Props = {
  isOpen: boolean;

  isLoading?: boolean;

  producto: Producto;

  categorias: Categoria[];

  ingredientes: Ingrediente[];

  onClose: () => void;

  onUpdate: (
    id: number,
    data: UpdateProductoDTO
  ) => void | Promise<void>;
};

export default function ProductoUpdateModal({
  isOpen,
  isLoading = false,
  producto,
  categorias,
  ingredientes,
  onClose,
  onUpdate,
}: Props) {

  const defaultValues: ProductoFormValues =
    {
      nombre: producto.nombre,

      descripcion:
        producto.descripcion ?? "",

      precio_base:
        producto.precio_base,

      imagenes_url:
        producto.imagenes_url ?? [],

      stock_cantidad:
        producto.stock_cantidad,

      disponible:
        producto.disponible,

      unidad_medida_id:
        producto.unidad_medida?.id ?? 1,

      categorias:
        producto.categorias.map(
          (categoria) => ({
            id: categoria.id,

            es_principal:
              categoria.es_principal,
          })
        ),

      ingredientes:
        producto.ingredientes.map(
          (ingrediente) => ({
            id: ingrediente.id,

            cantidad:
              ingrediente.cantidad,

            unidad_medida_id:
              ingrediente
                .unidad_medida?.id ?? 1,

            es_removible:
              ingrediente.es_removible,
          })
        ),
    };

  const handleSubmit = async (
    values: ProductoFormValues
  ) => {
    await onUpdate(
      producto.id,
      values
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar producto"
    >
      <ProductoForm
        defaultValues={
          defaultValues
        }
        categorias={categorias}
        ingredientes={ingredientes}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Modal>
  );
}