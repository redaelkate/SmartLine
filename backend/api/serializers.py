from rest_framework import serializers
from .models import (
    Organization, Admin, Agent, Call, CallTranscript, CallPerformance,Client,
    AIInteractionMetrics, CustomerSatisfaction, AgentPerformance, CallTrends,
    CallQueue, ServiceLevel, ConversionAnalytics, AgentInteractionLog,LeadGeneration, OrderConfirmation,
    DetailedCallAnalytics
)


class OrderConfirmationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderConfirmation
        fields = '__all__'  # Include all fields from the model

class LeadGenerationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadGeneration
        fields = '__all__'

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = '__all__'

class CallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Call
        fields = '__all__'

class CallTranscriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallTranscript
        fields = '__all__'

class CallPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallPerformance
        fields = '__all__'

class AIInteractionMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIInteractionMetrics
        fields = '__all__'

class CustomerSatisfactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerSatisfaction
        fields = '__all__'

class AgentPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentPerformance
        fields = '__all__'

class CallTrendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallTrends
        fields = '__all__'

class CallQueueSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallQueue
        fields = '__all__'

class ServiceLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceLevel
        fields = '__all__'

class ConversionAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConversionAnalytics
        fields = '__all__'

class AgentInteractionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentInteractionLog
        fields = '__all__'

class DetailedCallAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetailedCallAnalytics
        fields = '__all__'