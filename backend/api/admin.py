from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import User, Call, Message, Subscription, Log
from django.contrib.auth.admin import UserAdmin

admin.site.register(User)
admin.site.register(Call)
admin.site.register(Message)
admin.site.register(Subscription)
admin.site.register(Log)


class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )