import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import ExcelJS from 'exceljs';

/*
const exportReportAsCSV = () => {
  let csvContent = "data:text/csv;charset=utf-8,";

  // Convert data to CSV format
  Object.entries(staticData).forEach(([key, value]) => {
    csvContent += `${key},${Array.isArray(value) ? value.join(",") : JSON.stringify(value)}\n`;
  });

  // Create and trigger download
  const encodedUri = encodeURI(csvContent);
  const a = document.createElement("a");
  a.href = encodedUri;
  a.download = "dashboard_report.csv";
  a.click();
};*/


export function QuickActions() {


  
  /*const handleDownload = () => {
    exportReportAsCSV();
  };*/
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-4">
        <button  className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
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