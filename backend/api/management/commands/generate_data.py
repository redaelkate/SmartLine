import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker
from api.models import (
    Organization, Admin, Agent, Call, CallTranscript, CallPerformance,
    AIInteractionMetrics, CustomerSatisfaction, AgentPerformance, CallTrends,
    CallQueue, ServiceLevel, ConversionAnalytics, AgentInteractionLog,
    DetailedCallAnalytics, LeadGeneration, OrderConfirmation
)

fake = Faker()

class Command(BaseCommand):
    help = 'Generates dummy data for all models'
    


        # Generate Leads
    for _ in range(10):  # Create 10 leads
            lead = LeadGeneration.objects.create(
                FirstName=fake.first_name(),
                LastName=fake.last_name(),
                Email=fake.email(),
                PhoneNumber=fake.phone_number(),
                CompanyName=fake.company(),
                JobTitle=fake.job(),
                LeadSource=random.choice(['Website', 'Referral', 'Social Media']),
                LeadStatus=random.choice(['New', 'Contacted', 'Qualified']),
            )
            self.stdout.write(f"Created Lead: {lead.FirstName} {lead.LastName}")

            # Generate Orders for each Lead
            for _ in range(random.randint(1, 3)):  # Create 1-3 orders per lead
                order = OrderConfirmation.objects.create(
                    LeadID=lead,
                    ProductID=random.randint(1, 100),  # Random product ID
                    Quantity=random.randint(1, 5),     # Random quantity
                    TotalAmount=round(random.uniform(50, 500), 2),  # Random total amount
                    PaymentStatus=random.choice(['Pending', 'Paid', 'Failed']),
                    OrderStatus=random.choice(['Processing', 'Shipped', 'Delivered']),
                )
                self.stdout.write(f"Created Order: {order.OrderID} for Lead {lead.LeadID}")

    def handle(self, *args, **kwargs):
        self.stdout.write("Generating dummy data...")

        # Create Organizations
        organizations = []
        for _ in range(10):
            org = Organization.objects.create(
                name=fake.company(),
                subscription_plan=random.choice(['Basic', 'Premium', 'Enterprise']),
                created_at=timezone.now(),
                updated_at=timezone.now()
            )
            organizations.append(org)
        self.stdout.write("Created Organizations")

        # Create Admins
        for org in organizations:
            for _ in range(3):
                Admin.objects.create(
                    organization=org,
                    email=fake.email(),
                    password=fake.password(),
                    phone=fake.phone_number(),
                    created_at=timezone.now(),
                    updated_at=timezone.now()
                )
        self.stdout.write("Created Admins")

        # Create Agents
        agents = []
        for org in organizations:
            for _ in range(random.randint(1, 10)):
                agent = Agent.objects.create(
                    organization=org,
                    name=fake.name(),
                    model=random.choice(['Model A', 'Model B', 'Model C']),
                    status=random.choice(['Active', 'Inactive']),
                    created_at=timezone.now(),
                    updated_at=timezone.now()
                )
                agents.append(agent)
        self.stdout.write("Created Agents")

        # Create Calls
        calls = []
        for agent in agents:
            for _ in range(random.randint(1,10)):
                call = Call.objects.create(
                    organization=agent.organization,
                    agent=agent,
                    start_time=timezone.now(),
                    end_time=timezone.now(),
                    call_type=random.choice(['Inbound', 'Outbound']),
                    status=random.choice(['Completed', 'Missed', 'Ongoing']),
                    duration_seconds=random.randint(60, 3600)
                )
                calls.append(call)
        self.stdout.write("Created Calls")

        # Create CallTranscripts
        for call in calls:
            CallTranscript.objects.create(
                call=call,
                transcript=fake.text(),
                created_at=timezone.now()
            )
        self.stdout.write("Created CallTranscripts")

        # Create CallPerformance
        for agent in agents:
            CallPerformance.objects.create(
                organization=agent.organization,
                agent=agent,
                date=fake.date_this_year(),
                total_calls=random.randint(10, 100),
                completed_calls=random.randint(5, 50),
                missed_calls=random.randint(1, 20),
                average_call_duration=random.uniform(60.0, 600.0)
            )
        self.stdout.write("Created CallPerformance")

        # Create AIInteractionMetrics
        for agent in agents:
            AIInteractionMetrics.objects.create(
                agent=agent,
                date=fake.date_this_year(),
                ai_calls_handled=random.randint(10, 100),
                ai_success_rate=random.uniform(0.5, 1.0),
                average_response_time=random.uniform(1.0, 10.0),
                handoff_count=random.randint(1, 10)
            )
        self.stdout.write("Created AIInteractionMetrics")

        # Create CustomerSatisfaction
        for call in calls:
            CustomerSatisfaction.objects.create(
                call=call,
                satisfaction_score=random.randint(1, 5),
                sentiment_score=random.uniform(-1.0, 1.0),
                feedback_text=fake.text(),
                created_at=timezone.now()
            )
        self.stdout.write("Created CustomerSatisfaction")

        # Create AgentPerformance
        for agent in agents:
            AgentPerformance.objects.create(
                agent=agent,
                date=fake.date_this_year(),
                calls_handled=random.randint(10, 100),
                average_duration=random.uniform(60.0, 600.0),
                satisfaction_score_avg=random.uniform(1.0, 5.0),
                response_time_avg=random.uniform(1.0, 10.0)
            )
        self.stdout.write("Created AgentPerformance")

        # Create CallTrends
        for org in organizations:
            CallTrends.objects.create(
                organization=org,
                date=fake.date_this_year(),
                peak_hours=fake.time(),
                total_calls=random.randint(100, 1000),
                inbound_calls=random.randint(50, 500),
                outbound_calls=random.randint(50, 500)
            )
        self.stdout.write("Created CallTrends")

        # Create CallQueue
        for org in organizations:
            CallQueue.objects.create(
                organization=org,
                date=fake.date_this_year(),
                max_queue_length=random.randint(5, 20),
                average_queue_length=random.randint(1, 10),
                average_wait_time=random.uniform(10.0, 300.0),
                abandoned_calls=random.randint(1, 10)
            )
        self.stdout.write("Created CallQueue")

        # Create ServiceLevel
        for org in organizations:
            ServiceLevel.objects.create(
                organization=org,
                date=fake.date_this_year(),
                service_level_percentage=random.uniform(80.0, 100.0)
            )
        self.stdout.write("Created ServiceLevel")

        # Create ConversionAnalytics
        for org in organizations:
            ConversionAnalytics.objects.create(
                organization=org,
                date=fake.date_this_year(),
                total_calls=random.randint(100, 1000),
                total_conversions=random.randint(10, 100),
                conversion_rate=random.uniform(0.1, 0.5)
            )
        self.stdout.write("Created ConversionAnalytics")

        # Create AgentInteractionLog
        for agent in agents:
            for call in calls:
                AgentInteractionLog.objects.create(
                    agent=agent,
                    call=call,
                    interaction_start_time=timezone.now(),
                    interaction_end_time=timezone.now(),
                    interaction_type=random.choice(['Call', 'Chat', 'Email']),
                    notes=fake.text()
                )
        self.stdout.write("Created AgentInteractionLog")

        # Create DetailedCallAnalytics
        for call in calls:
            DetailedCallAnalytics.objects.create(
                call=call,
                call_category=random.choice(['Sales', 'Support', 'Billing']),
                resolution_time=random.uniform(60.0, 600.0),
                follow_up_required=random.choice([True, False])
            )
        self.stdout.write("Created DetailedCallAnalytics")

        self.stdout.write("Dummy data generation complete!")