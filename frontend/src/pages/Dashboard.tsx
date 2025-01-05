import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
} from 'recharts';
import { RecentUsers } from '../components/users/RecentUsers';
import { QuickActions } from '../components/dashboard/QuickActions';

export function Dashboard() {
  // State for filters
  const [filters, setFilters] = useState({
    dateRange: 'last_30_days',
    organization: 'all',
    agent: 'all',
    callType: 'all',
  });

  // Dummy data for all charts
  const subscriptionData = [
    { name: 'Basic', value: 40 },
    { name: 'Premium', value: 30 },
    { name: 'Enterprise', value: 30 },
  ];

  const adminsData = [
    { organization: 'Org A', admins: 5 },
    { organization: 'Org B', admins: 10 },
    { organization: 'Org C', admins: 7 },
  ];

  const agentStatusData = [
    { status: 'Active', value: 70 },
    { status: 'Inactive', value: 30 },
  ];

  const callTypeData = [
    { type: 'Inbound', value: 60 },
    { type: 'Outbound', value: 40 },
  ];

  const callDurationData = [
    { agent: 'Agent 1', duration: 300 },
    { agent: 'Agent 2', duration: 450 },
    { agent: 'Agent 3', duration: 200 },
  ];

  const aiSuccessData = [
    { date: '2023-10-01', successRate: 85 },
    { date: '2023-10-02', successRate: 88 },
    { date: '2023-10-03', successRate: 90 },
  ];

  const satisfactionData = [
    { score: 1, count: 10 },
    { score: 2, count: 20 },
    { score: 3, count: 30 },
    { score: 4, count: 25 },
    { score: 5, count: 15 },
  ];

  const agentPerformanceData = [
    { agent: 'Agent 1', callsHandled: 50 },
    { agent: 'Agent 2', callsHandled: 70 },
    { agent: 'Agent 3', callsHandled: 60 },
  ];

  const callTrendsData = [
    { date: '2023-10-01', totalCalls: 100 },
    { date: '2023-10-02', totalCalls: 120 },
    { date: '2023-10-03', totalCalls: 90 },
  ];

  const callQueueData = [
    { date: '2023-10-01', averageWaitTime: 5.2 },
    { date: '2023-10-02', averageWaitTime: 4.8 },
    { date: '2023-10-03', averageWaitTime: 6.1 },
  ];

  const serviceLevelData = [
    { date: '2023-10-01', serviceLevelPercentage: 95 },
    { date: '2023-10-02', serviceLevelPercentage: 92 },
    { date: '2023-10-03', serviceLevelPercentage: 98 },
  ];

  const conversionData = [
    { date: '2023-10-01', conversionRate: 0.25 },
    { date: '2023-10-02', conversionRate: 0.30 },
    { date: '2023-10-03', conversionRate: 0.28 },
  ];

  const interactionTypeData = [
    { type: 'Call', value: 60 },
    { type: 'Chat', value: 30 },
    { type: 'Email', value: 10 },
  ];

  const callCategoryData = [
    { category: 'Sales', value: 40 },
    { category: 'Support', value: 35 },
    { category: 'Billing', value: 25 },
  ];

  const transcriptLengthData = [
    { lengthRange: '0-100', count: 50 },
    { lengthRange: '101-200', count: 30 },
    { lengthRange: '201-300', count: 20 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  // Filter logic for date range
  const filterByDateRange = (data) => {
    const today = new Date();
    const startDate = new Date();

    switch (filters.dateRange) {
      case 'last_7_days':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'last_30_days':
        startDate.setDate(today.getDate() - 30);
        break;
      case 'last_90_days':
        startDate.setDate(today.getDate() - 90);
        break;
      default:
        return data;
    }

    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= today;
    });
  };

  // Filter logic for organization
  const filterByOrganization = (data) => {
    if (filters.organization === 'all') return data;
    return data.filter((item) => item.organization === filters.organization);
  };

  // Filter logic for agent
  const filterByAgent = (data) => {
    if (filters.agent === 'all') return data;
    return data.filter((item) => item.agent === filters.agent);
  };

  // Filter logic for call type
  const filterByCallType = (data) => {
    if (filters.callType === 'all') return data;
    return data.filter((item) => item.type === filters.callType);
  };

  // Apply filters to each dataset
  const filteredSubscriptionData = subscriptionData; // No filter applied
  const filteredAdminsData = filterByOrganization(adminsData);
  const filteredAgentStatusData = agentStatusData; // No filter applied
  const filteredCallTypeData = filterByCallType(callTypeData);
  const filteredCallDurationData = filterByAgent(callDurationData);
  const filteredAISuccessData = filterByDateRange(aiSuccessData);
  const filteredSatisfactionData = satisfactionData; // No filter applied
  const filteredAgentPerformanceData = filterByAgent(agentPerformanceData);
  const filteredCallTrendsData = filterByDateRange(callTrendsData);
  const filteredCallQueueData = filterByDateRange(callQueueData);
  const filteredServiceLevelData = filterByDateRange(serviceLevelData);
  const filteredConversionData = filterByDateRange(conversionData);
  const filteredInteractionTypeData = interactionTypeData; // No filter applied
  const filteredCallCategoryData = callCategoryData; // No filter applied
  const filteredTranscriptLengthData = transcriptLengthData; // No filter applied

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back, Admin</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_90_days">Last 90 Days</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Organization</label>
          <select
            value={filters.organization}
            onChange={(e) => handleFilterChange('organization', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="all">All Organizations</option>
            <option value="Org A">Org A</option>
            <option value="Org B">Org B</option>
            <option value="Org C">Org C</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Agent</label>
          <select
            value={filters.agent}
            onChange={(e) => handleFilterChange('agent', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="all">All Agents</option>
            <option value="Agent 1">Agent 1</option>
            <option value="Agent 2">Agent 2</option>
            <option value="Agent 3">Agent 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Call Type</label>
          <select
            value={filters.callType}
            onChange={(e) => handleFilterChange('callType', e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="all">All Call Types</option>
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
          </select>
        </div>
      </div>

      {/* Recent Users and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentUsers />
        <QuickActions />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Subscription Plan Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Subscription Plan Distribution</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={filteredSubscriptionData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {filteredSubscriptionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Admins per Organization */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Admins per Organization</h2>
          <BarChart width={300} height={300} data={filteredAdminsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="organization" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="admins" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Agent Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Agent Status Distribution</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={filteredAgentStatusData}
              dataKey="value"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {filteredAgentStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Call Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Call Type Distribution</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={filteredCallTypeData}
              dataKey="value"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {filteredCallTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Average Call Duration by Agent */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Average Call Duration by Agent</h2>
          <BarChart width={300} height={300} data={filteredCallDurationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="agent" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="duration" fill="#8884d8" />
          </BarChart>
        </div>

        {/* AI Success Rate Over Time */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">AI Success Rate Over Time</h2>
          <LineChart width={300} height={300} data={filteredAISuccessData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="successRate" stroke="#8884d8" />
          </LineChart>
        </div>

        {/* Satisfaction Score Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Satisfaction Score Distribution</h2>
          <BarChart width={300} height={300} data={filteredSatisfactionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="score" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Calls Handled by Agent */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Calls Handled by Agent</h2>
          <BarChart width={300} height={300} data={filteredAgentPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="agent" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="callsHandled" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Total Calls Over Time */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Total Calls Over Time</h2>
          <LineChart width={300} height={300} data={filteredCallTrendsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalCalls" stroke="#8884d8" />
          </LineChart>
        </div>

        {/* Average Wait Time Over Time */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Average Wait Time Over Time</h2>
          <LineChart width={300} height={300} data={filteredCallQueueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="averageWaitTime" stroke="#8884d8" />
          </LineChart>
        </div>

        {/* Service Level Percentage Over Time */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Service Level Percentage Over Time</h2>
          <LineChart width={300} height={300} data={filteredServiceLevelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="serviceLevelPercentage" stroke="#8884d8" />
          </LineChart>
        </div>

        {/* Conversion Rate Over Time */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Conversion Rate Over Time</h2>
          <LineChart width={300} height={300} data={filteredConversionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="conversionRate" stroke="#8884d8" />
          </LineChart>
        </div>

        {/* Interaction Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Interaction Type Distribution</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={filteredInteractionTypeData}
              dataKey="value"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {filteredInteractionTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Call Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Call Category Distribution</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={filteredCallCategoryData}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {filteredCallCategoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Transcript Length Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Transcript Length Distribution</h2>
          <BarChart width={300} height={300} data={filteredTranscriptLengthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="lengthRange" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}