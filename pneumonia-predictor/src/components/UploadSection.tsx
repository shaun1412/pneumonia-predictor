
import React, { useState, useCallback } from 'react';
import { Upload, Image, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UploadSectionProps {
  onImageUpload: (file: File, imageUrl: string) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);
    onImageUpload(file, imageUrl);
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const clearImage = useCallback(() => {
    setPreviewUrl(null);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Upload Chest X-Ray</h2>
        <p className="text-gray-500 mt-2">
          Upload a clear chest X-ray image for analysis
        </p>
      </div>

      {!previewUrl ? (
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            isDragging ? 'border-mediscan-400 bg-mediscan-50' : 'border-gray-300 hover:border-mediscan-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-mediscan-100 p-3">
              <Upload className="h-8 w-8 text-mediscan-600" />
            </div>
            <div>
              <p className="text-lg font-medium">Drag and drop your X-ray here</p>
              <p className="text-sm text-gray-500 mt-1">or click to browse</p>
            </div>
            <label className="mediscan-button cursor-pointer">
              Browse Files
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileSelect} 
              />
            </label>
            <p className="text-xs text-gray-400 mt-4">
              Supported formats: JPG, PNG, DICOM
            </p>
          </div>
        </div>
      ) : (
        <div className="relative mediscan-card p-4">
          <button 
            onClick={clearImage}
            className="absolute top-2 right-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100 z-10"
          >
            <XCircle className="h-5 w-5 text-gray-600" />
          </button>
          <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100">
            <img 
              src={previewUrl} 
              alt="Chest X-Ray Preview" 
              className="object-contain w-full h-full" 
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              X-ray uploaded successfully. Results will appear below.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
