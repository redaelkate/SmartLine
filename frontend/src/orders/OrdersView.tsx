import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import OrdersList from './OrdersList';
import OrderGenerationPage from './ordersgeneration';
import { toast } from 'react-toastify';
import axios from 'axios';
interface OrderData {
  ProductName: string;
  ProductID: number;
  Price: number;
  Description: string;
  ClientPhone: string;
  ClientName: string;
  Quantity: number;
  OrderID: number;
}

const OrdersView = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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

        // Process each order
        for (let order of jsonData) {
          try {
            // Send to make-calls-orders endpoint
            const callResponse = await axios.post(
              'https://alive-cheetah-precisely.ngrok-free.app//make-call-orders',
              order
            );
            console.log('Call response for order:', order, callResponse.data);
            
            // Optional: Check call status
           /* const statusResponse = await axios.get(
              'https://alive-cheetah-precisely.ngrok-free.app/CallStatus'
            );
            console.log('Call status:', statusResponse.data);*/
          } catch (error) {
            console.error('Error processing order:', order, error);
            toast.error(`Failed to process order: ${order.Email || 'Unknown'}`);
          }
        }

        toast.success('Successfully processed all orders!');
      } catch (error) {
        console.error('Error processing CSV:', error);
        toast.error('Failed to process CSV file. Please check the format.');
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(file);
  };

  const handleStartOrdersConfirmations = async () => {
    if (orders.length === 0) {
      alert('Please upload a CSV file first!');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/start-confirmations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ orders }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start orders confirmations');
      }

      alert('Orders confirmation process started successfully!');
    } catch (error) {
      console.error('Error starting orders confirmations:', error);
      alert(error.message || 'Failed to start orders confirmations. Please try again.');
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <OrderGenerationPage />
        <h2 className="text-lg font-semibold mb-4">Import Orders</h2>
        <FileUpload
          accept=".csv"
          label="Upload orders CSV file with columns: ProductName, ProductID, Price, Description, ClientPhone, ClientName, Quantity, OrderID"
          onUpload={handleFileUpload}
        />
        <div className="flex justify-center mt-4">
          <button 
            onClick={handleStartOrdersConfirmations}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={orders.length === 0}
          >
            Start Orders Confirmations
          </button>
        </div>
        {orders.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {orders.length} orders loaded and ready for confirmation
            </p>
          </div>
        )}
      </div>
      
      <OrdersList />
    </div>
  );
};

export default OrdersView;