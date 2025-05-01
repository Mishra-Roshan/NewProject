from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer,  PasswordResetSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response


class RegisterUser(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")  # this is the email
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        

#otp sending 
from django.contrib.auth.models import User
from django.core.cache import cache
from django.core.mail import send_mail
from django.contrib.auth.models import User
import random
from django.contrib.auth.hashers import make_password
from organization.models import Organization

class SendOTPView(APIView):
    def post(self, request):
        print(request.data)
        user_type = request.data.get('user')
        email = request.data.get('email')
        try:
            if user_type == 'donor':
                user = User.objects.get(email=email)
            else:
                org = Organization.objects.get(contact_email = email)
        except  (User.DoesNotExist ,Organization.DoesNotExist):
            return Response({"message": "If the email exists, OTP will be sent."}, status=200)

        otp = f"{random.randint(100000, 999999)}"
        
        # Store OTP in cache for 10 minutes
        cache.set(f"otp_{email}", otp, timeout=600)  # 600 seconds = 10 minutes

        # Send OTP to user's email
        send_mail(
            "Your OTP for Password Reset",
            f"Your OTP is: {otp}",
            "roshanmishra200407@gmail.com",  # Use your actual sender email
            [email],
            fail_silently=False,
        )
        return Response({"message": "OTP sent to your email."})





class VerifyOTPAndResetPasswordView(APIView):
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        email = serializer.validated_data.get('email')
        otp = serializer.validated_data.get('otp')
        password = serializer.validated_data.get('password')
        user_type = request.data.get('user')  # Add this to distinguish

        cached_otp = cache.get(f"otp_{email}")
        if not cached_otp:
            return Response({"message": "OTP expired or not found."}, status=400)
        if cached_otp != otp:
            return Response({"message": "Invalid OTP."}, status=400)

        try:
            if user_type == 'donor':
                user = User.objects.get(email=email)
            else:
                user = Organization.objects.get(contact_email=email)

            user.set_password(password)
            user.save()
            cache.delete(f"otp_{email}")
            return Response({"message": "Password reset successful."})
        except (User.DoesNotExist, Organization.DoesNotExist):
            return Response({"message": "User not found."}, status=400)
