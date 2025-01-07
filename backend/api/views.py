from django.db.models import Count, Avg
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import (
    Organization, Admin, Agent, Call, CallTranscript, CallPerformance,
    AIInteractionMetrics, CustomerSatisfaction, AgentPerformance, CallTrends,
    CallQueue, ServiceLevel, ConversionAnalytics, AgentInteractionLog,
    DetailedCallAnalytics,UploadedFile
)

import os 


@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        uploaded_file = request.FILES['file']
        # Save the file to the database
        uploaded = UploadedFile(file=uploaded_file)
        uploaded.save()
        # Return a success response
        return JsonResponse({'message': 'File uploaded successfully', 'file': uploaded.file.name})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

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
    





class DashboardData(APIView):
    def get(self, request):
        # Subscription Plan Distribution
        subscription_data = Organization.objects.values('subscription_plan').annotate(count=Count('id'))

        # Admins per Organization
        admins_data = Admin.objects.values('organization__name').annotate(count=Count('id'))

        # Agent Status Distribution
        agent_status_data = Agent.objects.values('status').annotate(count=Count('id'))

        # Call Type Distribution
        call_type_data = Call.objects.values('call_type').annotate(count=Count('id'))

        # Average Call Duration by Agent
        avg_call_duration_data = CallPerformance.objects.values('agent__name').annotate(avg_duration=Avg('average_call_duration'))

        # AI Success Rate Over Time
        ai_success_rate_data = AIInteractionMetrics.objects.values('date').annotate(avg_success_rate=Avg('ai_success_rate'))

        # Satisfaction Score Distribution
        satisfaction_score_data = CustomerSatisfaction.objects.values('satisfaction_score').annotate(count=Count('id'))

        # Calls Handled by Agent
        calls_handled_data = AgentPerformance.objects.values('agent__name').annotate(total_calls=Count('calls_handled'))

        # Total Calls Over Time
        total_calls_data = CallTrends.objects.values('date').annotate(total_calls=Count('total_calls'))

        # Average Wait Time Over Time
        avg_wait_time_data = CallQueue.objects.values('date').annotate(avg_wait_time=Avg('average_wait_time'))

        # Service Level Percentage Over Time
        service_level_data = ServiceLevel.objects.values('date').annotate(avg_service_level=Avg('service_level_percentage'))

        # Conversion Rate Over Time
        conversion_rate_data = ConversionAnalytics.objects.values('date').annotate(avg_conversion_rate=Avg('conversion_rate'))

        # Interaction Type Distribution
        interaction_type_data = AgentInteractionLog.objects.values('interaction_type').annotate(count=Count('id'))

        # Call Category Distribution
        call_category_data = DetailedCallAnalytics.objects.values('call_category').annotate(count=Count('id'))

        # Transcript Length Distribution
        transcript_length_data = CallTranscript.objects.annotate(length=Count('transcript')).values('length').annotate(count=Count('id'))

        return Response({
            'subscription_distribution': subscription_data,
            'admins_per_organization': admins_data,
            'agent_status_distribution': agent_status_data,
            'call_type_distribution': call_type_data,
            'average_call_duration': avg_call_duration_data,
            'ai_success_rate': ai_success_rate_data,
            'satisfaction_score_distribution': satisfaction_score_data,
            'calls_handled_by_agent': calls_handled_data,
            'total_calls_over_time': total_calls_data,
            'average_wait_time': avg_wait_time_data,
            'service_level_percentage': service_level_data,
            'conversion_rate': conversion_rate_data,
            'interaction_type_distribution': interaction_type_data,
            'call_category_distribution': call_category_data,
            'transcript_length_distribution': transcript_length_data,
        })