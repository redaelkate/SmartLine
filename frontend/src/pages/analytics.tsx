
import { useState } from 'react';
import  axios  from 'axios';


  const [subscriptionData, setSubscriptionData] = useState([]);
  const [adminsData, setAdminsData] = useState([]);
  const [agentStatusData, setAgentStatusData] = useState([]);
  const [callTypeData, setCallTypeData] = useState([]);
  const [callDurationData, setCallDurationData] = useState([]);
  const [aiSuccessData, setAISuccessData] = useState([]);
  const [satisfactionData, setSatisfactionData] = useState([]);
  const [agentPerformanceData, setAgentPerformanceData] = useState([]);
  const [callTrendsData, setCallTrendsData] = useState([]);
  const [callQueueData, setCallQueueData] = useState([]);
  const [serviceLevelData, setServiceLevelData] = useState([]);
  const [conversionData, setConversionData] = useState([]);
  const [interactionTypeData, setInteractionTypeData] = useState([]);
  const [callCategoryData, setCallCategoryData] = useState([]);
  const [transcriptLengthData, setTranscriptLengthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


export const Analytics = () => {





  


  const fetchData = async () => {
    try {
      const [
        subscriptionResponse,
        adminsResponse,
        agentStatusResponse,
        callTypeResponse,
        callDurationResponse,
        aiSuccessResponse,
        satisfactionResponse,
        agentPerformanceResponse,
        callTrendsResponse,
        callQueueResponse,
        serviceLevelResponse,
        conversionResponse,
        interactionTypeResponse,
        callCategoryResponse,
        transcriptLengthResponse,
      ] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/subscription-distribution/'),
        axios.get('http://127.0.0.1:8000/api/admins-per-organization/'),
        axios.get('http://127.0.0.1:8000/api/agent-status-distribution/'),
        axios.get('http://127.0.0.1:8000/api/call-type-distribution/'),
        axios.get('http://127.0.0.1:8000/api/average-call-duration/'),
        axios.get('http://127.0.0.1:8000/api/ai-success-rate/'),
        axios.get('http://127.0.0.1:8000/api/satisfaction-score-distribution/'),
        axios.get('http://127.0.0.1:8000/api/calls-handled-by-agent/'),
        axios.get('http://127.0.0.1:8000/api/total-calls-over-time/'),
        axios.get('http://127.0.0.1:8000/api/average-wait-time/'),
        axios.get('http://127.0.0.1:8000/api/service-level-percentage/'),
        axios.get('http://127.0.0.1:8000/api/conversion-rate-over-time/'),
        axios.get('http://127.0.0.1:8000/api/interaction-type-distribution/'),
        axios.get('http://127.0.0.1:8000/api/call-category-distribution/'),
        axios.get('http://127.0.0.1:8000/api/transcript-length-distribution/'),
      ]);

      setSubscriptionData(subscriptionResponse.data);
      setAdminsData(adminsResponse.data);
      setAgentStatusData(agentStatusResponse.data);
      setCallTypeData(callTypeResponse.data);
      setCallDurationData(callDurationResponse.data);
      setAISuccessData(aiSuccessResponse.data);
      setSatisfactionData(satisfactionResponse.data);
      setAgentPerformanceData(agentPerformanceResponse.data);
      setCallTrendsData(callTrendsResponse.data);
      setCallQueueData(callQueueResponse.data);
      setServiceLevelData(serviceLevelResponse.data);
      setConversionData(conversionResponse.data);
      setInteractionTypeData(interactionTypeResponse.data);
      setCallCategoryData(callCategoryResponse.data);
      setTranscriptLengthData(transcriptLengthResponse.data);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    staticData.adminsPerOrg = adminsData;
    staticData.agentStatus = agentStatusData;
    staticData.callType = callTypeData;
    staticData.callDuration = callDurationData;
    staticData.aiSuccessRate = aiSuccessData;
    staticData.satisfactionScore = satisfactionData;
    staticData.callsHandledByAgent = agentPerformanceData;
    staticData.totalCallsOverTime = callTrendsData;
    staticData.avgWaitTime = callQueueData;
    staticData.serviceLevelPercentage = serviceLevelData;
    staticData.conversionRate = conversionData;
    staticData.interactionType = interactionTypeData;
    staticData.callCategory = callCategoryData;
    staticData.transcriptLength = transcriptLengthData;
    staticData.avgResponseTime = agentPerformanceData;
    staticData.avgSatisfactionByAgent = agentPerformanceData;
    staticData.avgResponseTimeByAgent = agentPerformanceData;
    staticData.totalVsCompletedCalls = {
      total: callTrendsData,
      completed: agentPerformanceData,
    };
    staticData.avgCallDurationByAgent = agentPerformanceData;
    staticData.aiCallsHandled = agentPerformanceData;


};




export const staticData = {
    adminsPerOrg: adminsData,
    agentStatus: agentStatusData,
    callType: callTypeData,
    callStatus: [70, 20, 10, 50, 30],
    callDuration: [5, 10, 15, 20, 25],
    avgCallDurationByAgent: callDurationData,
    totalVsCompletedCalls: {
      total: callTrendsData,
      completed: [20, 30, 25, 40, 39, 50, 60],
    },
    missedCallsOverTime: [5, 10, 15, 20, 25, 30, 35],
    aiSuccessRate: [80, 85, 90, 95, 92, 88, 85],
    aiCallsHandled: [10, 20, 30, 40, 50, 60, 70],
    avgResponseTime: [2, 3, 4, 5, 4, 3, 2],
    satisfactionScore: [10, 20, 30, 40, 50],
    sentimentScore: [10, 20, 30, 40, 50],
    satisfactionVsSentiment: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
    callsHandledByAgent: [10, 20, 30, 40, 50],
    avgSatisfactionByAgent: [4, 3, 5, 2, 1],
    avgResponseTimeByAgent: [2, 3, 4, 5, 4],
    totalCallsOverTime: [30, 40, 35, 50, 49, 60, 70],
    inboundVsOutbound: {
      inbound: [10, 20, 30, 40, 50],
      outbound: [5, 15, 25, 35, 45],
    },
    peakHours: [5, 10, 15, 20, 25, 30, 35],
    avgWaitTime: [2, 3, 4, 5, 4, 3, 2],
    maxQueueLength: [5, 10, 15, 20, 25, 30, 35],
    abandonedCalls: [1, 2, 3, 4, 5, 6, 7],
    serviceLevelPercentage: [90, 85, 80, 75, 70, 65, 60],
    conversionRate: [5, 10, 15, 20, 25, 30, 35],
    totalCallsVsConversions: {
      totalCalls: [30, 40, 35, 50, 49, 60, 70],
      conversions: [10, 20, 15, 30, 29, 40, 50],
    },
    interactionType: [10, 20, 30, 40, 50],
    interactionDuration: [5, 10, 15, 20, 25],
    callCategory: [10, 20, 30, 40, 50],
    resolutionTime: [2, 3, 4, 5, 4],
    followUpRequired: [10, 20, 30, 40, 50],
    transcriptLength: [100, 200, 300, 400, 500],
  };
  