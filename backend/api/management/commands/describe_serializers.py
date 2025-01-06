from django.core.management.base import BaseCommand
from django.apps import apps
from rest_framework.serializers import Serializer

class Command(BaseCommand):
    help = "List and describe all serializers in the project"

    def handle(self, *args, **kwargs):
        # Find all serializers in the project
        serializers = {}
        for app_config in apps.get_app_configs():
            try:
                module = __import__(f"api.serializers", fromlist=["*"])
                for name in dir(module):
                    obj = getattr(module, name)
                    if isinstance(obj, type) and issubclass(obj, Serializer) and obj is not Serializer:
                        serializers[name] = obj
            except ModuleNotFoundError:
                continue

        if not serializers:
            self.stdout.write("No serializers found in the project.")
            return

        # Describe each serializer
        for name, serializer in serializers.items():
            self.stdout.write(f"\n{name} ({serializer.__module__}):")
            for field_name, field in serializer().fields.items():
                self.stdout.write(f"  - {field_name}: {field.__class__.__name__}, required={field.required}")
