from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# Create your models here.
from django.db import models


# Organization Model
class Organization(models.Model):
    BASIC = 'basic'
    PRO = 'pro'
    ENTERPRISE = 'enterprise'
    
    SUBSCRIPTION_PLANS = [
        (BASIC, 'Basic'),
        (PRO, 'Pro'),
        (ENTERPRISE, 'Enterprise'),
    ]

    name = models.CharField(max_length=255, unique=True)
    subscription_plan = models.CharField(max_length=20, choices=SUBSCRIPTION_PLANS, default=BASIC)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


# Admin Model
class Admin(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="admins")
    email = models.EmailField()
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email

class Client(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="clients")
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.name


# AI Agent Model
class Agent(models.Model):
    ACTIVE = 'active'
    INACTIVE = 'inactive'

    STATUS_CHOICES = [
        (ACTIVE, 'Active'),
        (INACTIVE, 'Inactive'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="agents")
    name = models.CharField(max_length=255)
    model = models.CharField(max_length=255)  # e.g., GPT-4, custom
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Call(models.Model):
    INBOUND = 'inbound'
    OUTBOUND = 'outbound'

    CALL_TYPES = [
        (INBOUND, 'Inbound'),
        (OUTBOUND, 'Outbound'),
    ]

    COMPLETED = 'completed'
    MISSED = 'missed'
    DROPPED = 'dropped'

    STATUS_CHOICES = [
        (COMPLETED, 'Completed'),
        (MISSED, 'Missed'),
        (DROPPED, 'Dropped'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="calls")
    agent = models.ForeignKey(Agent, on_delete=models.SET_NULL, null=True, related_name="calls")
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="calls", null=True, blank=True)  # Add this line
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    call_type = models.CharField(max_length=20, choices=CALL_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=COMPLETED)
    duration_seconds = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Call {self.id} - {self.organization.name}"

# Call Transcript Model
class CallTranscript(models.Model):
    call = models.OneToOneField(Call, on_delete=models.CASCADE, related_name="transcript")
    transcript = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transcript for Call {self.call.id}"


# Call Performance Analytics
class CallPerformance(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="call_performance")
    agent = models.ForeignKey(Agent, on_delete=models.SET_NULL, null=True, blank=True, related_name="call_performance")
    date = models.DateField()
    total_calls = models.IntegerField(default=0)
    completed_calls = models.IntegerField(default=0)
    missed_calls = models.IntegerField(default=0)
    average_call_duration = models.FloatField(default=0.0)

    def __str__(self):
        return f"Call Performance for {self.organization.name} on {self.date}"


# AI Interaction Analytics
class AIInteractionMetrics(models.Model):
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name="ai_metrics")
    date = models.DateField()
    ai_calls_handled = models.IntegerField(default=0)
    ai_success_rate = models.FloatField(default=0.0)  # Percentage
    average_response_time = models.FloatField(default=0.0)
    handoff_count = models.IntegerField(default=0)

    def __str__(self):
        return f"AI Metrics for {self.agent.name} on {self.date}"


# Customer Satisfaction Analytics
class CustomerSatisfaction(models.Model):
    call = models.ForeignKey(Call, on_delete=models.CASCADE, related_name="satisfaction")
    satisfaction_score = models.IntegerField()  # 1 to 5
    sentiment_score = models.FloatField()  # -1 to 1
    feedback_text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Satisfaction for Call {self.call.id}"


# Agent Performance Analytics
class AgentPerformance(models.Model):
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name="performance")
    date = models.DateField()
    calls_handled = models.IntegerField(default=0)
    average_duration = models.FloatField(default=0.0)
    satisfaction_score_avg = models.FloatField(default=0.0)
    response_time_avg = models.FloatField(default=0.0)

    def __str__(self):
        return f"Performance for Agent {self.agent.name} on {self.date}"


# Call Trends Analytics
class CallTrends(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="call_trends")
    date = models.DateField()
    peak_hours = models.CharField(max_length=255)  # e.g., "10-12, 14-16"
    total_calls = models.IntegerField(default=0)
    inbound_calls = models.IntegerField(default=0)
    outbound_calls = models.IntegerField(default=0)

    def __str__(self):
        return f"Call Trends for {self.organization.name} on {self.date}"




# Call Queue Analytics
class CallQueue(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="call_queue")
    date = models.DateField()
    max_queue_length = models.IntegerField(default=0)
    average_queue_length = models.IntegerField(default=0)
    average_wait_time = models.FloatField(default=0.0)
    abandoned_calls = models.IntegerField(default=0)

    def __str__(self):
        return f"Call Queue Analytics for {self.organization.name} on {self.date}"


