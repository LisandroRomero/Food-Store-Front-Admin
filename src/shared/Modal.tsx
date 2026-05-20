type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) => {

  if (!isOpen) return null;

  return (
    
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >

      <div
        className="bg-slate-900 text-slate-100 w-full max-w-md rounded-2xl shadow-xl p-6 relative border border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-xl font-semibold">
              {title}
            </h2>
          )}

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 transition"
          >
            ✕
          </button>
        </div>
       
        <div className="mb-6">
          {children}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}


export default Modal;
