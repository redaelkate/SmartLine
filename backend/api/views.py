from django.db.models import Count, Avg
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import (
    Organization, Admin, Agent, Call, CallTranscript, CallPerformance,
    AIInteractionMetrics, CustomerSatisfaction, AgentPerformance, CallTrends,
    CallQueue, ServiceLevel, ConversionAnalytics, AgentInteractionLog,
    DetailedCallAnalytics
)
from .serializers import (
    OrganizationSerializer, AdminSerializer, AgentSerializer, CallSerializer,
    CallTranscriptSerializer, CallPerformanceSerializer, AIInteractionMetricsSerializer,
    CustomerSatisfactionSerializer, AgentPerformanceSerializer, CallTrendsSerializer,
    CallQueueSerializer, ServiceLevelSerializer, ConversionAnalyticsSerializer,
    AgentInteractionLogSerializer, DetailedCallAnalyticsSerializer
)

class SubscriptionPlanDistribution(APIView):
    def get(self, request):
        data = Organization.objects.values('subscription_plan').annotate(count=Count('id'))
        return Response(data)

class AdminsPerOrganization(APIView):
    def get(self, request):
        data = Admin.objects.values('organization__name').annotate(count=Count('id'))
        return Response(data)

class AgentStatusDistribution(APIView):
    def get(self, request):
        data = Agent.objects.values('status').annotate(count=Count('id'))
        return Response(data)

class CallTypeDistribution(APIView):
    def get(self, request):
        data = Call.objects.values('call_type').annotate(count=Count('id'))
        return Response(data)

class AverageCallDurationByAgent(APIView):
    def get(self, request):
        data = CallPerformance.objects.values('agent__name').annotate(avg_duration=Avg('average_call_duration'))
        return Response(data)

class AISuccessRateOverTime(APIView):
    def get(self, request):
        data = AIInteractionMetrics.objects.values('date').annotate(avg_success_rate=Avg('ai_success_rate'))
        return Response(data)

class SatisfactionScoreDistribution(APIView):
    def get(self, request):
        data = CustomerSatisfaction.objects.values('satisfaction_score').annotate(count=Count('id'))
        return Response(data)

class CallsHandledByAgent(APIView):
    def get(self, request):
        data = AgentPerformance.objects.values('agent__name').annotate(total_calls=Count('calls_handled'))
        return Response(data)

class TotalCallsOverTime(APIView):
    def get(self, request):
        data = CallTrends.objects.values('date').annotate(total_calls=Count('total_calls'))
        return Response(data)

class AverageWaitTimeOverTime(APIView):
    def get(self, request):
        data = CallQueue.objects.values('date').annotate(avg_wait_time=Avg('average_wait_time'))
        return Response(data)

class ServiceLevelPercentageOverTime(APIView):
    def get(self, request):
        data = ServiceLevel.objects.values('date').annotate(avg_service_level=Avg('service_level_percentage'))
        return Response(data)

class ConversionRateOverTime(APIView):
    def get(self, request):
        data = ConversionAnalytics.objects.values('date').annotate(avg_conversion_rate=Avg('conversion_rate'))
        return Response(data)

class InteractionTypeDistribution(APIView):
    def get(self, request):
        data = AgentInteractionLog.objects.values('interaction_type').annotate(count=Count('id'))
        return Response(data)

class CallCategoryDistribution(APIView):
    def get(self, request):
        data = DetailedCallAnalytics.objects.values('call_category').annotate(count=Count('id'))
        return Response(data)

class TranscriptLengthDistribution(APIView):
    def get(self, request):
        data = CallTranscript.objects.annotate(length=Count('transcript')).values('length').annotate(count=Count('id'))
        return Response(data)
    



