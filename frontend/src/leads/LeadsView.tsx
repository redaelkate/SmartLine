import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import LeadsList from './LeadsList';
import { toast } from 'react-toastify';
import axios from 'axios';
import LeadGenerationPage from './leadgeneration';

const LeadsView = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [lead, setLead] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    PhoneNumber: "",
  });

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csvContent = e.target?.result as string;
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        console.log('CSV Headers:', headers);
        
        // Convert CSV to JSON
        const jsonData = lines.slice(1)
          .filter(line => line.trim() !== '') // Filter out empty lines
          .map(line => {
            const values = line.split(',').map(value => value.trim());
            return headers.reduce((obj, header, index) => {
              obj[header] = values[index];
              return obj;
            }, {} as Record<string, string>);
          });

        // Process each lead
        for (let lead of jsonData) {
          try {
            // Send to make-calls-leads endpoint
            const callResponse = await axios.post(
              'https://alive-cheetah-precisely.ngrok-free.app/make-call-leads',
              lead
            );
            console.log('Call response for lead:', lead, callResponse.data);
            
            // Optional: Check call status
            const statusResponse = await axios.get(
              'https://alive-cheetah-precisely.ngrok-free.app/CallStatus'
            );
            console.log('Call status:', statusResponse.data);
          } catch (error) {
            console.error('Error processing lead:', lead, error);
            toast.error(`Failed to process lead: ${lead.Email || 'Unknown'}`);
          }
        }

        toast.success('Successfully processed all leads!');
      } catch (error) {
        console.error('Error processing CSV:', error);
        toast.error('Failed to process CSV file. Please check the format.');
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(file);
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
          accept=".csv"
          label="Upload leads file (CSV)"
          onUpload={handleFileUpload}
          disabled={isUploading}
        />
        {isUploading && <p className="text-sm text-gray-500 mt-2">Processing leads...</p>}
        <div className="flex justify-center mt-4">
          <button 
            onClick={handleLeadsGeneration} 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Start Leads Generation
          </button>
        </div>
      </div>
      <LeadsList />
    </div>
  );
};

export default LeadsView;
