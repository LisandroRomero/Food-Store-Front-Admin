import type {
  ICategoria,
  CreateCategoria,
} from "../../types/categorias.types";

import CategoriaForm from "../CategoriasForm";

import Modal from "../../../../shared/Modal";

type Props = {
  isOpen: boolean;

  categoria: ICategoria;

  onClose: () => void;

  onUpdate: (
    id: number,
    data: CreateCategoria
  ) => void;
};

const CategoriasUpdateModal = ({ isOpen, categoria, onClose, onUpdate }: Props) => {
  const handleSubmit = (
    values: CreateCategoria
  ) => {
    onUpdate(categoria.id, values);

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar categoría"
    >
      <CategoriaForm
        defaultValues={categoria}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}
export default CategoriaUpdateModal;