from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import OrganizationRegisterSerializer,CampaignSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework import viewsets, permissions
from rest_framework import status as drf_status
from .models import Campaign, Organization
from rest_framework import serializers


class RegisterUser(APIView):
    def post(self, request):
        serializer = OrganizationRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Organization registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")  # this is the email
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        
class CampaignViewSet(viewsets.ModelViewSet):
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticated]  

    def get_queryset(self):
        contact_email = self.request.query_params.get('contact_email')
        if contact_email:
            return Campaign.objects.filter(organization__contact_email=contact_email)
        return Campaign.objects.all()

    def perform_create(self, serializer):
        user = self.request.user

        if not user.is_authenticated:
            raise serializers.ValidationError({"detail": "Authentication required to create a campaign."})

        try:
            organization = Organization.objects.get(contact_email=user.email)
            serializer.save(organization=organization)
        except Organization.DoesNotExist:
            raise serializers.ValidationError({"organization": "No matching organization for this user."})

       
