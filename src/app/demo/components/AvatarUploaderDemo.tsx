import React, { useRef, useState, ChangeEvent } from "react";

const AvatarUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click(); // bezpieczne kliknięcie
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("avatar", file);

      await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-20 h-20 rounded-full bg-gray-200 cursor-pointer bg-cover bg-center"
        onClick={handleClick}
        style={{
          backgroundImage: preview ? `url(${preview})` : "none",
        }}
      >
        {!preview && (
          <div className="flex items-center justify-center w-full h-full text-xs text-gray-500">
            Dodaj zdjęcie
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {preview && (
        <p className="mt-2 text-sm text-green-600">Podgląd ustawiony ✅</p>
      )}
    </div>
  );
};

export default AvatarUploader;
