'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface FileUploadProps {
  onFileUpload: (fileUrl: string) => void;
  defaultImage?: string;
  label?: string;
}

// Generic placeholder image that doesn't require a file to exist
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZTJlOGYwIi8+CjxwYXRoIGQ9Ik03NCA5NEMxMDIuMTk5IDk0IDEyNSA3MS4xOTkgMTI1IDQzQzEyNSAxNC44MDEgMTAyLjE5OSAtOCA3NCAtOEM0NS44MDEgLTggMjMgMTQuODAxIDIzIDQzQzIzIDcxLjE5OSA0NS44MDEgOTQgNzQgOTRaIiBmaWxsPSIjOTRhM2IzIi8+CjxwYXRoIGQ9Ik0xNjUuNTg1IDIyMkMxOTYuNjg0IDIyMiAyMjIgMTk2LjY4NCAyMjIgMTY1LjU4NUMyMjIgMTM0LjQ4NiAxOTYuNjg0IDEwOSAxNjUuNTg1IDEwOUMxMzQuNDg2IDEwOSAxMDkgMTM0LjQ4NiAxMDkgMTY1LjU4NUMxMDkgMTk2LjY4NCAxMzQuNDg2IDIyMiAxNjUuNTg1IDIyMloiIGZpbGw9IiM5NGEzYjMiLz4KPHBhdGggZD0iTS0yNC41ODUgMTkwQzYuNTE0IDE5MCAzMiAxNjQuNjg0IDMyIDEzMy41ODVDMzIgMTAyLjQ4NiA2LjUxNCA3NyAtMjQuNTg1IDc3Qy01NS42ODQgNzcgLTgxIDEwMi40ODYgLTgxIDEzMy41ODVDLTgxIDE2NC42ODQgLTU1LjY4NCAxOTAgLTI0LjU4NSAxOTBaIiBmaWxsPSIjOTRhM2IzIi8+Cjwvc3ZnPgo=';

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileUpload, 
  defaultImage = FALLBACK_IMAGE,
  label = 'Image'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(defaultImage);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload an image (JPEG, PNG, GIF, WEBP).');
      return;
    }

    // Validate file size (max 2MB for database storage)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size too large. Maximum size is 2MB.');
      return;
    }

    // Clear previous errors
    setError(null);
    setIsUploading(true);

    try {
      // Create a temporary preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload the file
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload file');
      }

      const data = await response.json();
      
      // Call the callback with the uploaded file URL
      onFileUpload(data.fileUrl);
      
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please try again.');
      // Revert to default image if upload fails
      setPreviewUrl(defaultImage);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="flex flex-col items-center">
        <div 
          className="relative h-48 w-full mb-4 rounded-md overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-green-500 transition-colors"
          onClick={triggerFileInput}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Upload preview"
              fill
              className="object-cover"
              onError={() => {
                // If image fails to load, use the fallback
                if (previewUrl !== FALLBACK_IMAGE) {
                  setPreviewUrl(FALLBACK_IMAGE);
                }
              }}
            />
          ) : (
            <div className="text-gray-700">Click to upload an image</div>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-[#F1EDE5]">Uploading...</div>
            </div>
          )}
        </div>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
          disabled={isUploading}
        />
        
        <button
          type="button"
          onClick={triggerFileInput}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm transition-colors"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Select Image'}
        </button>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
      
      <p className="text-xs text-gray-700 mt-2">
        Upload a JPG, PNG, GIF, or WEBP (max 2MB).
      </p>
    </div>
  );
};

export default FileUpload;
