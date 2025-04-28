from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Donation
from .serializers import DonationSerializer




class DonationCreateView(generics.CreateAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]  # Only logged-in users can donate

    def perform_create(self, serializer):
      
        serializer.save(user=self.request.user)  # Automatically assign the logged-in user
 
