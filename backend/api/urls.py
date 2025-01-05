from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import protected_view


urlpatterns = [
    path('token/', obtain_auth_token, name='api_token_auth'),
]
