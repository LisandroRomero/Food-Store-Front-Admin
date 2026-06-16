import { useRef, useState } from "react";

import { uploadImage } from "../features/cloudinary/services/cloudinary.service";

interface ImageUploaderProps {
  /** URL actual de la imagen (para edición / preview) */
  value?: string | null;
  /** Se llama cuando la subida a Cloudinary se completa exitosamente */
  onChange: (url: string) => void;
  /** Se llama cuando el usuario decide remover la imagen */
  onRemove?: () => void;
  /** Label del campo */
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  onRemove,
  label = "Imagen",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Formato no soportado. Usá JPG, PNG o WebP.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen supera los 5 MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch {
      setError("Error al subir la imagen. Intentá de nuevo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onRemove?.();
    onChange("");
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow transition-colors"
            title="Eliminar imagen"
          >
            ×
          </button>
        </div>
      ) : (
        <label
          htmlFor="image-upload-btn"
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-dashed border-gray-300 transition-colors"
        >
          {uploading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Subiendo...
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              Seleccionar imagen
            </>
          )}
        </label>
      )}

      <input
        ref={inputRef}
        id="image-upload-btn"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
