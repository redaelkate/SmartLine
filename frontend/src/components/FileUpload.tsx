import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  accept: string;
  label: string;
  onUpload: (file: File) => Promise<void>; // Update the onUpload prop to return a Promise
}

const FileUpload: React.FC<FileUploadProps> = ({ accept, label, onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadMessage(null);

      try {
        await onUpload(file); // Call the onUpload function passed as a prop
        setUploadMessage('File uploaded successfully!');
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadMessage('Failed to upload file. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
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
        {isUploading && <p className="text-sm text-gray-600 mt-2">Uploading...</p>}
        {uploadMessage && (
          <p
            className={`text-sm mt-2 ${
              uploadMessage.includes('success') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {uploadMessage}
          </p>
        )}
      </label>
    </div>
  );
};

export default FileUpload;