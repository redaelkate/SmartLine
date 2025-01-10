import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import axios from 'axios';
import Modal from '../components/Modal';
import {X} from 'lucide-react';

import axiosInstance from '../axios';

interface Order {
  OrderID: number;
  ProductID: number;
  Quantity: number;
  Price: number;
  PaymentStatus: string;
  OrderStatus: string;
}




const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Track selected order
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Track modal state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('api/orders/');
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p>Loading orders...</p>;
  }


  const handleDisplayOrder = (order: Order) => {
    setSelectedOrder(order); // Set the selected order
    setIsModalOpen(true); // Open the modal
  };
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.OrderID} className="flex items-center justify-between border-b pb-4 cursor-pointer" onClick={() => handleDisplayOrder(order)}>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <ShoppingCart className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium">Order #{order.OrderID}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">${order.Price}</p>
              <p
                className={`text-sm ${
                  order.OrderStatus === 'Shipped' ? 'text-green-500' :
                  order.OrderStatus === 'Processing' ? 'text-yellow-500' : 'text-gray-500'
                }`}
              >
                {order.OrderStatus}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for displaying order details */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedOrder && (
          <div>
            <div className='flex justify-between'><h3 className="text-xl font-semibold mb-4">Order Details </h3> <X className='cursor-pointer' onClick={()=>setIsModalOpen(false)}/></div>
            <div className="space-y-2">
              <p><strong>Order ID:</strong> {selectedOrder.OrderID}</p>
              <p><strong>Lead ID:</strong> {selectedOrder.LeadID}</p>
              <p><strong>Product ID:</strong> {selectedOrder.ProductID}</p>
              <p><strong>Quantity:</strong> {selectedOrder.Quantity}</p>
              <p><strong>Total Amount:</strong> ${selectedOrder.Price}</p>
              <p><strong>Payment Status:</strong> {selectedOrder.PaymentStatus}</p>
              <p><strong>Order Status:</strong> {selectedOrder.OrderStatus}</p>
            </div>
          </div>
        )}
      </Modal>
      
    </div>
  );
};

export default OrdersList;