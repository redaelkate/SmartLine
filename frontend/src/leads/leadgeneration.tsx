import React, { useState } from "react";
import { User, Phone, Mail, Briefcase, Building, Clipboard, BarChart, Check } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../axios";

const LeadGenerationPage = () => {
  const [lead, setLead] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    PhoneNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLead((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("api/leads/", lead);
      const call_response = await axios.post('https://alive-cheetah-precisely.ngrok-free.app/make-call',lead);
      console.log("Lead creation response:", response.data,'Call response:',call_response.data);
      toast.success("Lead created successfully!");
      setLead({
        FirstName: "",
        LastName: "",
        Email: "",
        PhoneNumber: "",

      });
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error("Failed to create lead. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Lead Generation</h1>
        <p className="text-gray-600">Add and manage leads for your call center.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="FirstName"
                value={lead.FirstName}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John"
                required
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="LastName"
                value={lead.LastName}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="Email"
                value={lead.Email}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john.doe@example.com"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="PhoneNumber"
                value={lead.PhoneNumber}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1 (555) 123-4567"
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
              Save Lead
            </button>
          </div>
        </form>
    </div>
  );
};

export default LeadGenerationPage;