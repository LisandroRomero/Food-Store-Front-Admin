import type {
  IProducto,
  CreateProducto,
} from "../../types/productos.type";

import ProductoForm from "../ProductosForm";

import Modal from "../../../../shared/Modal";

type Props = {
  isOpen: boolean;

  producto: IProducto;

  onClose: () => void;

  onUpdate: (
    id: number,
    data: CreateProducto
  ) => void;
};

export default function ProductoUpdateModal({
  isOpen,
  producto,
  onClose,
  onUpdate,
}: Props) {
  const handleSubmit = (
    values: CreateProducto
  ) => {
    onUpdate(
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
        defaultValues={{
          ...producto,
          categoria_ids: producto.categorias?.map((cat) => cat.id) ?? [],
          ingrediente_ids: producto.ingredientes?.map((ing) => ing.id) ?? [],
        }}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}