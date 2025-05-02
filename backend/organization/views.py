from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,generics
from .serializers import OrganizationRegisterSerializer,CampaignSerializer
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from django.contrib.auth import authenticate
from rest_framework import status as drf_status
from rest_framework import viewsets, permissions

from .models import Campaign, Organization
from rest_framework import serializers


#register view for organization
# This view handles the registration of organizations. It uses the OrganizationRegisterSerializer to validate and save the organization data.
class RegisterUser(APIView):
    def post(self, request):
        serializer = OrganizationRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Organization registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

#login view for organization
#created a custom login view for organization using email and password
# This view handles the login of organizations. It authenticates the user using the email and password, and if successful, it generates a JWT token.
class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")  
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)
        print(user)
    
        if user:
            try:
                organization = Organization.objects.get(contact_email=email)
            except Organization.DoesNotExist:
                return Response({'detail': 'Organization not found for this email.'}, status=status.HTTP_404_NOT_FOUND)
            
            
            refresh = RefreshToken.for_user(user)
            refresh['organization_email'] = email
          

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'organization_email': email,
            }, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        

class PublicCampaignListView(generics.ListAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [] # Allow any user to access this view

 

    
#campaign viewset       
class CampaignViewSet(viewsets.ModelViewSet):
  
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticated]  

    #for getting the organization email from the token
    # This method extracts the organization email from the JWT token in the request headers.
    def get_organization_email(self):
        print("Running")
        auth_header = self.request.headers.get('Authorization')
        if not auth_header:
            return None
        
        token_str = auth_header.split(' ')[1]
        access_token = AccessToken(token_str)
        organiztion_email = access_token.get('organization_email', None)
        print(organiztion_email)
        return  organiztion_email
    


    #for fetching campaigns
    def get_queryset(self):
        print("Running")
        contact_email = self.get_organization_email()
     
        if contact_email:
            return Campaign.objects.filter(organization__contact_email=contact_email)
        return Campaign.objects.all()
    


    #for creating campaigns
    def perform_create(self, serializer):
        user = self.request.user
        
        if not user.is_authenticated:
            raise serializers.ValidationError({"detail": "Authentication required to create a campaign."})

        try:
            organization = Organization.objects.get(contact_email= self.get_organization_email())
            serializer.save(organization=organization)
        except Organization.DoesNotExist:
            raise serializers.ValidationError({"organization": "No matching organization for this user."})
        


    #for updating campaigns
    def perform_update(self, serializer):
        user = self.request.user

        if not user.is_authenticated:
            raise serializers.ValidationError({"detail": "Authentication required to update a campaign."})

        try:
            organization = Organization.objects.get(contact_email=self.get_organization_email())
        except Organization.DoesNotExist:
            raise serializers.ValidationError({"organization": "No matching organization for this user."})

        # Only allow updating if the campaign belongs to the organization
        if serializer.instance.organization != organization:
            raise serializers.ValidationError({"detail": "You do not have permission to update this campaign."})

        serializer.save()







        



       
