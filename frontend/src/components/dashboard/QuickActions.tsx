import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import ExcelJS from 'exceljs';
import axios from "axios";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import  { useCallback } from "react";


const exportReportAsCSV = (dashboardData) => {
  // Create CSV headers
  const headers = Object.keys(dashboardData).join(",");

  // Create CSV rows
  const rows = Object.values(dashboardData)
    .map((value) => {
      if (Array.isArray(value)) {
        // If the value is an array, join its elements with commas
        return value.map((item) => JSON.stringify(item)).join(",");
      } else {
        // If the value is not an array, stringify it
        return JSON.stringify(value);
      }
    })
    .join("\n");

  // Combine headers and rows
  const csvContent = `${headers}\n${rows}`;

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dashboard_report.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};



const FileDrop = ({ onFileUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Handle the uploaded files
      onFileUpload(acceptedFiles);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`p-6 border-2 border-dashed border-gray-300 rounded-lg text-center ${
        isDragActive ? "bg-blue-50" : "bg-white"
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
  );
};



export function QuickActions() {
  const [dashboardData, setDashboardData] = useState({
    adminsPerOrg: [],
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
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://d0rgham.pythonanywhere.com/api/dashboard-data/");
        setDashboardData({
          adminsPerOrg: response.data.admins_per_organization || [],
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

  const handleFileUpload = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file); // Use "file" as the key
    });
  
    try {
      const response = await axios.post("https://d0rgham.pythonanywhere.com/api/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleDownload = () => {
    exportReportAsCSV(dashboardData);
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
        <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
          <span>Invite Team Member</span>
          <ArrowUpRight className="w-5 h-5" />
        </button>
        <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
          <span>Update Billing</span>
          <ArrowUpRight className="w-5 h-5" />
        </button>
        <FileDrop onFileUpload={handleFileUpload} />
      </div>
    </div>
  );
}