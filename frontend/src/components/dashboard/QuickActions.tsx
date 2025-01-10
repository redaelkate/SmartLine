import React, { useState, useCallback, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import  ExcelJs  from 'exceljs';
import axiosInstance from '../../axios';


export function QuickActions() {
  const [fileType, setFileType] = useState('leads');
  const [dashboardData, setDashboardData] = useState({
    
    agentStatus: [],
    callType: [],
    avgCallDuration: [],
    aiSuccessRate: [],
    satisfactionScore: [],
    callsHandledByAgent: [],
    totalCallsOverTime: [],
    avgWaitTime: [],
    serviceLevelPercentage: [],
    conversionRate: [],
    interactionType: [],
    callCategory: [],
    transcriptLength: [],
    clients: [],
    agents: [],
    leads: [],
    orders: [],
  });

  const [moreData, setMoreData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("api/dashboard-data/");
        setDashboardData({
          
          agentStatus: response.data.agent_status_distribution || [],
          callType: response.data.call_type_distribution || [],
          avgCallDuration: response.data.average_call_duration || [],
          aiSuccessRate: response.data.ai_success_rate || [],
          satisfactionScore: response.data.satisfaction_score_distribution || [],
          callsHandledByAgent: response.data.calls_handled_by_agent || [],
          totalCallsOverTime: response.data.total_calls_over_time || [],
          avgWaitTime: response.data.average_wait_time || [],
          serviceLevelPercentage: response.data.service_level_percentage || [],
          conversionRate: response.data.conversion_rate || [],
          interactionType: response.data.interaction_type_distribution || [],
          callCategory: response.data.call_category_distribution || [],
          transcriptLength: response.data.transcript_length_distribution || [],
          clients: response.data.clients || [],
          agents: response.data.agents || [],
          leads: response.data.leads || [],
          orders: response.data.orders || [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to export dashboard data as CSV
  const exportReportAsExcel = async (dashboardData) => {
    console.log("Exporting report as Excel:", dashboardData);

    // Create a new workbook
    const workbook = new ExcelJs.Workbook();

    // Helper function to add a worksheet with data
    const addSheet = (workbook, sheetName, data) => {
      if (Array.isArray(data) && data.length > 0) {
        const worksheet = workbook.addWorksheet(sheetName);

        // Add headers
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);

        // Add rows
        data.forEach((item) => {
          const row = headers.map((header) => item[header]);
          worksheet.addRow(row);
        });
      }
    };

    // Add a worksheet for each key in dashboardData
    Object.keys(dashboardData).forEach((key) => {
      addSheet(workbook, key, dashboardData[key]);
    });

    // Generate Excel file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard_report.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }


  // Handle download button click
  const handleDownload = () => {
    exportReportAsExcel(dashboardData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-4">
      <button
        onClick={handleDownload}
        className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <span>Generate Report</span>
        <ArrowUpRight className="w-5 h-5" />
      </button>
        
      </div>
    </div>
  );
}