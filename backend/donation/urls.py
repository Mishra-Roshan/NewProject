from django.urls import path
from .views import DonationCreateView, VerifyPaymentView

urlpatterns = [
    path('donations/', DonationCreateView.as_view(), name='donate'),
    path('verify/',  VerifyPaymentView.as_view(), name='verify-payment') 
]