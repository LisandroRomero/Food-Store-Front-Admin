import type { ICategoriaCreate } from "../../types/categorias.types";

import CategoriaForm from "../CategoriasForm";

import Modal from "../../../../shared/Modal";

type Props = {
  isOpen: boolean;

  onClose: () => void;

  onCreate: (
    data: ICategoriaCreate
  ) => void;
};

const CategoriasCreateModal =({
  isOpen,
  onClose,
  onCreate,
}: Props) =>{
  const handleSubmit = (
    values: ICategoriaCreate
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