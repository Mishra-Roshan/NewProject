from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Donation
from .serializers import DonationSerializer
from django.contrib.auth.models import User 
from django.contrib.auth import get_user_model 



class DonationCreateView(generics.CreateAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]  # Only logged-in users can donate

    def perform_create(self, serializer):
        # print(get_user_model().objects.get(username=self.request.user))
        # user = User.objects.get(username=self.request.user)
        # print(self.request.user)
        # print(vars(self.request.user)) 
        # # Assign the user who made the donation automatically
        # # print(user)
        serializer.save(user=self.request.user)  # Automatically assign the logged-in user
 
