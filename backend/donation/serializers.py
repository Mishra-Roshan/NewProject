# serializers.py
from rest_framework import serializers
from .models import Donation

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ['id', 'campaign', 'user', 'amount', 'donated_at', 'status', 'transaction_id']
        read_only_fields = ['id', 'donated_at', 'user', 'status', 'transaction_id']
