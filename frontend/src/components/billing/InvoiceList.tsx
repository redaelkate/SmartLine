import React from 'react';
import { Download } from 'lucide-react';

const invoices = [
  {
    id: 'INV-001',
    date: '2024-03-01',
    amount: '$299.00',
    status: 'Paid',
    customer: 'Acme Inc.'
  },
  // ... more invoices
];

export function InvoiceList() {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Recent Invoices</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{invoice.customer}</p>
                <p className="text-sm text-gray-500">{invoice.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-900 font-medium">{invoice.amount}</span>
                <button className="p-2 hover:bg-gray-200 rounded-full">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}