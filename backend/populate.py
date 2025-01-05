from faker import Faker
import random
from api.models import Organization, Admin, Agent, Call, CallTranscript, CallPerformance, AIInteractionMetrics, CustomerSatisfaction, AgentPerformance, CallTrends, CallQueue, ServiceLevel, ConversionAnalytics, AgentInteractionLog, DetailedCallAnalytics

fake = Faker()

# Create some organizations
organizations = []
for _ in range(5):  # Create 5 organizations as an example
    org = Organization.objects.create(
        name=f"Test Organization {fake.unique.company()}",
        subscription_plan=random.choice([Organization.BASIC, Organization.PRO, Organization.ENTERPRISE]),
    )
    organizations.append(org)

# Create some admins
admins = []
for org in organizations:
    admin = Admin.objects.create(
        organization=org,
        username=fake.user_name(),
        password=fake.password(),
            # Or use a random choice based on your model choices
    )
    admins.append(admin)

# Create some agents
agents = []
for org in organizations:
    agent = Agent.objects.create(
        organization=org,
        name=fake.name(),
        model=fake.word(),
        status=random.choice([Agent.ACTIVE, Agent.INACTIVE]),
    )
    agents.append(agent)

# Create some calls
calls = []
for agent in agents:
    for _ in range(10):  # Create 10 calls per agent
        call = Call.objects.create(
            agent=agent,
            customer_name=fake.name(),
            duration=fake.random_int(min=60, max=3600),
            call_type=random.choice([Call.INBOUND, Call.OUTBOUND]),
            status=random.choice([Call.COMPLETED, Call.PENDING, Call.FAILED]),
            call_time=fake.date_time_this_year(),
        )
        calls.append(call)

# Create call transcripts
for call in calls:
    CallTranscript.objects.create(
        call=call,
        transcript=fake.text(),
    )

# Create call performance metrics
for call in calls:
    CallPerformance.objects.create(
        call=call,
        performance_score=fake.random_int(min=1, max=100),
        average_response_time=fake.random_int(min=1, max=30),
        customer_satisfaction_score=fake.random_int(min=1, max=5),
    )

# Create AI interaction metrics
for call in calls:
    AIInteractionMetrics.objects.create(
        call=call,
        ai_accuracy=fake.random_int(min=1, max=100),
        ai_response_time=fake.random_int(min=1, max=30),
    )

# Create customer satisfaction records
for call in calls:
    CustomerSatisfaction.objects.create(
        call=call,
        satisfaction_score=fake.random_int(min=1, max=5),
        feedback=fake.text(),
    )

# Create agent performance records
for agent in agents:
    AgentPerformance.objects.create(
        agent=agent,
        performance_score=fake.random_int(min=1, max=100),
        resolution_time=fake.random_int(min=1, max=60),
    )

# Create call trends
for agent in agents:
    CallTrends.objects.create(
        agent=agent,
        total_calls=fake.random_int(min=1, max=50),
        average_call_duration=fake.random_int(min=60, max=3600),
    )

# Create revenue records
for org in organizations:
    Revenue.objects.create(
        organization=org,
        amount=fake.random_int(min=1000, max=100000),
        period=fake.date_this_year(),
    )

# Create call queues
for org in organizations:
    CallQueue.objects.create(
        organization=org,
        queue_name=fake.word(),
        average_wait_time=fake.random_int(min=1, max=60),
    )

# Create service level records
for org in organizations:
    ServiceLevel.objects.create(
        organization=org,
        service_level=fake.random_int(min=80, max=100),  # Percentage
    )

# Create conversion analytics
for org in organizations:
    ConversionAnalytics.objects.create(
        organization=org,
        conversion_rate=fake.random_int(min=1, max=100),
        total_calls=fake.random_int(min=100, max=1000),
    )

# Create agent interaction logs
for agent in agents:
    AgentInteractionLog.objects.create(
        agent=agent,
        interaction_log=fake.text(),
        date=fake.date_this_year(),
    )

# Create detailed call analytics
for call in calls:
    DetailedCallAnalytics.objects.create(
        call=call,
        call_type=random.choice([DetailedCallAnalytics.INBOUND, DetailedCallAnalytics.OUTBOUND]),
        call_duration=fake.random_int(min=60, max=3600),
        wait_time=fake.random_int(min=1, max=60),
        resolution_time=fake.random_int(min=1, max=60),
    )

print("Dummy data created successfully!")
