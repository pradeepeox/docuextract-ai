
import React, { useCallback, useState, DragEvent, ChangeEvent } from 'react';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_MB } from '../constants';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  currentFile: File | null;
}

const allAllowedMimeTypes = [
    ...ALLOWED_FILE_TYPES.text, 
    ...ALLOWED_FILE_TYPES.image,
    ...ALLOWED_FILE_TYPES.pdf,
];
const acceptedFileExtensions = ".txt,.md,.png,.jpg,.jpeg,.webp,.pdf"; // For the input accept attribute

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, currentFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true); 
  }, [isDragging]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (allAllowedMimeTypes.includes(file.type)) {
        onFileChange(file);
      } else {
        // Optionally, provide feedback about disallowed file type on drop
        alert(`File type ${file.type} is not supported. Please upload one of: ${acceptedFileExtensions}`);
        onFileChange(null); 
      }
      e.dataTransfer.clearData();
    }
  }, [onFileChange]);

  const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
    e.target.value = ''; 
  }, [onFileChange]);

  return (
    <div
      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
        isDragging ? 'border-sky-500 bg-slate-700' : 'border-slate-600 border-dashed'
      } rounded-md transition-colors duration-150`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="group"
      aria-label="File upload area"
    >
      <div className="space-y-1 text-center">
        <svg
          className="mx-auto h-12 w-12 text-slate-500"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex text-sm text-slate-400">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-sky-400 hover:text-sky-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-800 focus-within:ring-sky-500 px-1"
          >
            <span>Upload a file</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileSelect} accept={acceptedFileExtensions} />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-slate-500">TXT, MD, PNG, JPG, WEBP, PDF up to {MAX_FILE_SIZE_MB}MB</p>
        {currentFile && <p className="text-sm text-sky-300 mt-2">Selected: {currentFile.name}</p>}
      </div>
    </div>
  );
};
