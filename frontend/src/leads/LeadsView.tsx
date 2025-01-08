import React from 'react';
import FileUpload from '../components/FileUpload';
import LeadsList from './LeadsList';

const LeadsView = () => {
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

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
      alert('Leads file uploaded successfully!');
    } catch (error) {
      console.error('Error uploading leads file:', error);
      alert('Failed to upload leads file. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Import Leads</h2>
        <FileUpload
          accept=".csv,.xlsx,.xls"
          label="Upload leads file (CSV or Excel)"
          onUpload={handleFileUpload}
        />
      </div>
      <LeadsList />
    </div>
  );
};

export default LeadsView;