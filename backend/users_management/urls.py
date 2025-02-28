from django.urls import path, include
from .views import index, LoginView

urlpatterns = [
    path('',view=LoginView.as_view(), name='login'),
    path('index/', view=index, name='index')
]