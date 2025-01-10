import React from 'react';
import FileUpload from '../components/FileUpload';
import OrdersList from './OrdersList';
import OrderGenerationPage from './ordersgeneration';

const OrdersView = () => {
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://d0rgham.pythonanywhere.com/api/upload/orders/', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response from backend
        throw new Error(errorData.error || 'Failed to upload orders file');
      }

      const result = await response.json();
      console.log('Orders upload result:', result);
      alert('Orders file uploaded successfully!');
    } catch (error) {
      console.error('Error uploading orders file:', error);
      alert(error.message || 'Failed to upload orders file. Please try again.');
    }
  };

  const handleStartOrdersConfirmations = async () => {
    alert('Starting the orders confirmations process.......');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <OrderGenerationPage />
        <h2 className="text-lg font-semibold mb-4">Import Orders</h2>
        <FileUpload
          accept=".csv,.xlsx,.xls"
          label="Upload orders file (CSV or Excel), (after the upload all of the orders will be added to the database and the agent will be launched)"
          onUpload={handleFileUpload} // Pass the upload function as a prop
        />
        <div className="flex justify-center mt-4">
        <button onClick={handleStartOrdersConfirmations} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" >Start Orders Confirmations</button>
      </div>
      </div>
      
      <OrdersList />
    </div>
  );
};

export default OrdersView;