import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  accept: string;
  label: string;
  disabled?: boolean;
  onUpload: (file: File) => Promise<void>; // onUpload is a function that returns a Promise
}

const FileUpload: React.FC<FileUploadProps> = ({ accept, label, onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploadedOrdragged, setIsUploadedOrdragged] = useState(false);
  // Handle file selection via input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setIsUploadedOrdragged(true);
      validateAndSetFile(file);
      console.log('File dropped:', file.name); // Log the dropped file to the console
    }
  };

  // Validate and set the file
  const validateAndSetFile = (file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      setFile(file);
      setUploadMessage(null); // Reset upload message when a new file is selected or dropped
    } else {
      setUploadMessage('Invalid file type. Please upload a CSV file.');
      setFile(null); // Clear the file if it's invalid
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (file) {
      setIsUploading(true);
      setUploadMessage(null);

      try {
        setIsUploadedOrdragged(true);
        await onUpload(file); // Call the onUpload function passed as a prop
        setUploadMessage('File uploaded successfully!');
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadMessage(error instanceof Error ? error.message : 'Failed to upload file. Please try again.');
      } finally {
        setIsUploading(false);
      }
    } else {
      setUploadMessage('Please select a file first.');
    }
  };

  // Reset the file and upload message
  const handleReset = () => {
    setFile(null);
    setUploadMessage(null);
  };

  return (
    <div>
      {/* File Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors"
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          disabled={isUploading}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xs text-gray-500 mt-1">Drag and drop or click to upload</p>
          {file && <p className="text-sm text-gray-600 mt-2">Selected file: {file.name}</p>}
        </label>
      </div>

      {/* Upload Button (Visible only when a file is selected) */}
      {isUploadedOrdragged && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex-1 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 disabled:bg-indigo-300 transition-colors"
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      )}

      {/* Upload Message */}
      {uploadMessage && (
        <p
          className={`text-sm mt-2 text-center ${
            uploadMessage.includes('success') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {uploadMessage}
        </p>
      )}
    </div>
  );
};

export default FileUpload;