from rest_framework import serializers
from .models import Donation

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ['id', 'campaign', 'user', 'amount', 'donated_at']
        read_only_fields = ['id', 'donated_at','user']
        extra_kwargs = {
            'campaign': {'required': True},
            'user': {'required': False},  # User will be set automatically
            'amount': {'required': True, 'min_value': 1},  # Ensure amount is greater than 0
        }   

   