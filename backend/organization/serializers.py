from rest_framework import serializers
from .models import Organization
from .models import Campaign


# Serializer for Organization model
# This serializer is used to validate and serialize the Organization data. It includes fields for the organization's name, contact email, password, logo, and description.
class OrganizationRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Organization
        fields = ['name', 'contact_email', 'password', 'logo', 'org_description']

    def create(self, validated_data):
        return Organization.objects.create_user(**validated_data)


#saving new password after reset
class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()
    password = serializers.CharField(write_only=True)



# Serializer for Campaign model
# This serializer is used to validate and serialize the Campaign data. It includes fields for the campaign's title, description, goal amount, status, deadline, and category.
class CampaignSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)

    organization_name = serializers.CharField(source='organization.name',read_only=True)

    class Meta:
        model = Campaign
        fields = [
            'id',
            'title',
            'description',
            'goal_amount',
            'status',
            'deadline',
            'created_at',
            'category',
            'amount_gathered',
            'organization_name'
        ]
        read_only_fields = ['id', 'created_at']

   

