import React from 'react';
import FileUpload from '../components/FileUpload';
import OrdersList from './OrdersList';

const OrdersView = () => {
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://d0rgham.pythonanywhere.com/api/upload/orders/', {
        method: 'POST',
        body: formData,
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Import Orders</h2>
        <FileUpload
          accept=".csv,.xlsx,.xls"
          label="Upload orders file (CSV or Excel)"
          onUpload={handleFileUpload} // Pass the upload function as a prop
        />
      </div>
      <OrdersList />
    </div>
  );
};

export default OrdersView;