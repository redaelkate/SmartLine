import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import LeadsList from './LeadsList';
import LeadGenerationPage from './leadgeneration';
import { toast } from 'react-toastify';

const LeadsView = () => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);

    try {
      const response = await fetch('https://d0rgham.pythonanywhere.com/api/upload/leads/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload leads file');
      }

      const result = await response.json();
      console.log('Leads upload result:', result);
      toast.success('Leads file uploaded successfully!');
    } catch (error) {
      console.error('Error uploading leads file:', error);
      toast.error('Failed to upload leads file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <LeadGenerationPage />
        <h2 className="text-lg font-semibold mb-4">Import Leads</h2>
        <FileUpload
          accept=".csv,.xlsx,.xls"
          label="Upload leads file (CSV or Excel)"
          onUpload={handleFileUpload}
          disabled={isUploading}
        />
        {isUploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
      </div>
      <LeadsList />
    </div>
  );
};

export default LeadsView;