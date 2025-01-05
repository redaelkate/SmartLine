import React from 'react';
import { CreditCard, Plus } from 'lucide-react';

export function PaymentMethods() {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Payment Methods</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CreditCard className="w-6 h-6 text-gray-400" />
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/24</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Default</span>
          </div>
          
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
            <Plus className="w-5 h-5" />
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
}