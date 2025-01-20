import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import LeadsList from './LeadsList';
import LeadGenerationPage from './leadgeneration';
import { toast } from 'react-toastify';
import axios from 'axios';

const LeadsView = () => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);

    try {
      const call_response = await axios.post('https://alive-cheetah-precisely.ngrok-free.app/make-call',formData);
      const response = await fetch('https://d0rgham.pythonanywhere.com/api/upload/leads/', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload leads file');
      }

      const result = await response.json();
      console.log('Leads upload result:', result,'Call response:',call_response.data);
      toast.success('Leads file uploaded successfully!');
    } catch (error) {
      console.error('Error uploading leads file:', error);
      toast.error('Failed to upload leads file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };


  const handleLeadsGeneration = async () => {
    alert('Begin the lead generation process.......');

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
        <div className="flex justify-center mt-4">
          <button onClick={handleLeadsGeneration} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Start Leads Generation</button>
        </div>
      </div>
      <LeadsList />
    </div>
  );
};

export default LeadsView;