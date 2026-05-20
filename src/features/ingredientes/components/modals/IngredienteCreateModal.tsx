import type { CreateIngrediente } from "../../types/ingredientes.type";

import IngredienteForm from "../../components/IngredienteForm";
import Modal from "../../../../shared/Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;

  onCreate: (data: CreateIngrediente) => void;
};

const IngredienteCreateModal = ({
  isOpen,
  onClose,
  onCreate,
}: Props) => {
  const handleSubmit = (
    values: CreateIngrediente
  ) => {
    onCreate(values);

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo ingrediente"
    >
      <IngredienteForm
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}
export default IngredienteCreateModal;