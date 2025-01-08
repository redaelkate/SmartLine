import { BarChart3, Users, DollarSign } from "lucide-react";
import { lazy, Suspense, useEffect, useState, useMemo } from "react";
import { StatsCard } from "../components/StatsCard";
import { QuickActions } from "../components/dashboard/QuickActions";
import "./Dashboard.css";
import axios from "axios";
import { ClipLoader } from "react-spinners";

// Lazy load the CustomChart component
const CustomChart = lazy(() => import("../components/CustomChart"));

export const Dashboard = () => {
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
  });

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

  const [total_users, setTotalUsers] = useState(0);

  // Memoize data transformations
  const agentStatusData = useMemo(() => dashboardData.agentStatus.map((item) => item.count), [dashboardData.agentStatus]);
  const agentStatusLabels = useMemo(() => dashboardData.agentStatus.map((item) => item.status), [dashboardData.agentStatus]);

  const callTypeData = useMemo(() => dashboardData.callType.map((item) => item.count), [dashboardData.callType]);
  const callTypeCategories = useMemo(() => dashboardData.callType.map((item) => item.call_type), [dashboardData.callType]);

  const avgCallDurationData = useMemo(() => dashboardData.avgCallDuration.map((item) => parseInt(item.avg_duration)), [dashboardData.avgCallDuration]);
  const avgCallDurationCategories = useMemo(() => dashboardData.avgCallDuration.map((item) => item.agent__name), [dashboardData.avgCallDuration]);

  const aiSuccessRateData = useMemo(() => dashboardData.aiSuccessRate.map((item) => item.avg_success_rate.toFixed(2)), [dashboardData.aiSuccessRate]);
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

  // Define a vibrant and accessible color palette
  const chartColors = [
    "#FF6384", // Pink
    "#36A2EB", // Blue
    "#FFCE56", // Yellow
    "#4BC0C0", // Teal
    "#9966FF", // Purple
    "#FF9F40", // Orange
    "#C9CBCF", // Gray
  ];

  // Chart options with attractive colors
  const chartOptions = {
    chart: {
      toolbar: { show: false },
      animations: { enabled: true, easing: "easeinout", speed: 800 },
    },
    colors: chartColors, // Use the vibrant color palette
    dataLabels: { enabled: false },
    tooltip: { enabled: true, theme: "dark" },
    xaxis: { labels: { style: { colors: "#6B7280" } } },
    yaxis: { labels: { style: { colors: "#6B7280" } } },
    grid: { borderColor: "#E5E7EB" },
  };

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
      <div className="bg-white rounded-lg shadow w-full h-full p-4 md:p-6 lg:p-10">
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-title">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Welcome back, Admin</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatsCard title="Total Users" value={total_users.toString()} icon={Users} trend={12} />
          <StatsCard title="Monthly Revenue" value="$54,321" icon={DollarSign} trend={8} />
          <StatsCard title="Active Sessions" value="2,456" icon={BarChart3} trend={-3} />
        </div>

        <QuickActions />

        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Agent Status Distribution */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <CustomChart
              type="donut"
              series={agentStatusData}
              options={{
                ...chartOptions,
                labels: agentStatusLabels,
                title: { text: "Agent Status Distribution", style: { fontSize: "16px", color: "#374151" } },
                colors: ["#36A2EB", "#FF6384", "#FFCE56"], // Custom colors for this chart
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Call Type Distribution */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <CustomChart
              type="bar"
              series={[{ data: callTypeData }]}
              options={{
                ...chartOptions,
                xaxis: { categories: callTypeCategories },
                title: { text: "Call Type Distribution", style: { fontSize: "16px", color: "#374151" } },
                colors: ["#4BC0C0", "#9966FF", "#FF9F40"], // Custom colors for this chart
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Average Call Duration by Agent */}
          <div className="row-span-1 sm:row-span-2 lg:row-span-2 h-full">
            <Suspense fallback={<div>Loading Chart...</div>}>
              <CustomChart
                type="bar"
                series={[{ data: avgCallDurationData }]}
                options={{
                  ...chartOptions,
                  plotOptions: { bar: { horizontal: true } },
                  xaxis: { categories: avgCallDurationCategories },
                  title: { text: "Average Call Duration by Agent", style: { fontSize: "16px", color: "#374151" } },
                  colors: ["#36A2EB", "#FF6384", "#FFCE56"], // Custom colors for this chart
                }}
                width="100%"
                height="100%"
              />
            </Suspense>
          </div>

          {/* AI Success Rate Over Time */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <CustomChart
              type="line"
              series={[{ name: "AI Success Rate", data: aiSuccessRateData }]}
              options={{
                ...chartOptions,
                xaxis: { categories: aiSuccessRateCategories },
                title: { text: "AI Success Rate Over Time", style: { fontSize: "16px", color: "#374151" } },
                colors: ["#FF6384"], // Custom colors for this chart
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Satisfaction Score Distribution */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <CustomChart
              type="bar"
              series={[{ data: satisfactionScoreData }]}
              options={{
                ...chartOptions,
                xaxis: { categories: satisfactionScoreCategories },
                title: { text: "Satisfaction Score Distribution", style: { fontSize: "16px", color: "#374151" } },
                colors: ["#4BC0C0", "#9966FF", "#FF9F40"], // Custom colors for this chart
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Calls Handled by Agent */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <Suspense fallback={<div>Loading Chart...</div>}>
              <CustomChart
                type="bar"
                series={[{ data: callsHandledByAgentData }]}
                options={{
                  ...chartOptions,
                  xaxis: { categories: callsHandledByAgentCategories },
                  title: { text: "Calls Handled by Agent", style: { fontSize: "16px", color: "#374151" } },
                  colors: ["#36A2EB", "#FF6384", "#FFCE56"], // Custom colors for this chart
                }}
                width="100%"
                height="300px"
              />
            </Suspense>
          </div>

          {/* Total Calls Over Time */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <CustomChart
              type="line"
              series={[{ name: "Total Calls", data: totalCallsOverTimeData }]}
              options={{
                ...chartOptions,
                xaxis: { categories: totalCallsOverTimeCategories },
                title: { text: "Total Calls Over Time", style: { fontSize: "16px", color: "#374151" } },
                colors: ["#9966FF"], // Custom colors for this chart
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Average Wait Time Over Time */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <CustomChart
              type="line"
              series={[{ name: "Average Wait Time", data: avgWaitTimeData }]}
              options={{
                ...chartOptions,
                xaxis: { categories: avgWaitTimeCategories },
                title: { text: "Average Wait Time Over Time", style: { fontSize: "16px", color: "#374151" } },
                colors: ["#FF9F40"], // Custom colors for this chart
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Service Level Percentage Over Time */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <CustomChart
              type="line"
              series={[{ name: "Service Level Percentage", data: serviceLevelPercentageData }]}
              options={{
                ...chartOptions,
                xaxis: { categories: serviceLevelPercentageCategories },
                title: { text: "Service Level Percentage Over Time", style: { fontSize: "16px", color: "#374151" } },
                colors: ["#4BC0C0"], // Custom colors for this chart
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Conversion Rate Over Time */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <CustomChart
              type="line"
              series={[{ name: "Conversion Rate", data: conversionRateData }]}
              options={{
                ...chartOptions,
                xaxis: { categories: conversionRateCategories },
                title: { text: "Conversion Rate Over Time", style: { fontSize: "16px", color: "#374151" } },
                colors: ["#FF6384"], // Custom colors for this chart
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Interaction Type Distribution */}
          <Suspense fallback={<div>Loading Chart...</div>}>
            <CustomChart
              type="bar"
              series={[{ data: interactionTypeData }]}
              options={{
                ...chartOptions,
                xaxis: { categories: interactionTypeCategories },
                title: { text: "Interaction Type Distribution", style: { fontSize: "16px", color: "#374151" } },
                colors: ["#36A2EB", "#FF6384", "#FFCE56"], // Custom colors for this chart
              }}
              width="100%"
              height="300px"
            />
          </Suspense>

          {/* Call Category Distribution */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <Suspense fallback={<div>Loading Chart...</div>}>
              <CustomChart
                type="bar"
                series={[{ data: callCategoryData }]}
                options={{
                  ...chartOptions,
                  xaxis: { categories: callCategoryCategories },
                  title: { text: "Call Category Distribution", style: { fontSize: "16px", color: "#374151" } },
                  colors: ["#4BC0C0", "#9966FF", "#FF9F40"], // Custom colors for this chart
                }}
                width="100%"
                height="300px"
              />
            </Suspense>
          </div>

          {/* Transcript Length Distribution */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <Suspense fallback={<div>Loading Chart...</div>}>
              <CustomChart
                type="bar"
                series={[{ data: transcriptLengthData }]}
                options={{
                  ...chartOptions,
                  xaxis: { categories: transcriptLengthCategories },
                  title: { text: "Transcript Length Distribution", style: { fontSize: "16px", color: "#374151" } },
                  colors: ["#36A2EB", "#FF6384", "#FFCE56"], // Custom colors for this chart
                }}
                width="100%"
                height="300px"
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};