import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-4">
        <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
          <span>Generate Report</span>
          <ArrowUpRight className="w-5 h-5" />
        </button>
        <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
          <span>Invite Team Member</span>
          <ArrowUpRight className="w-5 h-5" />
        </button>
        <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
          <span>Update Billing</span>
          <ArrowUpRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}