# Service Level Analytics
class ServiceLevel(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="service_level")
    date = models.DateField()
    service_level_percentage = models.FloatField()  # Percentage of calls answered within a target time

    def __str__(self):
        return f"Service Level for {self.organization.name} on {self.date}"


# Conversion Analytics (e.g., for sales or customer support outcomes)
class ConversionAnalytics(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="conversion_analytics")
    date = models.DateField()
    total_calls = models.IntegerField(default=0)
    total_conversions = models.IntegerField(default=0)  # Successful outcomes
    conversion_rate = models.FloatField(default=0.0)

    def __str__(self):
        return f"Conversion Rate for {self.organization.name} on {self.date}"


# Agent Interaction Log (For detailed tracking of AI or agent-based calls)
class AgentInteractionLog(models.Model):
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name="interaction_logs")
    call = models.ForeignKey(Call, on_delete=models.CASCADE, related_name="interaction_logs")
    interaction_start_time = models.DateTimeField()
    interaction_end_time = models.DateTimeField(null=True, blank=True)
    interaction_type = models.CharField(max_length=255)  # e.g., "AI", "Human", "Handoff"
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Interaction log for {self.agent.name} on Call {self.call.id}"


# Detailed Call Analytics
class DetailedCallAnalytics(models.Model):
    call = models.OneToOneField(Call, on_delete=models.CASCADE, related_name="detailed_analytics")
    call_category = models.CharField(max_length=255)  # e.g., "support", "sales"
    resolution_time = models.FloatField(default=0.0)
    follow_up_required = models.BooleanField(default=False)

    def __str__(self):
        return f"Detailed Analytics for Call {self.call.id}"





class LeadGeneration(models.Model):
    # Choices for LeadStatus
    LEAD_STATUS_CHOICES = [
        ('New', 'New'),
        ('Contacted', 'Contacted'),
        ('Qualified', 'Qualified'),
        ('Lost', 'Lost'),
    ]

    LeadID = models.AutoField(primary_key=True)  # Unique identifier for each lead
    FirstName = models.CharField(max_length=50)  # First name of the lead
    LastName = models.CharField(max_length=50)   # Last name of the lead
    Email = models.EmailField(max_length=100)    # Email address of the lead
    PhoneNumber = models.CharField(max_length=15, blank=True, null=True)  # Phone number of the lead
    CompanyName = models.CharField(max_length=100, blank=True, null=True)  # Company name of the lead
    JobTitle = models.CharField(max_length=100, blank=True, null=True)     # Job title of the lead
    LeadSource = models.CharField(max_length=100, blank=True, null=True)   # Source of the lead
    LeadStatus = models.CharField(max_length=50, choices=LEAD_STATUS_CHOICES, default='New')  # Status of the lead
    CreatedAt = models.DateTimeField(auto_now_add=True)  # Timestamp when the lead was created
    UpdatedAt = models.DateTimeField(auto_now=True)      # Timestamp when the lead was last updated

    def __str__(self):
        return f"{self.FirstName} {self.LastName} ({self.Email})"

class OrderConfirmation(models.Model):
    # Choices for PaymentStatus
    PAYMENT_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Failed', 'Failed'),
    ]

    # Choices for OrderStatus
    ORDER_STATUS_CHOICES = [
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    OrderID = models.AutoField(primary_key=True)  # Unique identifier for each order
    LeadID = models.ForeignKey(LeadGeneration, on_delete=models.SET_NULL, null=True)  # Foreign key to LeadGeneration
    OrderDate = models.DateTimeField(auto_now_add=True)  # Date and time when the order was placed
    ProductID = models.IntegerField()  # Foreign key to Product (assuming ProductID is an integer)
    Quantity = models.IntegerField()   # Quantity of the product ordered
    TotalAmount = models.DecimalField(max_digits=10, decimal_places=2)  # Total amount of the order
    PaymentStatus = models.CharField(max_length=50, choices=PAYMENT_STATUS_CHOICES, default='Pending')  # Payment status
    OrderStatus = models.CharField(max_length=50, choices=ORDER_STATUS_CHOICES, default='Processing')  # Order status
    CreatedAt = models.DateTimeField(auto_now_add=True)  # Timestamp when the order was created
    UpdatedAt = models.DateTimeField(auto_now=True)      # Timestamp when the order was last updated

    def __str__(self):
        return f"Order #{self.OrderID} by {self.LeadID} (Status: {self.OrderStatus})"


class UploadedFile(models.Model):
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name