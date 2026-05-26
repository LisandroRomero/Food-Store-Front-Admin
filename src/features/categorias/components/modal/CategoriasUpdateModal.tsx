import type {
  ICategoria,
  ICategoriaCreate,
} from "../../types/categorias.types";

import CategoriaForm from "../CategoriasForm";

import Modal from "../../../../shared/Modal";

type Props = {
  isOpen: boolean;

  categoria: ICategoria;

  onClose: () => void;

  onUpdate: (
    id: number,
    data: ICategoriaCreate
  ) => void;
};

const CategoriasUpdateModal = ({ isOpen, categoria, onClose, onUpdate }: Props) => {
  const handleSubmit = (
    values: ICategoriaCreate
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
        initial={categoria}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}
export default CategoriasUpdateModal;