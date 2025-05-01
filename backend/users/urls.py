from django.urls import path
from . import views
from .views import SendOTPView, VerifyOTPAndResetPasswordView

urlpatterns = [
    path('user-register/', views.RegisterUser.as_view()),
    path('user-login/', views.LoginView.as_view()),
    path('request-otp/', SendOTPView.as_view()),
    path('verify-otp-reset/', VerifyOTPAndResetPasswordView.as_view()),
    
]