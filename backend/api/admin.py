from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

admin.site.register(Organization)
admin.site.register(Admin)
admin.site.register(Agent)
admin.site.register(Call)
admin.site.register(CallTranscript)
admin.site.register(CallTrends)
admin.site.register(AgentPerformance)
admin.site.register(CustomerSatisfaction)
admin.site.register(AIInteractionMetrics)
admin.site.register(CallPerformance)
admin.site.register(DetailedCallAnalytics)
admin.site.register(AgentInteractionLog)
admin.site.register(ConversionAnalytics)
admin.site.register(ServiceLevel)   
admin.site.register(CallQueue)
admin.site.register(UploadedFile)


class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )