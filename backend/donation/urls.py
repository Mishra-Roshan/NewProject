from django.urls import path
from .views import DonationCreateView, VerifyPaymentView,  UserDonationListView

urlpatterns = [
    path('donations/', DonationCreateView.as_view(), name='donate'),
    path('verify/',  VerifyPaymentView.as_view(), name='verify-payment'),
    path('donation_by_user/',  UserDonationListView.as_view(), name='donation_by_user')
]