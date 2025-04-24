from django.urls import path
from . import views

urlpatterns = [
    path('user-register/', views.RegisterUser.as_view()),
    path('user-login/', views.LoginView.as_view()),
]