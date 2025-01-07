from django.core.management.base import BaseCommand
from faker import Faker
import random
from datetime import datetime, timedelta
from django.utils import timezone
from api.models import (
    Organization, Admin, Client, Agent, Call, CallTranscript, CallPerformance,
    AIInteractionMetrics, CustomerSatisfaction, AgentPerformance, CallTrends,
    CallQueue, ServiceLevel, ConversionAnalytics, AgentInteractionLog,
    DetailedCallAnalytics, LeadGeneration, OrderConfirmation, UploadedFile
)

from io import StringIO
import csv
from django.core.files.base import ContentFile
fake = Faker()

class Command(BaseCommand):
    help = 'Generates fake data for all models'

    def handle(self, *args, **kwargs):
        self.generate_organizations()
        self.generate_admins()
        self.generate_clients()
        self.generate_agents()
        self.generate_calls()
        self.generate_call_transcripts()
        self.generate_call_performance()
        self.generate_ai_interaction_metrics()
        self.generate_customer_satisfaction()
        self.generate_agent_performance()
        self.generate_call_trends()
        self.generate_call_queue()
        self.generate_service_level()
        self.generate_conversion_analytics()
        self.generate_agent_interaction_logs()
        self.generate_detailed_call_analytics()
        self.generate_lead_generation()
        self.generate_order_confirmations()
        self.generate_uploaded_files()

    def generate_organizations(self):
        for _ in range(5):
            Organization.objects.create(
                name=fake.company(),
                subscription_plan=random.choice(['basic', 'pro', 'enterprise'])
            )
        self.stdout.write(self.style.SUCCESS('Organizations created'))

    def generate_admins(self):
        organizations = Organization.objects.all()
        for org in organizations:
            for _ in range(2):
                Admin.objects.create(
                    organization=org,
                    email=fake.email(),
                    password=fake.password(),
                    phone=fake.phone_number()
                )
        self.stdout.write(self.style.SUCCESS('Admins created'))

    def generate_clients(self):
        organizations = Organization.objects.all()
        for org in organizations:
            for _ in range(10):
                Client.objects.create(
                    name=fake.name(),
                    phone_number=fake.phone_number(),
                    email=fake.email(),
                    organization=org
                )
        self.stdout.write(self.style.SUCCESS('Clients created'))

    def generate_agents(self):
        organizations = Organization.objects.all()
        for org in organizations:
            for _ in range(3):
                Agent.objects.create(
                    organization=org,
                    name=fake.name(),
                    model=random.choice(['GPT-4', 'Custom']),
                    status=random.choice(['active', 'inactive'])
                )
        self.stdout.write(self.style.SUCCESS('Agents created'))

    def generate_calls(self):
        organizations = Organization.objects.all()
        agents = Agent.objects.all()
        clients = Client.objects.all()
        for org in organizations:
            for _ in range(20):
                Call.objects.create(
                    organization=org,
                    agent=random.choice(agents),
                    client=random.choice(clients),
                    start_time=timezone.now() - timedelta(days=random.randint(1, 30)),
                    end_time=timezone.now() - timedelta(days=random.randint(1, 29)),
                    call_type=random.choice(['inbound', 'outbound']),
                    status=random.choice(['completed', 'missed', 'dropped']),
                    duration_seconds=random.randint(60, 3600)
                )
        self.stdout.write(self.style.SUCCESS('Calls created'))

    def generate_call_transcripts(self):
        calls = Call.objects.all()
        for call in calls:
            CallTranscript.objects.create(
                call=call,
                transcript=fake.text()
            )
        self.stdout.write(self.style.SUCCESS('Call transcripts created'))

    def generate_call_performance(self):
        organizations = Organization.objects.all()
        agents = Agent.objects.all()
        for org in organizations:
            for _ in range(5):
                CallPerformance.objects.create(
                    organization=org,
                    agent=random.choice(agents),
                    date=fake.date_this_year(),
                    total_calls=random.randint(10, 100),
                    completed_calls=random.randint(5, 50),
                    missed_calls=random.randint(0, 10),
                    average_call_duration=random.uniform(60, 600)
                )
        self.stdout.write(self.style.SUCCESS('Call performance created'))

    def generate_ai_interaction_metrics(self):
        agents = Agent.objects.all()
        for agent in agents:
            for _ in range(5):
                AIInteractionMetrics.objects.create(
                    agent=agent,
                    date=fake.date_this_year(),
                    ai_calls_handled=random.randint(10, 100),
                    ai_success_rate=random.uniform(0, 100),
                    average_response_time=random.uniform(1, 10),
                    handoff_count=random.randint(0, 10)
                )
        self.stdout.write(self.style.SUCCESS('AI interaction metrics created'))

    def generate_customer_satisfaction(self):
        calls = Call.objects.all()
        for call in calls:
            CustomerSatisfaction.objects.create(
                call=call,
                satisfaction_score=random.randint(1, 5),
                sentiment_score=random.uniform(-1, 1),
                feedback_text=fake.text()
            )
        self.stdout.write(self.style.SUCCESS('Customer satisfaction created'))

    def generate_agent_performance(self):
        agents = Agent.objects.all()
        for agent in agents:
            for _ in range(5):
                AgentPerformance.objects.create(
                    agent=agent,
                    date=fake.date_this_year(),
                    calls_handled=random.randint(10, 100),
                    average_duration=random.uniform(60, 600),
                    satisfaction_score_avg=random.uniform(1, 5),
                    response_time_avg=random.uniform(1, 10)
                )
        self.stdout.write(self.style.SUCCESS('Agent performance created'))

    def generate_call_trends(self):
        organizations = Organization.objects.all()
        for org in organizations:
            for _ in range(5):
                CallTrends.objects.create(
                    organization=org,
                    date=fake.date_this_year(),
                    peak_hours=f"{random.randint(0, 23)}-{random.randint(0, 23)}",
                    total_calls=random.randint(10, 100),
                    inbound_calls=random.randint(5, 50),
                    outbound_calls=random.randint(5, 50)
                )
        self.stdout.write(self.style.SUCCESS('Call trends created'))

    def generate_call_queue(self):
        organizations = Organization.objects.all()
        for org in organizations:
            for _ in range(5):
                CallQueue.objects.create(
                    organization=org,
                    date=fake.date_this_year(),
                    max_queue_length=random.randint(1, 10),
                    average_queue_length=random.randint(1, 5),
                    average_wait_time=random.uniform(1, 10),
                    abandoned_calls=random.randint(0, 5)
                )
        self.stdout.write(self.style.SUCCESS('Call queue created'))

    def generate_service_level(self):
        organizations = Organization.objects.all()
        for org in organizations:
            for _ in range(5):
                ServiceLevel.objects.create(
                    organization=org,
                    date=fake.date_this_year(),
                    service_level_percentage=random.uniform(80, 100)
                )
        self.stdout.write(self.style.SUCCESS('Service level created'))

    def generate_conversion_analytics(self):
        organizations = Organization.objects.all()
        for org in organizations:
            for _ in range(5):
                ConversionAnalytics.objects.create(
                    organization=org,
                    date=fake.date_this_year(),
                    total_calls=random.randint(10, 100),
                    total_conversions=random.randint(5, 50),
                    conversion_rate=random.uniform(0, 100)
                )
        self.stdout.write(self.style.SUCCESS('Conversion analytics created'))

    def generate_agent_interaction_logs(self):
        agents = Agent.objects.all()
        calls = Call.objects.all()
        for agent in agents:
            for call in calls:
                AgentInteractionLog.objects.create(
                    agent=agent,
                    call=call,
                    interaction_start_time=timezone.now() - timedelta(days=random.randint(1, 30)),
                    interaction_end_time=timezone.now() - timedelta(days=random.randint(1, 29)),
                    interaction_type=random.choice(['AI', 'Human', 'Handoff']),
                    notes=fake.text()
                )
        self.stdout.write(self.style.SUCCESS('Agent interaction logs created'))

    def generate_detailed_call_analytics(self):
        calls = Call.objects.all()
        for call in calls:
            DetailedCallAnalytics.objects.create(
                call=call,
                call_category=random.choice(['support', 'sales']),
                resolution_time=random.uniform(60, 600),
                follow_up_required=random.choice([True, False])
            )
        self.stdout.write(self.style.SUCCESS('Detailed call analytics created'))

    def generate_lead_generation(self):
        for _ in range(20):
            LeadGeneration.objects.create(
                FirstName=fake.first_name(),
                LastName=fake.last_name(),
                Email=fake.email(),
                PhoneNumber=fake.phone_number(),
                CompanyName=fake.company(),
                JobTitle=fake.job(),
                LeadSource=random.choice(['Website', 'Referral', 'Social Media']),
                LeadStatus=random.choice(['New', 'Contacted', 'Qualified', 'Lost'])
            )
        self.stdout.write(self.style.SUCCESS('Lead generation created'))

    def generate_order_confirmations(self):
        leads = LeadGeneration.objects.all()
        for lead in leads:
            for _ in range(2):
                OrderConfirmation.objects.create(
                    LeadID=lead,
                    ProductID=random.randint(1, 100),
                    Quantity=random.randint(1, 10),
                    TotalAmount=random.uniform(10, 1000),
                    PaymentStatus=random.choice(['Pending', 'Paid', 'Failed']),
                    OrderStatus=random.choice(['Processing', 'Shipped', 'Delivered', 'Cancelled'])
                )
        self.stdout.write(self.style.SUCCESS('Order confirmations created'))

    def generate_uploaded_files(self):
    # Generate CSV files for leads
        for _ in range(5):  # Generate 5 CSV files for leads
            csv_buffer = StringIO()
            csv_writer = csv.writer(csv_buffer)
            # Write header row
            csv_writer.writerow([
                'first_name', 'last_name', 'email', 'phone_number', 'company_name',
                'job_title', 'lead_source', 'lead_status'
            ])
            # Write 10 rows of fake lead data
            for _ in range(10):
                csv_writer.writerow([
                    fake.first_name(),  # first_name
                    fake.last_name(),   # last_name
                    fake.email(),       # email
                    fake.phone_number(),# phone_number
                    fake.company() if random.choice([True, False]) else '',  # company_name (optional)
                    fake.job() if random.choice([True, False]) else '',      # job_title (optional)
                    random.choice(['Website', 'Referral', 'Social Media']),  # lead_source
                    random.choice(['New', 'Contacted', 'Qualified', 'Lost']) # lead_status
                ])
            # Save the CSV file
            csv_file = ContentFile(csv_buffer.getvalue().encode('utf-8'), name=f'leads_{fake.uuid4()}.csv')
            UploadedFile.objects.create(file=csv_file)

    # Generate CSV files for orders
        for _ in range(5):  # Generate 5 CSV files for orders
            csv_buffer = StringIO()
            csv_writer = csv.writer(csv_buffer)
            # Write header row
            csv_writer.writerow([
                'Lead_id', 'product_id', 'quantity', 'total_amount', 'payment_status', 'order_status'
            ])
            # Write rows of fake order data
            leads = LeadGeneration.objects.all()
            for lead in leads:
                csv_writer.writerow([
                    lead.LeadID,  # Lead_id
                    random.randint(1, 100),  # product_id
                    random.randint(1, 10),   # quantity
                    round(random.uniform(10, 1000), 2),  # total_amount
                    random.choice(['Paid', 'Pending', 'Failed']),  # payment_status
                    random.choice(['Processing', 'Shipped', 'Delivered', 'Cancelled'])  # order_status
                ])
            # Save the CSV file
            csv_file = ContentFile(csv_buffer.getvalue().encode('utf-8'), name=f'orders_{fake.uuid4()}.csv')
            UploadedFile.objects.create(file=csv_file)

        self.stdout.write(self.style.SUCCESS('Uploaded CSV files for leads and orders created'))