import React, { useState, useCallback, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import  ExcelJs  from 'exceljs';

const FileDrop = ({ onFileUpload, fileType, setFileType, handleDownload }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onFileUpload(acceptedFiles, fileType);
    },
    [onFileUpload, fileType]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <button
        onClick={handleDownload}
        className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <span>Generate Report</span>
        <ArrowUpRight className="w-5 h-5" />
      </button>
      <div className="mt-5 mb-4">
        <label className="block text-sm font-medium text-gray-700">File Type</label>
        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="leads">Leads</option>
          <option value="orders">Orders</option>
        </select>
      </div>
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed border-gray-300 rounded-lg text-center ${
          isDragActive ? 'bg-blue-50' : 'bg-white'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-600">Drop the files here ...</p>
        ) : (
          <p className="text-gray-600">
            Drag and drop or <span className="text-blue-600">click to upload</span> (CSV or Excel)
          </p>
        )}
      </div>
    </div>
  );
};

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
        const response = await axios.get("https://d0rgham.pythonanywhere.com/api/dashboard-data/");
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
  // Handle file upload
  const handleFileUpload = async (files, fileType) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file); // Use "file" as the key
    });

    try {
      const response = await axios.post(
        `https://d0rgham.pythonanywhere.com/api/upload/${fileType}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Upload successful:', response.data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Handle download button click
  const handleDownload = () => {
    exportReportAsExcel(dashboardData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-4">
        <FileDrop
          onFileUpload={handleFileUpload}
          fileType={fileType}
          setFileType={setFileType}
          handleDownload={handleDownload}
        />
      </div>
    </div>
  );
}