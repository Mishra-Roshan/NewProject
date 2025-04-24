from django.urls import path
from .views import RegisterUser
from .views import LoginView

urlpatterns = [
    path('register/', RegisterUser.as_view(), name='register_user'),
    path('login/', LoginView.as_view(), name='login'),
]