from django.urls import path
from .views import (
    SubscriptionPlanDistribution, AdminsPerOrganization, AgentStatusDistribution,
    CallTypeDistribution, AverageCallDurationByAgent, AISuccessRateOverTime,
    SatisfactionScoreDistribution, CallsHandledByAgent, TotalCallsOverTime,
    AverageWaitTimeOverTime, ServiceLevelPercentageOverTime, ConversionRateOverTime,
    InteractionTypeDistribution, CallCategoryDistribution, TranscriptLengthDistribution,DashboardData,upload_file,
    LeadGenerationListCreateView,
    LeadGenerationRetrieveUpdateDestroyView,
    OrderConfirmationListCreateView,
    OrderConfirmationRetrieveUpdateDestroyView,
)

urlpatterns = [
    path('subscription-distribution/', SubscriptionPlanDistribution.as_view()),
    path('admins-per-organization/', AdminsPerOrganization.as_view()),
    path('agent-status-distribution/', AgentStatusDistribution.as_view()),
    path('call-type-distribution/', CallTypeDistribution.as_view()),
    path('average-call-duration/', AverageCallDurationByAgent.as_view()),
    path('ai-success-rate/', AISuccessRateOverTime.as_view()),
    path('satisfaction-score-distribution/', SatisfactionScoreDistribution.as_view()),
    path('calls-handled-by-agent/', CallsHandledByAgent.as_view()),
    path('total-calls-over-time/', TotalCallsOverTime.as_view()),
    path('average-wait-time/', AverageWaitTimeOverTime.as_view()),
    path('service-level-percentage/', ServiceLevelPercentageOverTime.as_view()),
    path('conversion-rate-over-time/', ConversionRateOverTime.as_view()),
    path('interaction-type-distribution/', InteractionTypeDistribution.as_view()),
    path('call-category-distribution/', CallCategoryDistribution.as_view()),
    path('transcript-length-distribution/', TranscriptLengthDistribution.as_view()),
    path('dashboard-data/', DashboardData.as_view()),
    path('upload/', upload_file, name='upload_file'),
    path('leads/', LeadGenerationListCreateView.as_view(), name='lead-list-create'),
    path('leads/<int:pk>/', LeadGenerationRetrieveUpdateDestroyView.as_view(), name='lead-retrieve-update-destroy'),
    path('orders/', OrderConfirmationListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderConfirmationRetrieveUpdateDestroyView.as_view(), name='order-retrieve-update-destroy'),

]