import type {
  IIngrediente,
  UpdateIngrediente,
} from "../../types/ingredientes.type";

import IngredienteForm from "../../components/IngredienteForm";
import Modal from "../../../../shared/Modal";

type Props = {
  isOpen: boolean;

  ingrediente: IIngrediente;

  onClose: () => void;

  onUpdate: (
    id: number,
    data: UpdateIngrediente
  ) => void;
};

const IngredienteUpdateModal = ({
  isOpen,
  ingrediente,
  onClose,
  onUpdate,
}: Props) => {
  const handleSubmit = (
    values: UpdateIngrediente
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
        defaultValues={{
          nombre: ingrediente.nombre,
          descripcion:
            ingrediente.descripcion,
          es_alergeno:
            ingrediente.es_alergeno,
        }}
        onSubmit={handleSubmit}
        submitText="Actualizar"
      />
    </Modal>
  );
};

export default IngredienteUpdateModal;