from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,generics
from .serializers import OrganizationRegisterSerializer,CampaignSerializer,OrgReviewSerializer ,OrganizationLoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from django.contrib.auth import authenticate
from rest_framework import status as drf_status
from rest_framework import viewsets, permissions

from .models import Campaign, Organization,OrgReview
from rest_framework import serializers
 
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser


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
        serializer = OrganizationLoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            org = Organization.objects.get(contact_email=serializer.validated_data['email'])
            organization_email =serializer.validated_data.get('email')
            refresh = RefreshToken.for_user(org)
            refresh['organization_email'] = organization_email
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'name': org.name,
                'email': org.contact_email,
                'logo_url': serializer.validated_data.get('logo_url')
            })
        return Response(serializer.errors, status=400)
        

class PublicCampaignListView(generics.ListAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [] # Allow any user to access this view

 

    
#campaign viewset       
class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticated]  
    parser_classes = (MultiPartParser, FormParser)

    #for getting the organization email from the token
    # This method extracts the organization email from the JWT token in the request headers.
    def get_organization_email(self):
        auth_header = self.request.headers.get('Authorization')
        if not auth_header:
            return None
        
        token_str = auth_header.split(' ')[1]
        access_token = AccessToken(token_str)
        organiztion_email = access_token.get('organization_email', None)
        return  organiztion_email
    


    #for fetching campaigns
    def get_queryset(self):
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


#for review by organizations
class OrgReviewViewSet(viewsets.ModelViewSet):
    queryset = OrgReview.objects.all().order_by('-created_at')  # Optional: latest first
    serializer_class = OrgReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_organization_email(self):
        
        auth_header = self.request.headers.get('Authorization')
        if not auth_header:
            return None
        
        token_str = auth_header.split(' ')[1]
        access_token = AccessToken(token_str)
        organiztion_email = access_token.get('organization_email', None)
       
        return  organiztion_email
    

    def get_queryset(self):
        """
        Return only the reviews of the authenticated user's organization
        if the user is authenticated. If the user is not authenticated,
        return all reviews (for read-only access).
        """
        if self.request.user.is_authenticated:
            organization_email = self.get_organization_email()
            return OrgReview.objects.filter(organization__contact_email=organization_email)
        return OrgReview.objects.all()  # Allow read-only access f

    def perform_create(self, serializer):
        user = self.request.user

        if not user.is_authenticated:
            raise serializers.ValidationError({"detail": "Authentication required to post a review."})

        try:
            organization = Organization.objects.get(contact_email=self.get_organization_email())
            serializer.save(organization=organization)
        except Organization.DoesNotExist:
            raise serializers.ValidationError({"organization": "Only registered organizations can post reviews."})
        
     