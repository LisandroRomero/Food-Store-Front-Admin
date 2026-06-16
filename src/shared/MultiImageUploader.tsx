import { useRef, useState } from "react";

import { uploadImage } from "../features/cloudinary/services/cloudinary.service";

interface MultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  max?: number;
}

export default function MultiImageUploader({
  value,
  onChange,
  label = "Imágenes",
  max,
}: MultiImageUploaderProps) {
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
      onChange([...value, url]);
    } catch {
      setError("Error al subir la imagen. Intentá de nuevo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const atLimit = max !== undefined && value.length >= max;

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>

      {/* Previews */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((url, i) => (
            <div key={`${url}-${i}`} className="relative">
              <img
                src={url}
                alt={`Imagen ${i + 1}`}
                className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
              />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow transition-colors"
                title="Eliminar imagen"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {!atLimit && (
        <label
          htmlFor="multi-image-upload-btn"
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
              {value.length === 0 ? "Seleccionar imagen" : "Agregar imagen"}
            </>
          )}
        </label>
      )}

      <input
        ref={inputRef}
        id="multi-image-upload-btn"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
