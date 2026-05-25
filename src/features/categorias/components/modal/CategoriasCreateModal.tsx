import type { CreateCategoria } from "../../types/categorias.types";

import CategoriaForm from "../CategoriasForm";

import Modal from "../../../../shared/Modal";

type Props = {
  isOpen: boolean;

  onClose: () => void;

  onCreate: (
    data: CreateCategoria
  ) => void;
};

const CategoriasCreateModal =({
  isOpen,
  onClose,
  onCreate,
}: Props) =>{
  const handleSubmit = (
    values: CreateCategoria
  ) => {
    onCreate(values);

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva categoría"
    >
      <CategoriaForm
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}

export default CategoriasCreateModal;