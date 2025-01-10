import React, { useEffect, useState } from "react";
import { User, Phone,  BarChart, Check } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../axios";

const orderGenerationPage = () => {
  const [order, setorder] = useState({
    ProductName: "",
    ProductID: 0,
    Price: 0,
    Description: "",
    ClientPhone: "",
    ClientName: "",
    Quantity: 0,
    Status: "Processing",
    
  });

  const [products, setProducts] = useState<{ ProductID: number; ProductName: string }[]>([]);
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("api/products/");
      console.log("Products:", response.data);
      setProducts(response.data.map((product: { ProductID: number; ProductName: string }) => ({ ProductID: product.ProductID, ProductName: product.ProductName })));
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products. Please try again.");
    }
  }
  useEffect(() => {
    fetchProducts();
  } , []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setorder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("api/orders/", order);
      console.log("order creation response:", response.data);
      toast.success("order created successfully!");
      setorder({
        ProductName: "",
        Price: 0,
        ProductID: 0,
        Description: "",
        ClientPhone: "",
        ClientName: "",
        Quantity: 0,
        Status: "",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">orders Confirmation</h1>
        <p className="text-gray-600">Add and manage orders for your call center.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
          

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="LastName"
                value={order.ClientName}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Doe"
                required
              />
            </div>
          </div>

         

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Phone number</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="PhoneNumber"
                value={order.ClientPhone}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BarChart className="h-5 w-5 text-gray-400" />
              </div>
              <select 
                name="ProductName"
                value={order.ProductName}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" >
                {products.map((product) => (
                  <option key={product.ProductID} value={product.ProductName} onClick={()=>setorder((prev) => ({ ...prev, ProductID: product.ProductID }))}>
                    {product.name}
                  </option>
                ))}
                </select>
            </div>
          </div>

          {/* order Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">order Status</label>
            <div className="mt-1">
              <select
                name="orderstatus"
                value={order.ProductName}
                onChange={handleInputChange}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          

          
          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BarChart className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="Quantity"
                value={order.Quantity}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="5"
                required
              />
            </div>
            </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BarChart className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="Price"
                value={order.Price}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="5"
                required
              />
            </div>
            </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Check className="h-5 w-5 mr-2" />
              Save order
            </button>
          </div>
        </form>
    </div>
  );
};

export default orderGenerationPage;