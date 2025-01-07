import { BarChart3, Users, DollarSign } from "lucide-react";
import { lazy, Suspense, useEffect, useState, useMemo } from "react"; // Use React's lazy and Suspense
import { StatsCard } from "../components/StatsCard";
import { QuickActions } from "../components/dashboard/QuickActions";
import "./Dashboard.css";
import axios from "axios";
import { ClipLoader } from "react-spinners";

// Lazy load the Chart component
const Chart = lazy(() => import("react-apexcharts"));

export const Dashboard = () => {
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

  // Memoize data transformations
  const adminsPerOrgData = useMemo(() => dashboardData.adminsPerOrg.map((item) => item.count), [dashboardData.adminsPerOrg]);
  const adminsPerOrgCategories = useMemo(() => dashboardData.adminsPerOrg.map((item) => item.organization__name), [dashboardData.adminsPerOrg]);

  const agentStatusData = useMemo(() => dashboardData.agentStatus.map((item) => item.count), [dashboardData.agentStatus]);
  const agentStatusLabels = useMemo(() => dashboardData.agentStatus.map((item) => item.status), [dashboardData.agentStatus]);

  const callTypeData = useMemo(() => dashboardData.callType.map((item) => item.count), [dashboardData.callType]);
  const callTypeCategories = useMemo(() => dashboardData.callType.map((item) => item.call_type), [dashboardData.callType]);

  const avgCallDurationData = useMemo(() => dashboardData.avgCallDuration.map((item) => parseInt(item.avg_duration)), [dashboardData.avgCallDuration]);
  const avgCallDurationCategories = useMemo(() => dashboardData.avgCallDuration.map((item) => item.agent__name), [dashboardData.avgCallDuration]);

  const aiSuccessRateData = useMemo(() => dashboardData.aiSuccessRate.map((item) => item.avg_success_rate), [dashboardData.aiSuccessRate]);
  const aiSuccessRateCategories = useMemo(() => dashboardData.aiSuccessRate.map((item) => item.date), [dashboardData.aiSuccessRate]);

  const satisfactionScoreData = useMemo(() => dashboardData.satisfactionScore.map((item) => item.count), [dashboardData.satisfactionScore]);
  const satisfactionScoreCategories = useMemo(() => dashboardData.satisfactionScore.map((item) => item.satisfaction_score), [dashboardData.satisfactionScore]);

  const callsHandledByAgentData = useMemo(() => dashboardData.callsHandledByAgent.map((item) => item.total_calls), [dashboardData.callsHandledByAgent]);
  const callsHandledByAgentCategories = useMemo(() => dashboardData.callsHandledByAgent.map((item) => item.agent__name), [dashboardData.callsHandledByAgent]);

  const totalCallsOverTimeData = useMemo(() => dashboardData.totalCallsOverTime.map((item) => item.total_calls), [dashboardData.totalCallsOverTime]);
  const totalCallsOverTimeCategories = useMemo(() => dashboardData.totalCallsOverTime.map((item) => item.date), [dashboardData.totalCallsOverTime]);

  const avgWaitTimeData = useMemo(() => dashboardData.avgWaitTime.map((item) => parseInt(item.avg_wait_time)), [dashboardData.avgWaitTime]);
  const avgWaitTimeCategories = useMemo(() => dashboardData.avgWaitTime.map((item) => item.date), [dashboardData.avgWaitTime]);

  const serviceLevelPercentageData = useMemo(() => dashboardData.serviceLevelPercentage.map((item) => parseInt(item.avg_service_level)), [dashboardData.serviceLevelPercentage]);
  const serviceLevelPercentageCategories = useMemo(() => dashboardData.serviceLevelPercentage.map((item) => item.date), [dashboardData.serviceLevelPercentage]);

  const conversionRateData = useMemo(() => dashboardData.conversionRate.map((item) => parseInt(item.avg_conversion_rate)), [dashboardData.conversionRate]);
  const conversionRateCategories = useMemo(() => dashboardData.conversionRate.map((item) => item.date), [dashboardData.conversionRate]);

  const interactionTypeData = useMemo(() => dashboardData.interactionType.map((item) => item.count), [dashboardData.interactionType]);
  const interactionTypeCategories = useMemo(() => dashboardData.interactionType.map((item) => item.interaction_type), [dashboardData.interactionType]);

  const callCategoryData = useMemo(() => dashboardData.callCategory.map((item) => item.count), [dashboardData.callCategory]);
  const callCategoryCategories = useMemo(() => dashboardData.callCategory.map((item) => item.call_category), [dashboardData.callCategory]);

  const transcriptLengthData = useMemo(() => dashboardData.transcriptLength.map((item) => item.count), [dashboardData.transcriptLength]);
  const transcriptLengthCategories = useMemo(() => dashboardData.transcriptLength.map((item) => item.length), [dashboardData.transcriptLength]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#1D4ED8" size={50} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div id="webcrumbs" className="w-full h-full p-4">
      <div className="bg-white rounded-lg shadow w-full h-full p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 font-title">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back, Admin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total Users" value="12,345" icon={Users} trend={12} />
          <StatsCard title="Monthly Revenue" value="$54,321" icon={DollarSign} trend={8} />
          <StatsCard title="Active Sessions" value="2,456" icon={BarChart3} trend={-3} />
        </div>

        <QuickActions />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admins per Organization */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <Chart
              type="bar"
              series={[{ data: adminsPerOrgData }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: adminsPerOrgCategories },
                title: { text: "Admins per Organization" },
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Agent Status Distribution */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <Chart
              type="donut"
              series={agentStatusData}
              options={{
                chart: { toolbar: { show: false } },
                labels: agentStatusLabels,
                title: { text: "Agent Status Distribution" },
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Call Type Distribution */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <Chart
              type="bar"
              series={[{ data: callTypeData }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: callTypeCategories },
                title: { text: "Call Type Distribution" },
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Average Call Duration by Agent */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <Chart
              type="bar"
              series={[{ data: avgCallDurationData }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: avgCallDurationCategories },
                title: { text: "Average Call Duration by Agent" },
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* AI Success Rate Over Time */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <Chart
              type="line"
              series={[{ name: "AI Success Rate", data: aiSuccessRateData }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: aiSuccessRateCategories },
                title: { text: "AI Success Rate Over Time" },
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Satisfaction Score Distribution */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <Chart
              type="bar"
              series={[{ data: satisfactionScoreData }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: satisfactionScoreCategories },
                title: { text: "Satisfaction Score Distribution" },
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Calls Handled by Agent */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <Chart
              type="bar"
              series={[{ data: callsHandledByAgentData }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: callsHandledByAgentCategories },
                title: { text: "Calls Handled by Agent" },
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Total Calls Over Time */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <Chart
              type="line"
              series={[{ name: "Total Calls", data: totalCallsOverTimeData }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: totalCallsOverTimeCategories },
                title: { text: "Total Calls Over Time" },
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Average Wait Time Over Time */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <Chart
              type="line"
              series={[{ name: "Average Wait Time", data: avgWaitTimeData }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: avgWaitTimeCategories },
                title: { text: "Average Wait Time Over Time" },
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Service Level Percentage Over Time */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <Chart
              type="line"
              series={[{ name: "Service Level Percentage", data: serviceLevelPercentageData }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: serviceLevelPercentageCategories },
                title: { text: "Service Level Percentage Over Time" },
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Conversion Rate Over Time */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <Chart
              type="line"
              series={[{ name: "Conversion Rate", data: conversionRateData }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: conversionRateCategories },
                title: { text: "Conversion Rate Over Time" },
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Interaction Type Distribution */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <Chart
              type="bar"
              series={[{ data: interactionTypeData }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: interactionTypeCategories },
                title: { text: "Interaction Type Distribution" },
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Call Category Distribution */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <Chart
              type="bar"
              series={[{ data: callCategoryData }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: callCategoryCategories },
                title: { text: "Call Category Distribution" },
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Transcript Length Distribution */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <Chart
              type="bar"
              series={[{ data: transcriptLengthData }]}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: transcriptLengthCategories },
                title: { text: "Transcript Length Distribution" },
              }}
              width="100%"
              height="300px"
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};