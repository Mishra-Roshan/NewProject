# views.py
import razorpay
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status as http_status, permissions, generics
from .models import Donation
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import DonationSerializer
from rest_framework.exceptions import ValidationError
from django.db.models import F
from django.db import transaction

# Razorpay client setup
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


class DonationCreateView(generics.CreateAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def validate_campaign_amount(self, campaign, donation_amount):
        if campaign.amount_gathered >= campaign.goal_amount:
            raise ValidationError({
                "campaign": "This campaign has already reached its goal amount."
            })
        
        if campaign.amount_gathered + donation_amount > campaign.goal_amount:
            remaining = campaign.goal_amount - campaign.amount_gathered
            raise ValidationError({
                "amount": f"Maximum donation amount available is {remaining:.2f}"
            })

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get campaign and validate amount
        campaign = serializer.validated_data['campaign']
        donation_amount = serializer.validated_data['amount']
        self.validate_campaign_amount(campaign, donation_amount)
        
        # Create donation
        donation = serializer.save(user=request.user)
        # Create Razorpay Order
         # Create Razorpay Order
        order_data = {
            'amount': int(donation.amount * 100),
            'currency': 'INR',
            'receipt': f'donation_{donation.id}',
            'payment_capture': 1
        }

        try:
            razorpay_order = razorpay_client.order.create(data=order_data)
            donation.transaction_id = razorpay_order['id']
            donation.save()

            return Response({
                "order_id": razorpay_order['id'],
                "razorpay_key": settings.RAZORPAY_KEY_ID,
                "amount": razorpay_order['amount'],
                "currency": razorpay_order['currency'],
                "donation_id": donation.id
            }, status=http_status.HTTP_201_CREATED)
        except Exception as e:
            # Rollback donation if Razorpay order creation fails
            donation.delete()
            raise ValidationError({
                "payment": "Failed to create payment order. Please try again."
            })




class VerifyPaymentView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        try:
            razorpay_client.utility.verify_payment_signature({
                'razorpay_order_id': data['razorpay_order_id'],
                'razorpay_payment_id': data['razorpay_payment_id'],
                'razorpay_signature': data['razorpay_signature']
            })

            donation = Donation.objects.get(
                id=data['donation_id'],
                transaction_id=data['razorpay_order_id']
            )

            if donation.status != 'paid':  # Avoid double counting
                donation.status = 'paid'.capitalize()
                donation.save()

                # Update the campaign's gathered amount
                campaign = donation.campaign
                campaign.amount_gathered += donation.amount
                campaign.save()

            return Response({
                'message': 'Payment verified successfully.',
                'receipt': {
                    'amount': donation.amount,
                    'campaign_id': campaign.id,
                    'campaign_name': campaign.title,
                    'donor_name': donation.user.username if donation.user else "Anonymous",
                    'order_id': data['razorpay_order_id'],
                    'payment_id': data['razorpay_payment_id'],
                    'status': donation.status,
                    'date': donation.donated_at.strftime("%Y-%m-%d %H:%M:%S")
                }
            })

        except razorpay.errors.SignatureVerificationError:
            return Response({'error': 'Payment verification failed.'}, status=status.HTTP_400_BAD_REQUEST)

        except Donation.DoesNotExist:
            return Response({'error': 'Donation record not found.'}, status=status.HTTP_404_NOT_FOUND)
        

#for fetching donation only for the particular user
 