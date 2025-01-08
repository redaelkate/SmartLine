from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SubscriptionPlanDistribution, AdminsPerOrganization, AgentStatusDistribution,
    CallTypeDistribution, AverageCallDurationByAgent, AISuccessRateOverTime,
    SatisfactionScoreDistribution, CallsHandledByAgent, TotalCallsOverTime,
    AverageWaitTimeOverTime, ServiceLevelPercentageOverTime, ConversionRateOverTime,
    InteractionTypeDistribution, CallCategoryDistribution, TranscriptLengthDistribution,
    DashboardData, upload_file, TotalClientsPerMonth,
    LeadGenerationListCreateView, LeadGenerationRetrieveUpdateDestroyView,
    OrderConfirmationListCreateView, OrderConfirmationRetrieveUpdateDestroyView,
    AgentListCreateView, AgentRetrieveUpdateDestroyView,
    ClientViewSet, CallViewSet, AgentViewSet, UploadLeadsView, UploadOrdersView
)

# Create a router and register the viewsets
router = DefaultRouter()
router.register(r'clients', ClientViewSet)  # Generates URLs for ClientViewSet
router.register(r'calls', CallViewSet)      # Generates URLs for CallViewSet
router.register(r'agents', AgentViewSet)    # Generates URLs for AgentViewSet

urlpatterns = [
    # API endpoints for analytics and dashboards
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
    path('clients-number-month/', TotalClientsPerMonth.as_view()),

    # File upload endpoint
    path('upload/', upload_file, name='upload_file'),
    path('upload/leads/', UploadLeadsView.as_view(), name='upload-leads'),
    path('upload/orders/', UploadOrdersView.as_view(), name='upload-orders'),

    # Lead generation endpoints
    path('leads/', LeadGenerationListCreateView.as_view(), name='lead-list-create'),
    path('leads/<int:pk>/', LeadGenerationRetrieveUpdateDestroyView.as_view(), name='lead-retrieve-update-destroy'),

    # Order confirmation endpoints
    path('orders/', OrderConfirmationListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderConfirmationRetrieveUpdateDestroyView.as_view(), name='order-retrieve-update-destroy'),

    # Agent endpoints (if not using ViewSet)
    path('agents/', AgentListCreateView.as_view(), name='agent-list-create'),
    path('agents/<int:pk>/', AgentRetrieveUpdateDestroyView.as_view(), name='agent-retrieve-update-destroy'),

    # Include the router's URLs (for ClientViewSet, CallViewSet, and AgentViewSet)
    path('', include(router.urls)),
]