from rest_framework import serializers
from .models import Organization
from .models import Campaign

class OrganizationRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Organization
        fields = ['name', 'contact_email', 'password', 'logo', 'org_description']

    def create(self, validated_data):
        return Organization.objects.create_user(**validated_data)
    

from rest_framework import serializers
from .models import Campaign

class CampaignSerializer(serializers.ModelSerializer):

    class Meta:
        model = Campaign
        fields = [
            'id',
            'title',
            'description',
            'goal_amount',
            'status',
            'deadline',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_organization_email(self, obj):
        return obj.organization.contact_email
    

