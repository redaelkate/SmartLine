from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
from django.db import models





class User(models.Model):
    ROLES = [
        ('admin', 'Admin'),
        ('agent', 'Agent'),
        ('customer', 'Customer'),
    ]
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=10, choices=ROLES)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Call(models.Model):
    STATUSES = [
        ('completed', 'Completed'),
        ('missed', 'Missed'),
        ('ongoing', 'Ongoing'),
    ]
    user = models.ForeignKey(User, related_name='calls', on_delete=models.CASCADE)
    agent = models.ForeignKey(User, related_name='assigned_calls', on_delete=models.SET_NULL, null=True, blank=True)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    call_status = models.CharField(max_length=10, choices=STATUSES)
    recording_url = models.URLField(null=True, blank=True)

class Message(models.Model):
    SENDERS = [
        ('agent', 'Agent'),
        ('customer', 'Customer'),
        ('AI', 'AI'),
    ]
    call = models.ForeignKey(Call, related_name='messages', on_delete=models.CASCADE)
    sender = models.CharField(max_length=10, choices=SENDERS)
    message_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Subscription(models.Model):
    STATUSES = [
        ('paid', 'Paid'),
        ('pending', 'Pending'),
    ]
    user = models.ForeignKey(User, related_name='subscriptions', on_delete=models.CASCADE)
    plan_type = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()
    payment_status = models.CharField(max_length=10, choices=STATUSES)

class Log(models.Model):
    event_type = models.CharField(max_length=50)
    user = models.ForeignKey(User, related_name='logs', on_delete=models.SET_NULL, null=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
