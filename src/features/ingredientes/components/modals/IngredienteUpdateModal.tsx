import type {
  IIngrediente,
  CreateIngrediente,
} from "../../types/ingredientes.type";

import IngredienteForm from "../../components/IngredienteForm";
import Modal from "../../../../shared/Modal";

type Props = {
  isOpen: boolean;

  ingrediente: IIngrediente;

  onClose: () => void;

  onUpdate: (
    id: number,
    data: CreateIngrediente
  ) => void;
};

const IngredienteUpdateModal = ({
  isOpen,
  ingrediente,
  onClose,
  onUpdate,
}: Props) => {
  const handleSubmit = (
    values: CreateIngrediente
  ) => {
    onUpdate(ingrediente.id, values);

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar ingrediente"
    >
      <IngredienteForm
        defaultValues={ingrediente}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}

export default IngredienteUpdateModal;