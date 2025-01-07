import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { CallHistory } from '../types/CallHistory';
import { Phone, Check, X, Voicemail, Star } from 'lucide-react'; // Updated imports

Chart.register(...registerables);

interface SummaryProps {
  callHistory: CallHistory[];
}

const Summary: React.FC<SummaryProps> = ({ callHistory }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  // Call Summary Calculations
  const totalCalls = callHistory.length;
  const completedCalls = callHistory.filter((call) => call.callStatus === 'Completed').length;
  const missedCalls = callHistory.filter((call) => call.callStatus === 'Missed').length;
  const averageDuration =
    callHistory.reduce((sum, call) => sum + call.duration, 0) / totalCalls;

  // Agent Performance Calculations
  const agentPerformance = callHistory.reduce((acc, call) => {
    if (!acc[call.agentName]) {
      acc[call.agentName] = { calls: 0, totalRating: 0 };
    }
    acc[call.agentName].calls += 1;
    acc[call.agentName].totalRating += call.callRating || 0;
    return acc;
  }, {} as { [key: string]: { calls: number; totalRating: number } });

  // Call Distribution Chart
  useEffect(() => {
    if (chartRef.current) {
      const incomingCalls = callHistory.filter((call) => call.callType === 'Incoming').length;
      const outgoingCalls = callHistory.filter((call) => call.callType === 'Outgoing').length;
      const missedCalls = callHistory.filter((call) => call.callType === 'Missed').length;

      const chart = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: ['Incoming', 'Outgoing', 'Missed'],
          datasets: [
            {
              label: 'Call Distribution',
              data: [incomingCalls, outgoingCalls, missedCalls],
              backgroundColor: ['#3b82f6', '#10b981', '#ef4444'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });

      return () => chart.destroy();
    }
  }, [callHistory]);

  // Helper Functions
  const getCallTypeIcon = (callType: string) => {
    switch (callType) {
      case 'Incoming':
        return <Phone className="w-5 h-5 text-blue-600" />;
      case 'Outgoing':
        return <Phone className="w-5 h-5 text-green-600" />;
      case 'Missed':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getCallStatusIcon = (callStatus: string) => {
    switch (callStatus) {
      case 'Completed':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'Missed':
        return <X className="w-5 h-5 text-red-600" />;
      case 'Voicemail':
        return <Voicemail className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const renderRating = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400" />
        ))}
      </div>
    );
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-900 flex items-center justify-center">
        <Phone className="w-8 h-8 mr-2" />
        Support summary
      </h1>

      {/* Call Summary */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Call Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Total Calls</p>
            <p className="text-2xl font-bold text-blue-900">{totalCalls}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Completed Calls</p>
            <p className="text-2xl font-bold text-blue-900">{completedCalls}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Missed Calls</p>
            <p className="text-2xl font-bold text-blue-900">{missedCalls}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Avg. Duration</p>
            <p className="text-2xl font-bold text-blue-900">
              {Math.floor(averageDuration / 60)}m {averageDuration % 60}s
            </p>
          </div>
        </div>
      </div>

      {/* Call Distribution Chart */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Call Distribution</h2>
        <canvas ref={chartRef}></canvas>
      </div>

      {/* Agent Performance Table */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Agent Performance</h2>
        <table className="min-w-full">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Agent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Calls Handled
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Avg. Rating
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-200">
            {Object.entries(agentPerformance).map(([agentName, performance]) => (
              <tr key={agentName} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 text-sm text-blue-900 font-medium">
                  {agentName}
                </td>
                <td className="px-6 py-4 text-sm text-blue-800">
                  {performance.calls}
                </td>
                <td className="px-6 py-4 text-sm text-blue-800">
                  {(performance.totalRating / performance.calls).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Call History Table */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Call History</h2>
        <table className="min-w-full">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Summary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-200">
            {callHistory.map((call) => (
              <tr key={call.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 text-sm text-blue-900">
                  {getCallTypeIcon(call.callType)}
                </td>
                <td className="px-6 py-4 text-sm text-blue-900 font-medium">
                  {call.clientName}
                </td>
                <td className="px-6 py-4 text-sm text-blue-800">
                  {call.summary}
                </td>
                <td className="px-6 py-4 text-sm text-blue-800">
                  {call.time}
                </td>
                <td className="px-6 py-4 text-sm text-blue-800">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(call.duration / 1800) * 100}%` }} // 1800s = 30 mins (max duration)
                    ></div>
                  </div>
                  <span>{formatDuration(call.duration)}</span>
                </td>
                <td className="px-6 py-4 text-sm text-blue-800">
                  {getCallStatusIcon(call.callStatus)}
                </td>
                <td className="px-6 py-4 text-sm text-blue-800">
                  {renderRating(call.callRating)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Summary;