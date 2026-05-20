import type {
  CreateProducto,
} from "../../types/productos.type";

import ProductoForm from "../ProductosForm";

import Modal from "../../../../shared/Modal";

type Props = {
  isOpen: boolean;

  onClose: () => void;

  onCreate: (
    data: CreateProducto
  ) => void;
};

export default function ProductoCreateModal({
  isOpen,
  onClose,
  onCreate,
}: Props) {
  const handleSubmit = (
    values: CreateProducto
  ) => {
    onCreate(values);

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo producto"
    >
      <ProductoForm
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}