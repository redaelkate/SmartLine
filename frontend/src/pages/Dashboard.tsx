import { BarChart3, Users, DollarSign } from "lucide-react";
import Chart from "react-apexcharts";
import { StatsCard } from "../components/StatsCard";
import { RecentUsers } from "../components/RecentUsers";
import { QuickActions } from "../components/dashboard/QuickActions";
import "./Dashboard.css";
import axios from "axios";
import { useEffect, useState } from "react";

const primary = {
  500: "#1D4ED8",
  300: "#93C5FD"
};

const neutral = {
  500: "#6B7280",
  300: "#D1D5DB"
};

export const Dashboard = () => {
  const [subscriptionDistribution, setSubscriptionDistribution] = useState([]);
  const [adminsPerOrg, setAdminsPerOrg] = useState([]);
  const [agentStatus, setAgentStatus] = useState([]);
  const [callType, setCallType] = useState([]);
  const [avgCallDuration, setAvgCallDuration] = useState([]);
  const [aiSuccessRate, setAISuccessRate] = useState([]);
  const [satisfactionScore, setSatisfactionScore] = useState([]);
  const [callsHandledByAgent, setCallsHandledByAgent] = useState([]);
  const [totalCallsOverTime, setTotalCallsOverTime] = useState([]);
  const [avgWaitTime, setAvgWaitTime] = useState([]);
  const [serviceLevelPercentage, setServiceLevelPercentage] = useState([]);
  const [conversionRate, setConversionRate] = useState([]);
  const [interactionType, setInteractionType] = useState([]);
  const [callCategory, setCallCategory] = useState([]);
  const [transcriptLength, setTranscriptLength] = useState([]);

  useEffect(() => {
    // Fetch data from all API endpoints
    const fetchData = async () => {
      try {
        const [
          subscriptionRes,
          adminsRes,
          agentStatusRes,
          callTypeRes,
          avgCallDurationRes,
          aiSuccessRateRes,
          satisfactionScoreRes,
          callsHandledRes,
          totalCallsRes,
          avgWaitTimeRes,
          serviceLevelRes,
          conversionRateRes,
          interactionTypeRes,
          callCategoryRes,
          transcriptLengthRes,
        ] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/subscription-distribution/"),
          axios.get("http://127.0.0.1:8000/api/admins-per-organization/"),
          axios.get("http://127.0.0.1:8000/api/agent-status-distribution/"),
          axios.get("http://127.0.0.1:8000/api/call-type-distribution/"),
          axios.get("http://127.0.0.1:8000/api/average-call-duration/"),
          axios.get("http://127.0.0.1:8000/api/ai-success-rate/"),
          axios.get("http://127.0.0.1:8000/api/satisfaction-score-distribution/"),
          axios.get("http://127.0.0.1:8000/api/calls-handled-by-agent/"),
          axios.get("http://127.0.0.1:8000/api/total-calls-over-time/"),
          axios.get("http://127.0.0.1:8000/api/average-wait-time/"),
          axios.get("http://127.0.0.1:8000/api/service-level-percentage/"),
          axios.get("http://127.0.0.1:8000/api/conversion-rate-over-time/"),
          axios.get("http://127.0.0.1:8000/api/interaction-type-distribution/"),
          axios.get("http://127.0.0.1:8000/api/call-category-distribution/"),
          axios.get("http://127.0.0.1:8000/api/transcript-length-distribution/"),
        ]);

        setSubscriptionDistribution(subscriptionRes.data);
        setAdminsPerOrg(adminsRes.data);
        setAgentStatus(agentStatusRes.data);
        setCallType(callTypeRes.data);
        setAvgCallDuration(avgCallDurationRes.data);
        setAISuccessRate(aiSuccessRateRes.data);
        setSatisfactionScore(satisfactionScoreRes.data);
        setCallsHandledByAgent(callsHandledRes.data);
        setTotalCallsOverTime(totalCallsRes.data);
        setAvgWaitTime(avgWaitTimeRes.data);
        setServiceLevelPercentage(serviceLevelRes.data);
        setConversionRate(conversionRateRes.data);
        setInteractionType(interactionTypeRes.data);
        setCallCategory(callCategoryRes.data);
        setTranscriptLength(transcriptLengthRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
          {/* Subscription Plan Distribution */}
          <Chart
            type="bar"
            series={[{ data: subscriptionDistribution.map((item) => item.count) }]}
            options={{
              chart: { toolbar: { show: true } },
              xaxis: { categories: ['Premium', 'Enterprise', 'Basic'] },
              title: { text: 'Subscription Plan Distribution' }
            }}
            width="100%"
            height="300px"
          />

          {/* Admins per Organization */}
          <Chart
            type="bar"
            series={[{ data: adminsPerOrg.map((item) => item.count) }]}
            options={{
              chart: { toolbar: { show: false } },
              xaxis: { categories: adminsPerOrg.map((item) => item.organization__name) },
              title: { text: 'Admins per Organization' }
            }}
            width="100%"
            height="300px"
          />

          {/* Agent Status Distribution */}
          <Chart
            type="donut"
            series={agentStatus.map((item) => item.count)}
            options={{
              chart: { toolbar: { show: false } },
              labels: agentStatus.map((item) => item.status),
              title: { text: 'Agent Status Distribution' }
            }}
            width="100%"
            height="300px"
          />

          {/* Call Type Distribution */}
          <Chart
            type="bar"
            series={[{ data: callType.map((item) => item.count) }]}
            options={{
              chart: { toolbar: { show: false } },
              xaxis: { categories: callType.map((item) => item.call_type) },
              title: { text: 'Call Type Distribution' }
            }}
            width="100%"
            height="300px"
          />

          {/* Average Call Duration by Agent */}
          <Chart
            type="bar"
            series={[{ data: avgCallDuration.map((item) => parseInt(item.avg_duration)) }]}
            options={{
              chart: { toolbar: { show: false } },
              xaxis: { categories: avgCallDuration.map((item) => item.agent__name) },
              title: { text: 'Average Call Duration by Agent' }
            }}
            width="100%"
            height="300px"
          />

          {/* AI Success Rate Over Time */}
          <Chart
            type="line"
            series={[{ name: 'AI Success Rate', data: aiSuccessRate.map((item) => parseInt(item.avg_success_rate)) }]}
            options={{
              chart: { toolbar: { show: false } },
              xaxis: { categories: aiSuccessRate.map((item) => item.date) },
              title: { text: 'AI Success Rate Over Time' }
            }}
            width="100%"
            height="300px"
          />

          {/* Satisfaction Score Distribution */}
          <Chart
            type="bar"
            series={[{ data: satisfactionScore.map((item) => item.count) }]}
            options={{
              chart: { toolbar: { show: false } },
              xaxis: { categories: satisfactionScore.map((item) => item.satisfaction_score) },
              title: { text: 'Satisfaction Score Distribution' }
            }}
            width="100%"
            height="300px"
          />

          {/* Calls Handled by Agent */}
          <Chart
            type="bar"
            series={[{ data: callsHandledByAgent.map((item) => item.total_calls) }]}
            options={{
              chart: { toolbar: { show: false } },
              xaxis: { categories: callsHandledByAgent.map((item) => item.agent__name) },
              title: { text: 'Calls Handled by Agent' }
            }}
            width="100%"
            height="300px"
          />

          {/* Total Calls Over Time */}
          <Chart
            type="line"
            series={[{ name: 'Total Calls', data: totalCallsOverTime.map((item) => item.total_calls) }]}
            options={{
              chart: { toolbar: { show: false } },
              xaxis: { categories: totalCallsOverTime.map((item) => item.date) },
              title: { text: 'Total Calls Over Time' }
            }}
            width="100%"
            height="300px"
          />

          {/* Average Wait Time Over Time */}
          <Chart
            type="line"
            series={[{ name: 'Average Wait Time', data: avgWaitTime.map((item) => parseInt(item.avg_wait_time)) }]}
            options={{
              chart: { toolbar: { show: false } },
              xaxis: { categories: avgWaitTime.map((item) => item.date) },
              title: { text: 'Average Wait Time Over Time' }
            }}
            width="100%"
            height="300px"
          />

          {/* Service Level Percentage Over Time */}
          <Chart
            type="line"
            series={[{ name: 'Service Level Percentage', data: serviceLevelPercentage.map((item) => parseInt(item.avg_service_level)) }]}
            options={{
              chart: { toolbar: { show: false } },
              xaxis: { categories: serviceLevelPercentage.map((item) => item.date) },
              title: { text: 'Service Level Percentage Over Time' }
            }}
            width="100%"
            height="300px"
          />

          {/* Conversion Rate Over Time */}
          <Chart
            type="line"
            series={[{ name: 'Conversion Rate', data: conversionRate.map((item) => parseInt(item.avg_conversion_rate)) }]}
            options={{
              chart: { toolbar: { show: false } },
              xaxis: { categories: conversionRate.map((item) => item.date) },
              title: { text: 'Conversion Rate Over Time' }
            }}
            width="100%"
            height="300px"
          />

          {/* Interaction Type Distribution */}
          <Chart
            type="bar"
            series={[{ data: interactionType.map((item) => item.count) }]}
            options={{
              chart: { toolbar: { show: false } },
              xaxis: { categories: interactionType.map((item) => item.interaction_type) },
              title: { text: 'Interaction Type Distribution' }
            }}
            width="100%"
            height="300px"
          />

          {/* Call Category Distribution */}
          <Chart
            type="bar"
            series={[{ data: callCategory.map((item) => item.count) }]}
            options={{
              chart: { toolbar: { show: false } },
              xaxis: { categories: callCategory.map((item) => item.call_category) },
              title: { text: 'Call Category Distribution' }
            }}
            width="100%"
            height="300px"
          />

          {/* Transcript Length Distribution */}
          <Chart
            type="bar"
            series={[{ data: transcriptLength.map((item) => item.count) }]}
            options={{
              chart: { toolbar: { show: false } },
              xaxis: { categories: transcriptLength.map((item) => item.length) },
              title: { text: 'Transcript Length Distribution' }
            }}
            width="100%"
            height="300px"
          />
        </div>
      </div>
    </div>
  );
};