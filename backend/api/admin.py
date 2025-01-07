from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *
from django.apps import apps
from django.contrib.admin.sites import AlreadyRegistered


app = apps.get_app_config('api')
models = app.get_models()

for model in models:
    try:
        admin.site.register(model)
    except AlreadyRegistered:
        pass


class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )