# serializers.py
from rest_framework import serializers
from .models import Donation
from organization.models import Campaign
from django.core.exceptions import ValidationError

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ['id', 'campaign', 'user', 'amount', 'donated_at', 'status', 'transaction_id']
        read_only_fields = ['id', 'donated_at', 'user', 'status', 'transaction_id']
    
    def validate(self, data):
        campaign = data.get('campaign')
        amount = data.get('amount')

        if campaign:
            # Check if campaign has reached its goal
            if campaign.amount_gathered >= campaign.goal_amount:
                raise serializers.ValidationError({
                    "campaign": "This campaign has already reached its goal amount. Cannot accept more donations."
                })
            
            # Check if new donation would exceed goal
            if campaign.amount_gathered + amount > campaign.goal_amount:
                remaining = campaign.goal_amount - campaign.amount_gathered
                raise serializers.ValidationError({
                    "amount": f"Maximum donation amount available is {remaining}."
                })

        return data