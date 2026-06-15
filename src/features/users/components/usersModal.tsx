import Modal from "../../../shared/Modal";
import UsersForm from "./UsersForm";
import type { UserPublic, IUserCreate, IUserUpdate } from "../types/users.types";

type UsersModalProps = {
  open: boolean;
  onClose: () => void;
  initial?: UserPublic | null;
  onSubmit: (data: IUserCreate | IUserUpdate) => void;
  isPending?: boolean;
  error?: string | null;
};

export default function UsersModal({
  open,
  onClose,
  initial,
  onSubmit,
  isPending,
  error,
}: UsersModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Editar Usuario" : "Nuevo Usuario"}>
      <UsersForm
        initial={initial}
        onSubmit={onSubmit}
        isPending={isPending}
        error={error}
      />
    </Modal>
  );
}